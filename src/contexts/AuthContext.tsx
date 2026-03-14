import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  avatar?: string;
  role?: string;
  tenantId?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userProfile: UserProfile | null;
  userId: string | null;
  login: (email: string) => void;
  logout: () => void;
  updateUserProfile: (profileUpdates: Partial<UserProfile>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const getDefaultProfile = (email: string): UserProfile => ({
  firstName: email.split('@')[0].split('.')[0] || 'User',
  lastName: email.split('@')[0].split('.')[1] || '',
  email,
  phone: '',
  timezone: 'America/Chicago',
  language: 'English',
  avatar: ''
});

const fetchProfile = async (userId: string, email: string): Promise<UserProfile> => {
  let profile: UserProfile = getDefaultProfile(email);

  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileData) {
      const names = (profileData.full_name || '').split(' ');
      profile = {
        firstName: names[0] || email.split('@')[0],
        lastName: names.slice(1).join(' ') || '',
        email: profileData.email || email,
        phone: '',
        timezone: 'America/Chicago',
        language: 'English',
        avatar: '',
      };
    }
  } catch (err) {
    console.warn('Could not fetch profile, using defaults:', err);
  }

  // Resolve tenant membership
  try {
    const { data: membership } = await supabase
      .from('user_tenants')
      .select('tenant_id, role')
      .eq('user_id', userId)
      .single();

    if (membership) {
      profile.tenantId = membership.tenant_id;
      profile.role = membership.role;
    }
  } catch (err) {
    console.warn('Could not fetch tenant membership:', err);
  }

  return profile;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // Guard against double-resolution (initial getSession + onAuthStateChange both firing)
  const initialResolved = useRef(false);

  useEffect(() => {
    let mounted = true;

    const resolveAuthFromSession = async (session: import("@supabase/supabase-js").Session | null) => {
      if (!mounted) return;

      if (session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email ?? null);
        setUserId(session.user.id);
        try {
          const profile = await fetchProfile(session.user.id, session.user.email ?? '');
          if (mounted) setUserProfile(profile);
        } catch {
          if (mounted) setUserProfile(getDefaultProfile(session.user.email ?? ''));
        }
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", session.user.email ?? '');
      } else {
        // No Supabase session — fall back to legacy localStorage auth
        const authStatus = localStorage.getItem("isAuthenticated");
        const email = localStorage.getItem("userEmail");
        const storedProfile = localStorage.getItem("userProfile");
        const loginTimestamp = localStorage.getItem("loginTimestamp");
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const isNotExpired = loginTimestamp && Date.now() - parseInt(loginTimestamp) < thirtyDaysInMs;

        if (mounted && authStatus === "true" && email && isNotExpired) {
          setIsAuthenticated(true);
          setUserEmail(email);
          if (storedProfile) {
            try { setUserProfile(JSON.parse(storedProfile)); } catch { setUserProfile(getDefaultProfile(email)); }
          } else {
            setUserProfile(getDefaultProfile(email));
          }
        } else if (authStatus === "true") {
          // Expired — clean up
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userProfile");
          localStorage.removeItem("loginTimestamp");
        }
      }

      if (mounted) setLoading(false);
    };

    // FIX: Explicitly call getSession() so we don't rely solely on onAuthStateChange
    // firing on mount. onAuthStateChange may not fire synchronously for the initial
    // session, causing loading to stay true indefinitely.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialResolved.current) {
        initialResolved.current = true;
        resolveAuthFromSession(session);
      }
    }).catch(() => {
      // If getSession fails, still unblock the UI
      if (!initialResolved.current) {
        initialResolved.current = true;
        if (mounted) setLoading(false);
      }
    });

    // onAuthStateChange handles subsequent login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // On INITIAL_SESSION event the getSession() call above already handled it — skip
      if (event === 'INITIAL_SESSION') {
        if (!initialResolved.current) {
          initialResolved.current = true;
          resolveAuthFromSession(session);
        }
        return;
      }

      // For all other events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.) — handle normally
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserId(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email ?? null);
        setUserId(session.user.id);
        try {
          const profile = await fetchProfile(session.user.id, session.user.email ?? '');
          if (mounted) setUserProfile(profile);
        } catch {
          if (mounted) setUserProfile(getDefaultProfile(session.user.email ?? ''));
        }
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", session.user.email ?? '');
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    const defaultProfile = getDefaultProfile(email);
    setUserProfile(defaultProfile);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
    localStorage.setItem("loginTimestamp", Date.now().toString());
    console.log("User logged in and session saved:", email);
  };

  const logout = async () => {
    console.log("Starting logout process...");
    await supabase.auth.signOut().catch(() => {});

    setIsAuthenticated(false);
    setUserEmail(null);
    setUserProfile(null);
    setUserId(null);

    const authKeys = [
      "isAuthenticated",
      "userEmail",
      "userProfile",
      "loginTimestamp",
    ];
    authKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });

    console.log("User logged out and all auth data cleared");
  };

  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    setUserProfile((prevProfile) => {
      if (!prevProfile) return null;
      const updatedProfile = { ...prevProfile, ...profileUpdates };
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  const value = {
    isAuthenticated,
    userEmail,
    userId,
    userProfile,
    login,
    logout,
    updateUserProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

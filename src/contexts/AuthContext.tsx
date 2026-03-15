import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
        phone: (profileData as any).phone || '',
        timezone: (profileData as any).timezone || 'America/Chicago',
        language: (profileData as any).language || 'English',
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

  useEffect(() => {
    // Listen for Supabase auth state changes (handles session restore + login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email ?? null);
        setUserId(session.user.id);
        // Fetch profile + tenant membership from DB
        const profile = await fetchProfile(session.user.id, session.user.email ?? '');
        setUserProfile(profile);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", session.user.email ?? '');
      } else {
        // No active session — check legacy localStorage auth
        const authStatus = localStorage.getItem("isAuthenticated");
        const email = localStorage.getItem("userEmail");
        const storedProfile = localStorage.getItem("userProfile");
        const loginTimestamp = localStorage.getItem("loginTimestamp");
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const isNotExpired = loginTimestamp && Date.now() - parseInt(loginTimestamp) < thirtyDaysInMs;

        if (authStatus === "true" && email && isNotExpired) {
          setIsAuthenticated(true);
          setUserEmail(email);
          if (storedProfile) {
            try { setUserProfile(JSON.parse(storedProfile)); } catch { setUserProfile(getDefaultProfile(email)); }
          } else {
            setUserProfile(getDefaultProfile(email));
          }
        } else {
          // Clear expired/missing auth
          if (authStatus === "true") {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userProfile");
            localStorage.removeItem("loginTimestamp");
          }
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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

    // Clear all auth state
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserProfile(null);

    // Comprehensive localStorage cleanup
    const authKeys = [
      "isAuthenticated",
      "userEmail",
      "userProfile",
      "loginTimestamp",
    ];
    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`Removed ${key} from localStorage`);
    });

    // Remove any potential Supabase auth keys (if any exist)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
        console.log(`Removed Supabase key: ${key}`);
      }
    });

    console.log("User logged out and all auth data cleared");
  };

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>) => {
    setUserProfile((prevProfile) => {
      if (!prevProfile) return null;
      const updatedProfile = { ...prevProfile, ...profileUpdates };

      // Store in localStorage for persistence
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      return updatedProfile;
    });

    // Persist to Supabase profiles table
    if (userId) {
      const fullName = [profileUpdates.firstName, profileUpdates.lastName]
        .filter(Boolean)
        .join(" ");
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName || undefined,
          phone: profileUpdates.phone,
          timezone: profileUpdates.timezone,
          language: profileUpdates.language,
        })
        .eq("id", userId);

      if (error) {
        console.error("Failed to persist profile to Supabase:", error);
      }
    }
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

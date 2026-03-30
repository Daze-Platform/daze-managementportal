import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Smartphone,
  Bell,
  Shield,
  CreditCard,
  User,
  Landmark,
  Check,
  Building2,
  Plug,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DestinationManagement } from "@/components/settings/DestinationManagement";
import { ResortVenueMapping } from "@/components/settings/ResortVenueMapping";
import { AddBankAccountDialog } from "@/components/settings/AddBankAccountDialog";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { POSIntegration } from "@/components/settings/POSIntegration";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "10% fee charged to customers at checkout",
    features: [
      "Beach & Pool ordering/delivery",
      "Table Order & Pay",
      "Table management software",
      "Courier portal",
      "Full management suite",
      "Standard support",
    ],
    commission: "10% to customer",
    popular: false,
  },
  {
    id: "commission",
    name: "Commission",
    price: "$0",
    period: "/month",
    description: "10% from every order — no cost to your customers",
    features: [
      "Beach & Pool ordering/delivery",
      "Table Order & Pay",
      "Table management software",
      "Courier portal",
      "Full management suite",
      "Priority support",
    ],
    commission: "10% from orders",
    popular: true,
  },
];

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
};

export const Settings = () => {
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  const [isAddBankDialogOpen, setIsAddBankDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const initialProfileDataRef = useRef<ProfileData | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const defaultData: ProfileData = {
      firstName: userProfile?.firstName || "Manuel",
      lastName: userProfile?.lastName || "Rodriguez",
      email: userProfile?.email || "manuel.rodriguez@restaurant.com",
      phone: userProfile?.phone || "+1 850 555 0123",
      timezone: userProfile?.timezone || "America/Chicago",
      language: userProfile?.language || "English",
    };
    initialProfileDataRef.current = defaultData;
    return defaultData;
  });

  // Update local state when userProfile changes, and also reset initialProfileDataRef
  useEffect(() => {
    if (userProfile) {
      const updatedData: ProfileData = {
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        timezone: userProfile.timezone || "",
        language: userProfile.language || "",
      };
      setProfileData(updatedData);
      initialProfileDataRef.current = updatedData; // Reset initial data when userProfile changes
    }
  }, [userProfile]);

  const hasUnsavedChanges = initialProfileDataRef.current
    ? JSON.stringify(profileData) !==
      JSON.stringify(initialProfileDataRef.current)
    : false;

  const handleCancelChanges = () => {
    if (initialProfileDataRef.current) {
      setProfileData(initialProfileDataRef.current);
    }
    toast({
      title: "Changes discarded",
      description: "Your unsaved changes have been reverted.",
      variant: "destructive",
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating profile:", profileData);

    updateUserProfile(profileData);

    initialProfileDataRef.current = profileData;

    toast({
      title: "Profile updated successfully",
      description: `Changes saved for ${profileData.firstName} ${profileData.lastName}`,
      className: "bg-green-50 border-green-200 text-green-800",
    });
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handlePlanChange = (planId: string) => {
    setCurrentPlan(planId);
    console.log("Changing plan to:", planId);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password updated successfully" });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Failed to update password", description: message, variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4 sm:space-y-6"
        >
          <Card className="sticky top-0 z-10 overflow-hidden p-1">
            <div
              className="overflow-x-auto scrollbar-none"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <TabsList
                variant="underlined"
                className="inline-flex w-full sm:grid sm:grid-cols-6 bg-transparent border-b border-gray-200 p-0"
              >
                <TabsTrigger
                  value="profile"
                  variant="underlined"
                  className="flex items-center space-x-1 sm:space-x-2 text-sm whitespace-nowrap px-3 py-2 pb-3 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Prof</span>
                </TabsTrigger>
                <TabsTrigger
                  value="destinations"
                  variant="underlined"
                  className="flex items-center space-x-1 sm:space-x-2 text-sm whitespace-nowrap px-3 py-2 pb-3 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Destinations</span>
                  <span className="sm:hidden">Dest</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  variant="underlined"
                  className="flex items-center space-x-1 sm:space-x-2 text-sm whitespace-nowrap px-3 py-2 pb-3 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Notifications</span>
                  <span className="sm:hidden">Not</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  variant="underlined"
                  className="flex items-center space-x-1 sm:space-x-2 text-sm whitespace-nowrap px-3 py-2 pb-3 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Security</span>
                  <span className="sm:hidden">Sec</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pos"
                  variant="underlined"
                  className="flex items-center space-x-1 sm:space-x-2 text-sm whitespace-nowrap px-3 py-2 pb-3 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Plug className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">POS Integration</span>
                  <span className="sm:hidden">POS</span>
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  variant="underlined"
                  className="flex items-center space-x-1 sm:space-x-2 text-sm whitespace-nowrap px-3 py-2 pb-3 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Billing</span>
                  <span className="sm:hidden">Bill</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Card>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  id="profile-form"
                  onSubmit={handleProfileUpdate}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={profileData.timezone}
                        onValueChange={(value) =>
                          setProfileData({ ...profileData, timezone: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Chicago">
                            America/Chicago
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            America/New_York
                          </SelectItem>
                          <SelectItem value="Europe/London">
                            Europe/London
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={profileData.language}
                        onValueChange={(value) =>
                          setProfileData({ ...profileData, language: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="relative">
                    {hasUnsavedChanges && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destinations" className="space-y-6">
            <DestinationManagement />
            <div>
              <h3 className="text-sm font-semibold mb-3">Venue Availability by Resort</h3>
              <ResortVenueMapping />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <Label
                        htmlFor="email-notifications"
                        className="text-base font-medium"
                      >
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receive updates and alerts via email
                      </p>
                    </div>
                  </div>
                  <Toggle
                    id="email-notifications"
                    pressed={notifications.email}
                    onPressedChange={(pressed) =>
                      setNotifications({ ...notifications, email: pressed })
                    }
                    variant="outline"
                    className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                  >
                    {notifications.email ? "ON" : "OFF"}
                  </Toggle>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Bell className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <Label
                        htmlFor="push-notifications"
                        className="text-base font-medium"
                      >
                        Push Notifications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receive push notifications in browser
                      </p>
                    </div>
                  </div>
                  <Toggle
                    id="push-notifications"
                    pressed={notifications.push}
                    onPressedChange={(pressed) =>
                      setNotifications({ ...notifications, push: pressed })
                    }
                    variant="outline"
                    className="data-[state=on]:bg-green-500 data-[state=on]:text-white"
                  >
                    {notifications.push ? "ON" : "OFF"}
                  </Toggle>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Smartphone className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <Label
                        htmlFor="sms-notifications"
                        className="text-base font-medium"
                      >
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receive updates via text message
                      </p>
                    </div>
                  </div>
                  <Toggle
                    id="sms-notifications"
                    pressed={notifications.sms}
                    onPressedChange={(pressed) =>
                      setNotifications({ ...notifications, sms: pressed })
                    }
                    variant="outline"
                    className="data-[state=on]:bg-purple-500 data-[state=on]:text-white"
                  >
                    {notifications.sms ? "ON" : "OFF"}
                  </Toggle>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Push Notifications Settings */}
            <NotificationSettings />

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    <Button onClick={handlePasswordChange} disabled={passwordLoading}>{passwordLoading ? "Updating..." : "Update Password"}</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" onClick={() => toast({ title: "Two-factor authentication", description: "2FA setup coming soon. Contact support at support@dazeapp.com to enable it early." })}>Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pos">
            <POSIntegration />
          </TabsContent>

          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Plan Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plans</CardTitle>
                  <p className="text-sm text-gray-600">
                    Choose how you want to handle fees. Both plans include the
                    full suite of products.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative rounded-lg border-2 p-6 transition-all ${
                          currentPlan === plan.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${plan.popular ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500">
                            Most Popular
                          </Badge>
                        )}

                        <div className="text-center">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <div className="mt-2">
                            <span className="text-3xl font-bold">
                              {plan.price}
                            </span>
                            <span className="text-gray-500">{plan.period}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            {plan.description}
                          </p>
                          <div className="mt-3">
                            <Badge variant="outline" className="text-xs">
                              {plan.commission}
                            </Badge>
                          </div>
                        </div>

                        <ul className="mt-6 space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          className="mt-6 w-full"
                          variant={
                            currentPlan === plan.id ? "default" : "outline"
                          }
                          onClick={() => handlePlanChange(plan.id)}
                          disabled={currentPlan === plan.id}
                        >
                          {currentPlan === plan.id
                            ? "Current Plan"
                            : "Select Plan"}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-800">
                          Commission Information
                        </h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Commission fees are automatically added to customer
                          orders and deducted from your payouts. Your customers
                          will see this fee during checkout as "Service Fee".
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/24</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Landmark className="h-6 w-6 text-gray-500" />
                      <div>
                        <p className="font-medium">Bank Account</p>
                        <p className="text-sm text-gray-500">
                          Connect your bank account to make payments.
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddBankDialogOpen(true)}
                    >
                      Add account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Free Plan - December 2021</p>
                        <p className="text-sm text-gray-500">Dec 1, 2021</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$0.00</p>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <AddBankAccountDialog
          isOpen={isAddBankDialogOpen}
          onOpenChange={setIsAddBankDialogOpen}
        />
      </div>

      {/* Sticky Save Bar */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 shadow-lg z-50"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <p className="text-sm text-gray-700">You have unsaved changes.</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelChanges}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProfileUpdate}
                  type="submit"
                  form="profile-form"
                  className="relative"
                >
                  {hasUnsavedChanges && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

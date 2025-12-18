
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Smartphone, Bell, Shield, CreditCard, User, Landmark, Check, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DestinationManagement } from '@/components/settings/DestinationManagement';
import { AddBankAccountDialog } from '@/components/settings/AddBankAccountDialog';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: '10% fee charged to customers at checkout',
    features: [
      'Beach & Pool ordering/delivery',
      'Table Order & Pay',
      'Table management software',
      'Courier portal',
      'Full management suite',
      'Standard support'
    ],
    commission: '10% to customer',
    popular: false,
  },
  {
    id: 'commission',
    name: 'Commission',
    price: '$0',
    period: '/month',
    description: '10% from every order — no cost to your customers',
    features: [
      'Beach & Pool ordering/delivery',
      'Table Order & Pay',
      'Table management software',
      'Courier portal',
      'Full management suite',
      'Priority support'
    ],
    commission: '10% from orders',
    popular: true,
  }
];

export const Settings = () => {
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const [isAddBankDialogOpen, setIsAddBankDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');

  const [profileData, setProfileData] = useState({
    firstName: userProfile?.firstName || 'Manuel',
    lastName: userProfile?.lastName || 'Rodriguez',
    email: userProfile?.email || 'manuel.rodriguez@restaurant.com',
    phone: userProfile?.phone || '+1 850 555 0123',
    timezone: userProfile?.timezone || 'America/Chicago',
    language: userProfile?.language || 'English'
  });

  // Update local state when userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        timezone: userProfile.timezone,
        language: userProfile.language
      });
    }
  }, [userProfile]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating profile:', profileData);
    
    // Update the user profile in AuthContext
    updateUserProfile(profileData);
    
    // Show success toast
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
    console.log('Changing plan to:', planId);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          <div className="sticky top-0 z-10 bg-gray-50 pb-4 border-b border-border">
            <div className="overflow-x-auto scrollbar-none" style={{ scrollBehavior: 'smooth' }}>
              <TabsList className="grid w-full grid-cols-5 min-w-[500px] sm:min-w-0 bg-background mx-auto">
                <TabsTrigger value="profile" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Prof</span>
                </TabsTrigger>
                <TabsTrigger value="destinations" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Destinations</span>
                  <span className="sm:hidden">Dest</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Notifications</span>
                  <span className="sm:hidden">Not</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Security</span>
                  <span className="sm:hidden">Sec</span>
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap">
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Billing</span>
                  <span className="sm:hidden">Bill</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={profileData.timezone} onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={profileData.language} onValueChange={(value) => setProfileData({ ...profileData, language: value })}>
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

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-6">
          <DestinationManagement />
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
                    <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
                  </div>
                </div>
                <Toggle
                  id="email-notifications"
                  pressed={notifications.email}
                  onPressedChange={(pressed) => setNotifications({ ...notifications, email: pressed })}
                  variant="outline"
                  className="data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                >
                  {notifications.email ? 'ON' : 'OFF'}
                </Toggle>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Bell className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <Label htmlFor="push-notifications" className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                  </div>
                </div>
                <Toggle
                  id="push-notifications"
                  pressed={notifications.push}
                  onPressedChange={(pressed) => setNotifications({ ...notifications, push: pressed })}
                  variant="outline"
                  className="data-[state=on]:bg-green-500 data-[state=on]:text-white"
                >
                  {notifications.push ? 'ON' : 'OFF'}
                </Toggle>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Smartphone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates via text message</p>
                  </div>
                </div>
                <Toggle
                  id="sms-notifications"
                  pressed={notifications.sms}
                  onPressedChange={(pressed) => setNotifications({ ...notifications, sms: pressed })}
                  variant="outline"
                  className="data-[state=on]:bg-purple-500 data-[state=on]:text-white"
                >
                  {notifications.sms ? 'ON' : 'OFF'}
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
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <p className="text-sm text-gray-600">
                  Choose how you want to handle fees. Both plans include the full suite of products.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-lg border-2 p-6 transition-all ${
                        currentPlan === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500">
                          Most Popular
                        </Badge>
                      )}
                      
                      <div className="text-center">
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">{plan.price}</span>
                          <span className="text-gray-500">{plan.period}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
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
                        variant={currentPlan === plan.id ? "default" : "outline"}
                        onClick={() => handlePlanChange(plan.id)}
                        disabled={currentPlan === plan.id}
                      >
                        {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
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
                      <h4 className="font-medium text-amber-800">Commission Information</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Commission fees are automatically added to customer orders and deducted from your payouts. 
                        Your customers will see this fee during checkout as "Service Fee".
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
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-gray-500" />
                    <div>
                      <p className="font-medium">Bank Account</p>
                      <p className="text-sm text-gray-500">Connect your bank account to make payments.</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsAddBankDialogOpen(true)}>
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
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <AddBankAccountDialog isOpen={isAddBankDialogOpen} onOpenChange={setIsAddBankDialogOpen} />
      </div>
    </div>
  );
};

import React from 'react';
import { Bell, BellOff, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const NotificationSettings = () => {
  const {
    permission,
    subscription,
    isSupported,
    isLoading,
    requestPermission,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications();

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Enabled</Badge>;
      case 'denied':
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="secondary">Not Set</Badge>;
    }
  };

  const getStatusDescription = () => {
    if (!isSupported) {
      return "Push notifications are not supported in this browser.";
    }
    
    switch (permission) {
      case 'granted':
        return subscription 
          ? "You're subscribed to push notifications for order updates, alerts, and important messages."
          : "Notifications are enabled but subscription is pending.";
      case 'denied':
        return "Notifications are blocked. Please enable them in your browser settings to receive important updates.";
      default:
        return "Enable push notifications to receive real-time updates about orders, alerts, and important messages.";
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
          {getPermissionBadge()}
        </CardTitle>
        <CardDescription>
          {getStatusDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {permission !== 'granted' ? (
            <Button 
              onClick={requestPermission}
              disabled={isLoading || permission === 'denied'}
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              {isLoading ? 'Requesting...' : 'Enable Notifications'}
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={unsubscribe}
              disabled={isLoading || !subscription}
              className="flex items-center gap-2"
            >
              <BellOff className="h-4 w-4" />
              {isLoading ? 'Disabling...' : 'Disable Notifications'}
            </Button>
          )}
          
          {permission === 'granted' && (
            <Button 
              variant="secondary"
              onClick={sendTestNotification}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Send Test
            </Button>
          )}
        </div>

        {permission === 'denied' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">To enable notifications:</h4>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Change notifications from "Block" to "Allow"</li>
              <li>Refresh this page and try again</li>
            </ol>
          </div>
        )}

        {subscription && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Notification Types You'll Receive:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• New order alerts</li>
              <li>• Order status updates</li>
              <li>• System alerts and maintenance notices</li>
              <li>• Performance notifications</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
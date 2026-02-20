import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface PushNotificationPermission {
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  isSupported: boolean;
}

export const usePushNotifications = () => {
  const [notificationState, setNotificationState] =
    useState<PushNotificationPermission>({
      permission: "default",
      subscription: null,
      isSupported: false,
    });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if push notifications are supported
    const isSupported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;

    setNotificationState((prev) => ({
      ...prev,
      permission: Notification.permission,
      isSupported,
    }));

    if (isSupported) {
      // Register service worker
      registerServiceWorker();
      // Get existing subscription if any
      getExistingSubscription();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration =
        await navigator.serviceWorker.register("/sw.js?v=20260107");
      console.log("Service Worker registered:", registration);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  };

  const getExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      setNotificationState((prev) => ({
        ...prev,
        subscription,
      }));
    } catch (error) {
      console.error("Failed to get existing subscription:", error);
    }
  };

  const requestPermission = async () => {
    if (!notificationState.isSupported) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const permission = await Notification.requestPermission();

      setNotificationState((prev) => ({
        ...prev,
        permission,
      }));

      if (permission === "granted") {
        toast({
          title: "Notifications Enabled",
          description:
            "You'll now receive push notifications for important updates.",
        });
        await subscribeToPush();
        return true;
      } else if (permission === "denied") {
        toast({
          title: "Notifications Blocked",
          description:
            "Please enable notifications in your browser settings to receive updates.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      toast({
        title: "Permission Error",
        description:
          "Failed to request notification permission. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // For demo purposes, we'll skip the actual push subscription
      // In production, you'd need valid VAPID keys from your server
      console.log("Push subscription setup (demo mode)");

      // Simulate a subscription object for the UI
      const mockSubscription = {
        endpoint: "demo-endpoint",
        unsubscribe: async () => true,
      } as unknown as PushSubscription;

      setNotificationState((prev) => ({
        ...prev,
        subscription: mockSubscription,
      }));

      // Store demo subscription in localStorage
      localStorage.setItem("pushSubscription", JSON.stringify({ demo: true }));

      console.log("Demo push subscription created");
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      toast({
        title: "Subscription Error",
        description: "Failed to set up push notifications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unsubscribe = async () => {
    if (!notificationState.subscription) return;

    setIsLoading(true);

    try {
      // For demo mode, just clear the state
      setNotificationState((prev) => ({
        ...prev,
        subscription: null,
      }));

      localStorage.removeItem("pushSubscription");

      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive push notifications.",
      });
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      toast({
        title: "Unsubscribe Error",
        description: "Failed to disable push notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = () => {
    if (
      !notificationState.isSupported ||
      notificationState.permission !== "granted"
    ) {
      toast({
        title: "Cannot Send Notification",
        description: "Please enable notifications first.",
        variant: "destructive",
      });
      return;
    }

    // Send a local notification for testing
    new Notification("Test Notification", {
      body: "This is a test notification from your restaurant management portal.",
      icon: "/favicon.ico",
      tag: "test-notification",
    });

    toast({
      title: "Test Notification Sent",
      description: "Check if you received the notification.",
    });
  };

  return {
    ...notificationState,
    isLoading,
    requestPermission,
    unsubscribe,
    sendTestNotification,
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

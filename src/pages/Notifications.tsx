import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertCircle, Info, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Refund Processed',
      message: 'Successfully refunded $10.00 for order #67899886', 
      time: '2 min ago', 
      unread: true, 
      type: 'success' 
    },
    { 
      id: 2, 
      title: 'Menu Update',
      message: 'Menu item "Crispy Burger" updated successfully', 
      time: '1 hour ago', 
      unread: false, 
      type: 'info' 
    },
    { 
      id: 3, 
      title: 'Report Available',
      message: 'Daily sales report is now available for download', 
      time: '3 hours ago', 
      unread: false, 
      type: 'info' 
    },
    { 
      id: 4, 
      title: 'Order Alert',
      message: 'Order #67899887 is taking longer than expected', 
      time: '5 hours ago', 
      unread: true, 
      type: 'warning' 
    },
    { 
      id: 5, 
      title: 'Payment Failed',
      message: 'Payment for order #67899888 has failed', 
      time: '1 day ago', 
      unread: false, 
      type: 'error' 
    },
    { 
      id: 6, 
      title: 'New Review',
      message: 'You received a 5-star review for "Grilled Chicken"', 
      time: '2 days ago', 
      unread: false, 
      type: 'success' 
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    });
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "All notifications have been removed.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string, unread: boolean) => {
    if (!unread) return 'bg-gray-50';
    
    switch (type) {
      case 'success': return 'bg-green-50 border-l-4 border-l-green-500';
      case 'warning': return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      case 'error': return 'bg-red-50 border-l-4 border-l-red-500';
      case 'info': return 'bg-blue-50 border-l-4 border-l-blue-500';
      default: return 'bg-blue-50 border-l-4 border-l-blue-500';
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  All caught up!
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark all read
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleClearAll}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">We'll notify you when something important happens</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div 
                key={notification.id} 
                className={`p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 group ${
                  getNotificationBg(notification.type, notification.unread)
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      notification.unread ? 'bg-white shadow-sm ring-2 ring-white' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`text-base font-semibold leading-tight ${
                          notification.unread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mt-2 leading-relaxed ${
                          notification.unread ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-3 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1.5" />
                          {notification.time}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {notification.unread && (
                          <div className="flex-shrink-0">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              New
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {notification.unread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                            >
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

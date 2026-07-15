import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  UserCircle,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "success" | "warning" | "error" | "info";
  route: string;
}

interface ProfileDropdownProps {
  userProfile: any;
  onProfileAction: (action: string) => void;
}

export const ProfileDropdown = ({
  userProfile,
  onProfileAction,
}: ProfileDropdownProps) => {
  const getFullName = () => {
    if (!userProfile) return "User";
    return `${userProfile.firstName} ${userProfile.lastName}`;
  };

  const getUserInitials = () => {
    if (!userProfile) return "U";
    return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={userProfile?.avatar} alt={getFullName()} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getFullName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onProfileAction("profile")}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onProfileAction("settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onProfileAction("logout")}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onClick: (notification: Notification) => void;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onClick,
}: NotificationItemProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBg = (type: string, unread: boolean) => {
    if (!unread) return "bg-gray-50";
    switch (type) {
      case "success":
        return "bg-green-50 border-l-4 border-l-green-500";
      case "warning":
        return "bg-yellow-50 border-l-4 border-l-yellow-500";
      case "error":
        return "bg-red-50 border-l-4 border-l-red-500";
      case "info":
        return "bg-primary/10 border-l-4 border-l-blue-500";
      default:
        return "bg-primary/10 border-l-4 border-l-blue-500";
    }
  };

  return (
    <button
      onClick={() => onClick(notification)}
      className={`w-full text-left p-4 rounded-lg transition-colors hover:opacity-80 ${getBg(notification.type, notification.unread)}`}
    >
      <div className="flex gap-3">
        {getIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`text-sm font-medium ${notification.unread ? "text-foreground" : "text-muted-foreground"}`}
            >
              {notification.title}
            </p>
            {notification.unread && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {notification.time}
          </p>
        </div>
      </div>
    </button>
  );
};

interface NotificationsPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onViewAll: () => void;
}

export const NotificationsPanel = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onNotificationClick,
  onMarkAllAsRead,
  onClearAll,
  onViewAll,
}: NotificationsPanelProps) => {
  return (
    <div className="w-96 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Notifications</h3>
        {unreadCount > 0 && (
          <Badge variant="default" className="text-xs">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {notifications.length > 0 ? (
        <>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={onMarkAsRead}
                onClick={onNotificationClick}
              />
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="flex-1 text-xs"
            >
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="flex-1 text-xs"
            >
              Clear all
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAll}
            className="w-full text-xs"
          >
            View all notifications
          </Button>
        </>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          No notifications
        </p>
      )}
    </div>
  );
};

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  placeholder?: string;
}

export const SearchInput = ({
  searchQuery,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  placeholder = "Search...",
}: SearchInputProps) => {
  return (
    <div className="relative hidden md:block flex-1 max-w-xs">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onSearchFocus}
        onBlur={onSearchBlur}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full text-sm transition-all duration-200 hover:border-gray-400"
      />
    </div>
  );
};

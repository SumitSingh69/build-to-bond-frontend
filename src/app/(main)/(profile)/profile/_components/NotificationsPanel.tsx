"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Gift, 
  Settings, 
  Shield, 
  Trophy, 
  Camera, 
  UserCheck,
  Megaphone,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationItem, NotificationTab } from "../types";

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAsRead?: (notificationId: string) => void;
  hideHeader?: boolean;
  className?: string;
}

export default function NotificationsPanel({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  hideHeader = false,
  className = "",
}: NotificationsPanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = (searchParams.get("tab") as NotificationTab) || "system";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/profile?${params.toString()}`);
  };

  const getTabIcon = (tab: NotificationTab) => {
    switch (tab) {
      case "system":
        return <Settings className="w-4 h-4" />;
      case "crush":
        return <Heart className="w-4 h-4" />;
      case "chat":
        return <MessageCircle className="w-4 h-4" />;
      case "offers":
        return <Gift className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getSystemNotificationIcon = (notification: NotificationItem) => {
    if (notification.type !== "system") {
      return getTabIcon(notification.type);
    }

    // Determine icon based on system notification content
    const title = notification.title.toLowerCase();
    const message = notification.message.toLowerCase();

    if (title.includes("welcome") || message.includes("welcome")) {
      return <UserCheck className="w-4 h-4 text-green-600" />;
    }
    if (title.includes("password") || message.includes("password") || title.includes("security")) {
      return <Shield className="w-4 h-4 text-blue-600" />;
    }
    if (title.includes("profile") && (title.includes("complete") || title.includes("progress"))) {
      return <Trophy className="w-4 h-4 text-yellow-600" />;
    }
    if (title.includes("picture") || title.includes("photo") || message.includes("picture")) {
      return <Camera className="w-4 h-4 text-purple-600" />;
    }
    if (title.includes("announcement") || message.includes("announcement")) {
      return <Megaphone className="w-4 h-4 text-red-600" />;
    }
    if (title.includes("success") || message.includes("successfully")) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    
    // Default system icon
    return <Settings className="w-4 h-4 text-gray-600" />;
  };

  const filterNotificationsByType = (type: NotificationTab) => {
    return notifications.filter((notification) => notification.type === type);
  };

  const getUnreadCount = (type: NotificationTab) => {
    return filterNotificationsByType(type).filter((n) => !n.read).length;
  };

  const formatTimestamp = (timestamp: Date | string) => {
    try {
      // Handle cases where timestamp might be a string or invalid
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "unknown";
      }

      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) return "now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;

      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting timestamp:", error, timestamp);
      return "unknown";
    }
  };

  const NotificationCard = ({
    notification,
  }: {
    notification: NotificationItem;
  }) => (
    <Card
      className={`mb-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 border ${
        !notification.read
          ? "border-primary-200 bg-primary-50/30 hover:bg-primary-50/50"
          : "border-gray-100 hover:border-gray-200"
      }`}
      onClick={() => {
        if (onNotificationClick) {
          onNotificationClick(notification);
        }
        if (!notification.read && onMarkAsRead) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      <CardContent>
        <div className="flex items-start space-x-2">
          <Avatar className={`w-8 h-8 flex-shrink-0 ${
            notification.type === "system" 
              ? "bg-gradient-to-br from-blue-100 to-blue-200" 
              : "bg-gradient-to-br from-primary-200 to-primary-300"
          }`}>
            <AvatarImage src={notification.avatar} alt="" />
            <AvatarFallback className={`text-xs ${
              notification.type === "system" 
                ? "bg-gradient-to-br from-blue-100 to-blue-200" 
                : "bg-gradient-to-br from-primary-200 to-primary-300"
            }`}>
              {getSystemNotificationIcon(notification)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`text-xs font-semibold truncate ${
                notification.type === "system" ? "text-blue-800" : "text-gray-800"
              }`}>
                {notification.title}
              </h4>
              <div className="flex items-center space-x-1">
                {!notification.read && (
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    notification.type === "system" ? "bg-blue-500" : "bg-primary-500"
                  }`}></div>
                )}
                <span className="text-[10px] text-gray-500 flex-shrink-0">
                  {formatTimestamp(notification.timestamp)}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TabContent = ({
    type,
    isSheet = false,
  }: {
    type: NotificationTab;
    isSheet?: boolean;
  }) => {
    const typeNotifications = filterNotificationsByType(type);

    if (typeNotifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-32 text-center py-6">
          <div className="text-gray-300 mb-2">{getTabIcon(type)}</div>
          <p className="text-gray-500 text-xs">No {type} notifications</p>
          <p className="text-gray-400 text-[10px] mt-1">
            You&apos;ll see {type} updates here
          </p>
        </div>
      );
    }

    const scrollHeight = isSheet
      ? "h-[calc(100vh-10rem)]"
      : "h-[calc(100vh-16rem)]";

    return (
      <ScrollArea className={`${scrollHeight} pr-2 scrollbar-hide`}>
        {typeNotifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </ScrollArea>
    );
  };

  return (
    <div className={hideHeader ? className : ""} suppressHydrationWarning>
      {hideHeader ? (
        <>
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
              <TabsList className="grid w-full grid-cols-4 mx-3 mb-3 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto">
                <TabsTrigger
                  value="system"
                  className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                >
                  {getTabIcon("system")}
                  {getUnreadCount("system") > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                      {getUnreadCount("system")}
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="crush"
                  className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                >
                  {getTabIcon("crush")}
                  {getUnreadCount("crush") > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                      {getUnreadCount("crush")}
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                >
                  {getTabIcon("chat")}
                  {getUnreadCount("chat") > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                      {getUnreadCount("chat")}
                    </div>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="offers"
                  className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                >
                  {getTabIcon("offers")}
                  {getUnreadCount("offers") > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                      {getUnreadCount("offers")}
                    </div>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="px-3 pb-3">
                <TabsContent value="system" className="m-0">
                  <TabContent type="system" isSheet={true} />
                </TabsContent>
                <TabsContent value="crush" className="m-0">
                  <TabContent type="crush" isSheet={true} />
                </TabsContent>
                <TabsContent value="chat" className="m-0">
                  <TabContent type="chat" isSheet={true} />
                </TabsContent>
                <TabsContent value="offers" className="m-0">
                  <TabContent type="offers" isSheet={true} />
                </TabsContent>
              </div>
            </Tabs>
          </>
        ) : (
          // Regular version - with card and header
          <Card className="w-full lg:w-72 flex-shrink-0 h-fit max-h-[calc(100vh-3rem)] overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                value={currentTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mx-3 mb-3 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto">
                  <TabsTrigger
                    value="system"
                    className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                  >
                    {getTabIcon("system")}
                    {getUnreadCount("system") > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                        {getUnreadCount("system")}
                      </div>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="crush"
                    className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                  >
                    {getTabIcon("crush")}
                    {getUnreadCount("crush") > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                        {getUnreadCount("crush")}
                      </div>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                  >
                    {getTabIcon("chat")}
                    {getUnreadCount("chat") > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                        {getUnreadCount("chat")}
                      </div>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="offers"
                    className="relative flex flex-col items-center py-3 px-2 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none text-gray-500 data-[state=active]:text-primary-600 hover:text-primary-600 transition-colors"
                  >
                    {getTabIcon("offers")}
                    {getUnreadCount("offers") > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                        {getUnreadCount("offers")}
                      </div>
                    )}
                  </TabsTrigger>
                </TabsList>

                <div className="px-3 pb-3">
                  <TabsContent value="system" className="m-0">
                    <TabContent type="system" />
                  </TabsContent>
                  <TabsContent value="crush" className="m-0">
                    <TabContent type="crush" />
                  </TabsContent>
                  <TabsContent value="chat" className="m-0">
                    <TabContent type="chat" />
                  </TabsContent>
                  <TabsContent value="offers" className="m-0">
                    <TabContent type="offers" />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import apiModule from "@/lib/api";

interface SystemAnnouncementTestProps {
  onRefreshNotifications?: () => void;
}

export default function SystemAnnouncementTest({ onRefreshNotifications }: SystemAnnouncementTestProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please enter both title and message");
      return;
    }

    setLoading(true);
    try {
      const response = await apiModule.notificationAPI.sendAnnouncementToAll({
        title: title.trim(),
        message: message.trim(),
      }) as { success: boolean; message: string; data?: { usersNotified: number } };

      if (response.success) {
        toast.success(`System announcement sent to ${response.data?.usersNotified || 0} users`);
        setTitle("");
        setMessage("");
        if (onRefreshNotifications) {
          setTimeout(onRefreshNotifications, 1000);
        }
      } else {
        toast.error("Failed to send announcement");
      }
    } catch (error) {
      console.error("Error sending announcement:", error);
      toast.error("Failed to send announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleTestWelcomeNotification = async () => {
    setLoading(true);
    try {
      const response = await apiModule.notificationAPI.sendAnnouncementToAll({
        title: "Welcome to Build to Bond! 🎉",
        message: "Hi! Welcome to our dating community. Complete your profile to get better matches and start connecting with amazing people.",
      }) as { success: boolean; message: string; data?: { usersNotified: number } };

      if (response.success) {
        toast.success("Test welcome notification sent!");
        if (onRefreshNotifications) {
          setTimeout(onRefreshNotifications, 1000);
        }
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Failed to send test notification");
    } finally {
      setLoading(false);
    }
  };

  const handleTestProfileNotification = async () => {
    setLoading(true);
    try {
      const response = await apiModule.notificationAPI.sendAnnouncementToAll({
        title: "Profile Complete! 🎉",
        message: "Congratulations! Your profile is now 100% complete. You're all set to discover amazing connections.",
      }) as { success: boolean; message: string; data?: { usersNotified: number } };

      if (response.success) {
        toast.success("Test profile notification sent!");
        if (onRefreshNotifications) {
          setTimeout(onRefreshNotifications, 1000);
        }
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Failed to send test notification");
    } finally {
      setLoading(false);
    }
  };

  const handleTestSecurityNotification = async () => {
    setLoading(true);
    try {
      const response = await apiModule.notificationAPI.sendAnnouncementToAll({
        title: "Password Changed Successfully 🔐",
        message: "Your password has been changed successfully. If you didn't make this change, please contact support immediately.",
      }) as { success: boolean; message: string; data?: { usersNotified: number } };

      if (response.success) {
        toast.success("Test security notification sent!");
        if (onRefreshNotifications) {
          setTimeout(onRefreshNotifications, 1000);
        }
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Failed to send test notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-sm">System Notification Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm"
          />
          <Textarea
            placeholder="Announcement message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="text-sm min-h-[80px]"
          />
          <Button
            onClick={handleSendAnnouncement}
            disabled={loading || !title.trim() || !message.trim()}
            className="w-full text-sm"
            size="sm"
          >
            {loading ? "Sending..." : "Send Custom Announcement"}
          </Button>
        </div>

        <div className="border-t pt-4 space-y-2">
          <p className="text-xs text-gray-600 mb-2">Quick Test Notifications:</p>
          <Button
            onClick={handleTestWelcomeNotification}
            disabled={loading}
            variant="outline"
            className="w-full text-xs"
            size="sm"
          >
            Test Welcome Notification
          </Button>
          <Button
            onClick={handleTestProfileNotification}
            disabled={loading}
            variant="outline"
            className="w-full text-xs"
            size="sm"
          >
            Test Profile Complete
          </Button>
          <Button
            onClick={handleTestSecurityNotification}
            disabled={loading}
            variant="outline"
            className="w-full text-xs"
            size="sm"
          >
            Test Security Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
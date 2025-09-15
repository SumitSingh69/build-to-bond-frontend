import { User } from "@/types/auth.types";

export type ProfileUser = User;

export interface ProfileStats {
  crushes: number;
  swipes: number;
  matches: number;
  views: number;
}

export interface ProfileData extends User {
  stats?: ProfileStats;

  name?: string;
  age?: number;
  preference?: string;
}

export interface NotificationItem {
  id: string;
  type: "system" | "crush" | "chat" | "offers";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

export type NotificationTab = "system" | "crush" | "chat" | "offers";

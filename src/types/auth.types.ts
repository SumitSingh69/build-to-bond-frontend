// User types and interfaces
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  bio?: string;
  interests?: string[];
  profilePicture?: string;
  avatar?: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
    coordinates?: number[];
  };
  agePreferences?: {
    min?: number;
    max?: number;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  privacy?: "public" | "private";
  lookingFor?: "friendship" | "relationship" | "casual" | "other";
  height?: number;
  occupation?: string;
  education?: "high_school" | "bachelor" | "master" | "phd" | "other";
  smoking?: "never" | "sometimes" | "regularly" | "prefer_not_to_say";
  drinking?: "never" | "socially" | "regularly" | "prefer_not_to_say";
  relationshipStatus?: "single" | "divorced" | "widowed";
  children?: "none" | "have_children" | "want_children" | "dont_want_children";
  religion?: string;
  languages?: string[];
  subscription?: "free" | "solara";
  isActive?: boolean;
  profileCompleteness?: number;
  createdAt?: string;
  lastActive?: string;
  
  // Additional fields from backend model
  genderPreference?: "men" | "women" | "both" | "other";
  profileViews?: number;
  totalSwipes?: number;
  isVerified?: boolean;
  verificationBadges?: Array<{
    type: "email" | "phone" | "photo" | "social";
    verifiedAt: string;
  }>;
  deviceTokens?: Array<{
    token: string;
    platform: "ios" | "android" | "web";
    createdAt: string;
  }>;
  
  // Dating app specific arrays
  matches?: string[]; // User IDs
  crushes?: string[]; // User IDs
  likes?: Array<{
    userId: string;
    likedAt: string;
  }>;
  passedBy?: Array<{
    userId: string;
    passedAt: string;
  }>;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Auth action types
export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" }
  | { type: "INIT_COMPLETE" };

// Login response interface
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      dob?: string;
      gender?: string;
      bio?: string;
      interests?: string[];
      profilePicture?: string;
      avatar?: string;
      location?: {
        city?: string;
        country?: string;
        coordinates?: number[];
      };
      agePreferences?: {
        min?: number;
        max?: number;
      };
      socialLinks?: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
      };
      privacy?: string;
      lookingFor?: string;
      height?: number;
      occupation?: string;
      education?: string;
      smoking?: string;
      drinking?: string;
      relationshipStatus?: string;
      children?: string;
      religion?: string;
      languages?: string[];
      subscription?: string;
      isActive?: boolean;
      profileCompleteness?: number;
      createdAt?: string;
      lastActive?: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    profileCompleteness: number;
  };
}

// Auth context interface
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>;
  logout: (redirectTo?: string) => void;
  updateProfile: (data: Partial<User>) => void;
  clearError: () => void;
}

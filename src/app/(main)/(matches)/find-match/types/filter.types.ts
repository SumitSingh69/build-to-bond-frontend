export interface AgeRange {
  min: number;
  max: number;
}

export interface HeightRange {
  min: number;
  max: number;
}

export interface LocationFilter {
  city?: string;
  country?: string;
  radius?: number;
}

export interface MatchFilters {
  ageRange?: AgeRange;
  gender?: "male" | "female" | "other";
  genderPreference?: "men" | "women" | "both" | "other";
  location?: LocationFilter;
  lookingFor?: "friendship" | "relationship" | "casual" | "other";

  education?: ("high_school" | "bachelor" | "master" | "phd" | "other")[];
  heightRange?: HeightRange;
  smoking?: ("never" | "sometimes" | "regularly" | "prefer_not_to_say")[];
  drinking?: ("never" | "socially" | "regularly" | "prefer_not_to_say")[];
  children?: (
    | "none"
    | "have_children"
    | "want_children"
    | "dont_want_children"
  )[];
  relationshipStatus?: ("single" | "divorced" | "widowed")[];

  interests?: string[];
  religion?: string;
  languages?: string[];
  isVerified?: boolean;
  lastActiveWithin?: 1 | 7 | 30;
  minProfileCompleteness?: number;
}

export interface FilterOptions {
  educationOptions: { value: string; label: string }[];
  smokingOptions: { value: string; label: string }[];
  drinkingOptions: { value: string; label: string }[];
  childrenOptions: { value: string; label: string }[];
  relationshipStatusOptions: { value: string; label: string }[];
  genderOptions: { value: string; label: string }[];
  genderPreferenceOptions: { value: string; label: string }[];
  lookingForOptions: { value: string; label: string }[];
  lastActiveOptions: { value: number; label: string }[];
  interestOptions: { value: string; label: string }[];
  religionOptions: { value: string; label: string }[];
  languageOptions: { value: string; label: string }[];
}

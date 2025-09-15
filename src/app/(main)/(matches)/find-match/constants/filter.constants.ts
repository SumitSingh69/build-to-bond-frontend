import { FilterOptions } from "../types/filter.types";

export const FILTER_OPTIONS: FilterOptions = {
  educationOptions: [
    { value: "high_school", label: "High School" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "other", label: "Other" },
  ],

  smokingOptions: [
    { value: "never", label: "Never" },
    { value: "sometimes", label: "Sometimes" },
    { value: "regularly", label: "Regularly" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ],

  drinkingOptions: [
    { value: "never", label: "Never" },
    { value: "socially", label: "Socially" },
    { value: "regularly", label: "Regularly" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ],

  childrenOptions: [
    { value: "none", label: "No children" },
    { value: "have_children", label: "Have children" },
    { value: "want_children", label: "Want children" },
    { value: "dont_want_children", label: "Don't want children" },
  ],

  relationshipStatusOptions: [
    { value: "single", label: "Single" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ],

  genderOptions: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ],

  genderPreferenceOptions: [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "both", label: "Both" },
    { value: "other", label: "Other" },
  ],

  lookingForOptions: [
    { value: "friendship", label: "Friendship" },
    { value: "relationship", label: "Relationship" },
    { value: "casual", label: "Casual" },
    { value: "other", label: "Other" },
  ],

  lastActiveOptions: [
    { value: 1, label: "Last 24 hours" },
    { value: 7, label: "Last week" },
    { value: 30, label: "Last month" },
  ],

  interestOptions: [
    { value: "travel", label: "Travel" },
    { value: "music", label: "Music" },
    { value: "movies", label: "Movies" },
    { value: "sports", label: "Sports" },
    { value: "fitness", label: "Fitness" },
    { value: "cooking", label: "Cooking" },
    { value: "reading", label: "Reading" },
    { value: "gaming", label: "Gaming" },
    { value: "art", label: "Art" },
    { value: "photography", label: "Photography" },
    { value: "dancing", label: "Dancing" },
    { value: "hiking", label: "Hiking" },
    { value: "yoga", label: "Yoga" },
    { value: "pets", label: "Pets" },
    { value: "wine", label: "Wine" },
    { value: "coffee", label: "Coffee" },
    { value: "outdoors", label: "Outdoors" },
    { value: "technology", label: "Technology" },
    { value: "fashion", label: "Fashion" },
    { value: "food", label: "Food" },
  ],

  religionOptions: [
    { value: "christian", label: "Christian" },
    { value: "muslim", label: "Muslim" },
    { value: "jewish", label: "Jewish" },
    { value: "hindu", label: "Hindu" },
    { value: "buddhist", label: "Buddhist" },
    { value: "sikh", label: "Sikh" },
    { value: "spiritual", label: "Spiritual" },
    { value: "agnostic", label: "Agnostic" },
    { value: "atheist", label: "Atheist" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ],

  languageOptions: [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "arabic", label: "Arabic" },
    { value: "hindi", label: "Hindi" },
    { value: "russian", label: "Russian" },
    { value: "dutch", label: "Dutch" },
    { value: "swedish", label: "Swedish" },
    { value: "norwegian", label: "Norwegian" },
    { value: "danish", label: "Danish" },
    { value: "polish", label: "Polish" },
    { value: "greek", label: "Greek" },
    { value: "turkish", label: "Turkish" },
    { value: "other", label: "Other" },
  ],
};

export const DEFAULT_FILTERS = {
  ageRange: { min: 18, max: 99 },
  heightRange: { min: 140, max: 220 },
  minProfileCompleteness: 0,
  lastActiveWithin: 30,
};

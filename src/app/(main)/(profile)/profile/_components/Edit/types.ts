import { User } from "@/types/auth.types";
import { LucideIcon } from "lucide-react";

export interface EditProfileFormData extends Partial<User> {
  agePreferences?: {
    min: number;
    max: number;
  };
  location?: {
    address: string;
    city: string;
    country: string;
  };
  socialLinks?: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

export type FormFieldHandler = (
  field: keyof User,
  value: string | number | boolean | undefined
) => void;

export type NestedFieldHandler = (
  section: keyof EditProfileFormData,
  field: string,
  value: string | number
) => void;

export type AgeRangeHandler = (values: number[]) => void;

export interface BaseSectionProps {
  formData: EditProfileFormData;
  onFieldChange: FormFieldHandler;
  onNestedFieldChange: NestedFieldHandler;
}

export interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

export interface BasicInformationSectionProps extends BaseSectionProps {
  getBioCharCount: () => number;
}

export interface DatingPreferencesSectionProps extends BaseSectionProps {
  onAgeRangeChange: AgeRangeHandler;
}

export type PersonalDetailsSectionProps = BaseSectionProps;

export type LocationSectionProps = BaseSectionProps;

"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth.types";
import { Save, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { ScrollArea } from "@/components/ui/scroll-area";

import BasicInformationSection from "./BasicInformationSection";
import DatingPreferencesSection from "./DatingPreferencesSection";
import PersonalDetailsSection from "./PersonalDetailsSection";
import LocationSection from "./LocationSection";
import SocialLinksSection from "./SocialLinksSection";
import {
  EditProfileFormData,
  FormFieldHandler,
  NestedFieldHandler,
} from "./types";

interface EditProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (
    updatedData: Partial<User>,
    profilePicture?: File | null
  ) => Promise<void>;
  isLoading?: boolean;
}

export default function EditProfileSheet({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading = false,
}: EditProfileSheetProps) {
  const [formData, setFormData] = useState<EditProfileFormData>({});
  const [selectedProfilePicture, setSelectedProfilePicture] =
    useState<File | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        gender: user.gender,
        genderPreference: user.genderPreference,
        lookingFor: user.lookingFor,
        height: user.height,
        education: user.education,
        occupation: user.occupation,
        religion: user.religion,
        smoking: user.smoking,
        drinking: user.drinking,
        agePreferences: user.agePreferences
          ? {
              min: user.agePreferences.min || 18,
              max: user.agePreferences.max || 35,
            }
          : { min: 18, max: 35 },
        location: {
          address: user.location?.address || "",
          city: user.location?.city || "",
          country: user.location?.country || "",
        },
        socialLinks: {
          instagram: user.socialLinks?.instagram || "",
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
          facebook: user.socialLinks?.facebook || "",
        },
      });
    }
  }, [isOpen, user]);

  const handleFieldChange: FormFieldHandler = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedFieldChange: NestedFieldHandler = (
    section,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const handleAgeRangeChange = (values: number[]) => {
    setFormData((prev) => ({
      ...prev,
      agePreferences: {
        min: values[0],
        max: values[1],
      },
    }));
  };

  const getBioCharCount = () => {
    return formData.bio?.length || 0;
  };

  const handleSubmit = async () => {
    try {
      await onSave(formData, selectedProfilePicture);
      handleClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile changes");
    }
  };

  const handleClose = () => {
    setFormData({});
    setSelectedProfilePicture(null);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-screen sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] 2xl:max-w-[580px] p-0 flex flex-col [&>button]:hidden"
        style={{ width: 'min(100vw, 500px)' }}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 hover:bg-muted rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <SheetTitle className="text-lg font-semibold text-foreground">
              Edit Info
            </SheetTitle>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || getBioCharCount() > 150}
            className={`px-4 py-2 text-sm font-medium hidden md:block rounded-lg transition-all duration-200 ${
              getBioCharCount() > 150
                ? "bg-muted cursor-not-allowed hover:bg-muted text-muted-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </div>
            ) : getBioCharCount() > 150 ? (
              "Bio too long"
            ) : (
              <div className="flex items-center gap-2 text-white">
                <Save className="w-3 h-3" />
                Save Changes
              </div>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <BasicInformationSection
              formData={formData}
              onFieldChange={handleFieldChange}
              onNestedFieldChange={handleNestedFieldChange}
              getBioCharCount={getBioCharCount}
            />

            <DatingPreferencesSection
              formData={formData}
              onFieldChange={handleFieldChange}
              onNestedFieldChange={handleNestedFieldChange}
              onAgeRangeChange={handleAgeRangeChange}
            />

            <PersonalDetailsSection
              formData={formData}
              onFieldChange={handleFieldChange}
              onNestedFieldChange={handleNestedFieldChange}
            />

            <LocationSection
              formData={formData}
              onFieldChange={handleFieldChange}
              onNestedFieldChange={handleNestedFieldChange}
            />

            <SocialLinksSection
              formData={formData}
              onFieldChange={handleFieldChange}
              onNestedFieldChange={handleNestedFieldChange}
            />

            <div className="h-4"></div>
          </div>
        </div>

        <div className="md:hidden border-t border-border p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || getBioCharCount() > 150}
            className={`w-full h-12 transition-all duration-200 ${
              getBioCharCount() > 150
                ? "bg-muted cursor-not-allowed hover:bg-muted text-white"
                : "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading
              ? "Saving..."
              : getBioCharCount() > 150
              ? "Bio too long"
              : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

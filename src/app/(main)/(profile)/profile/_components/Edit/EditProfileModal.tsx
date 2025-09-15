"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth.types";
import { Save, X, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

import BasicInformationSection from "./BasicInformationSection";
import DatingPreferencesSection from "./DatingPreferencesSection";
import PersonalDetailsSection from "./PersonalDetailsSection";
import LocationSection from "./LocationSection";
import { EditProfileFormData } from "./types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedData: Partial<User>, profilePicture?: File | null) => Promise<void>;
  isLoading?: boolean;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading = false,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<EditProfileFormData>({});
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        bio: user.bio || "",
        dob: user.dob || "",
        gender: user.gender,
        genderPreference: user.genderPreference,
        lookingFor: user.lookingFor,
        privacy: user.privacy,
        occupation: user.occupation || "",
        education: user.education,
        smoking: user.smoking,
        drinking: user.drinking,
        relationshipStatus: user.relationshipStatus,
        children: user.children,
        religion: user.religion || "",
        height: user.height && user.height >= 100 ? user.height : undefined,
        agePreferences: {
          min: user.agePreferences?.min || 18,
          max: user.agePreferences?.max || 99,
        },
        location: {
          address: user.location?.address || "",
          city: user.location?.city || "",
          country: user.location?.country || "",
        },
        socialLinks: {
          instagram: user.socialLinks?.instagram || "",
          facebook: user.socialLinks?.facebook || "",
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
        },
      });
    }
  }, [isOpen, user]);

  const handleInputChange = (
    field: keyof User,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getBioCharCount = () => {
    const bio = formData.bio || "";
    return bio.length;
  };

  const handleNestedInputChange = (
    parentField: keyof EditProfileFormData,
    childField: string,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as Record<string, unknown>),
        [childField]: value,
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

  const handleSubmit = async () => {
    try {
      const bioCharCount = getBioCharCount();
      if (bioCharCount > 150) {
        toast.error("Bio must be 150 characters or less");
        return;
      }

      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (value === null || value === undefined || value === "")
            return false;

          if (key === "height" && typeof value === "number" && value < 100)
            return false;

          if (typeof value === "object" && !Array.isArray(value)) {
            return Object.values(value).some(
              (v) => v !== null && v !== undefined && v !== ""
            );
          }

          return true;
        })
      );

      await onSave(cleanedData, selectedProfilePicture);
      onClose();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[85rem] max-h-[90vh] overflow-y-auto bg-white border-gray-200">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-primary">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
            Edit Your Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            Make your profile shine! Update your information to help others get
            to know you better ✨
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-3">
          {/* Profile Picture Upload Section */}
          <div className="border-b border-border pb-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Profile Picture
            </h3>
            <ProfilePictureUpload
              currentProfilePicture={
                typeof user.profilePicture === 'string' 
                  ? user.profilePicture 
                  : user.profilePicture?.url || user.avatar
              }
              userName={`${user.firstName} ${user.lastName}`}
              onFileSelect={setSelectedProfilePicture}
              isUploading={isLoading}
              disabled={isLoading}
            />
          </div>

          <BasicInformationSection
            formData={formData}
            onFieldChange={handleInputChange}
            onNestedFieldChange={handleNestedInputChange}
            getBioCharCount={getBioCharCount}
          />

          <DatingPreferencesSection
            formData={formData}
            onFieldChange={handleInputChange}
            onNestedFieldChange={handleNestedInputChange}
            onAgeRangeChange={handleAgeRangeChange}
          />

          <PersonalDetailsSection
            formData={formData}
            onFieldChange={handleInputChange}
            onNestedFieldChange={handleNestedInputChange}
          />

          <LocationSection
            formData={formData}
            onFieldChange={handleInputChange}
            onNestedFieldChange={handleNestedInputChange}
          />
        </div>

        <DialogFooter className="border-t border-border pt-6 gap-3 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="h-11 px-6 border-border hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || getBioCharCount() > 150}
            className={`h-11 px-6 transition-all duration-200 ${
              getBioCharCount() > 150
                ? "bg-muted cursor-not-allowed hover:bg-muted"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading
              ? "Saving..."
              : getBioCharCount() > 150
              ? "Bio too long"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

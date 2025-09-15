import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Heart } from "lucide-react";
import { DatingPreferencesSectionProps } from "./types";
import SectionHeader from "./SectionHeader";

export default function DatingPreferencesSection({
  formData,
  onFieldChange,
  onAgeRangeChange,
}: DatingPreferencesSectionProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <SectionHeader
        icon={Heart}
        title="Dating Preferences"
        description="Your dating preferences and what you're looking for"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="gender"
              className="text-sm font-medium text-primary"
            >
              Your Gender
            </Label>
            <Select
              value={formData.gender || ""}
              onValueChange={(value) => onFieldChange("gender", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="genderPreference"
              className="text-sm font-medium text-primary"
            >
              Looking For
            </Label>
            <Select
              value={formData.genderPreference || ""}
              onValueChange={(value) =>
                onFieldChange("genderPreference", value)
              }
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select gender preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="both">Everyone</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="lookingFor"
              className="text-sm font-medium text-primary"
            >
              Relationship Type
            </Label>
            <Select
              value={formData.lookingFor || ""}
              onValueChange={(value) => onFieldChange("lookingFor", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="What are you looking for?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendship">New Friends</SelectItem>
                <SelectItem value="relationship">
                  Serious Relationship
                </SelectItem>
                <SelectItem value="casual">Casual Dating</SelectItem>
                <SelectItem value="other">Something Else</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="privacy"
              className="text-sm font-medium text-primary"
            >
              Profile Privacy
            </Label>
            <Select
              value={formData.privacy || ""}
              onValueChange={(value) => onFieldChange("privacy", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select privacy setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public Profile</SelectItem>
                <SelectItem value="private">Private Profile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-primary">
            Age Range Preference
          </Label>
          <div className="px-3 py-4">
            <Slider
              value={[
                formData.agePreferences?.min || 18,
                formData.agePreferences?.max || 99,
              ]}
              onValueChange={onAgeRangeChange}
              max={99}
              min={18}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{formData.agePreferences?.min || 18} years</span>
              <span>{formData.agePreferences?.max || 99} years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

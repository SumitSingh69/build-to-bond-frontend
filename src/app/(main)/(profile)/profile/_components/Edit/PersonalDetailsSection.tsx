import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { PersonalDetailsSectionProps } from "./types";
import SectionHeader from "./SectionHeader";

export default function PersonalDetailsSection({
  formData,
  onFieldChange,
}: PersonalDetailsSectionProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <SectionHeader
        icon={Briefcase}
        title="Personal Details"
        description="Your professional and lifestyle information"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="occupation"
              className="text-sm font-medium text-primary"
            >
              Occupation
            </Label>
            <Input
              id="occupation"
              value={formData.occupation || ""}
              onChange={(e) => onFieldChange("occupation", e.target.value)}
              placeholder="What do you do for work?"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="education"
              className="text-sm font-medium text-primary"
            >
              Education Level
            </Label>
            <Select
              value={formData.education || ""}
              onValueChange={(value) => onFieldChange("education", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_school">High School</SelectItem>
                <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                <SelectItem value="master">Master&apos;s Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="height"
              className="text-sm font-medium text-primary"
            >
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              value={formData.height || ""}
              onChange={(e) =>
                onFieldChange(
                  "height",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Your height"
              min="100"
              max="250"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="children"
              className="text-sm font-medium text-primary"
            >
              Children
            </Label>
            <Select
              value={formData.children || ""}
              onValueChange={(value) => onFieldChange("children", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="have_children">Have Children</SelectItem>
                <SelectItem value="want_children">Want Children</SelectItem>
                <SelectItem value="dont_want_children">
                  Don&apos;t Want Children
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="religion"
              className="text-sm font-medium text-primary"
            >
              Religion (Optional)
            </Label>
            <Input
              id="religion"
              value={formData.religion || ""}
              onChange={(e) => onFieldChange("religion", e.target.value)}
              placeholder="Your religion or beliefs"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="smoking"
              className="text-sm font-medium text-primary"
            >
              Smoking
            </Label>
            <Select
              value={formData.smoking || ""}
              onValueChange={(value) => onFieldChange("smoking", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
                <SelectItem value="regularly">Regularly</SelectItem>
                <SelectItem value="prefer_not_to_say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="drinking"
              className="text-sm font-medium text-primary"
            >
              Drinking
            </Label>
            <Select
              value={formData.drinking || ""}
              onValueChange={(value) => onFieldChange("drinking", value)}
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="socially">Socially</SelectItem>
                <SelectItem value="regularly">Regularly</SelectItem>
                <SelectItem value="prefer_not_to_say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="relationshipStatus"
              className="text-sm font-medium text-primary"
            >
              Relationship Status
            </Label>
            <Select
              value={formData.relationshipStatus || ""}
              onValueChange={(value) =>
                onFieldChange("relationshipStatus", value)
              }
            >
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select your status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

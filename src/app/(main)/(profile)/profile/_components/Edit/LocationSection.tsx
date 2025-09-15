import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { LocationSectionProps } from "./types";
import SectionHeader from "./SectionHeader";

export default function LocationSection({
  formData,
  onNestedFieldChange,
}: LocationSectionProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
      <SectionHeader
        icon={MapPin}
        title="Location"
        description="Where you're based"
      />

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="address" className="text-sm font-medium text-primary">
            Full Address
          </Label>
          <Input
            id="address"
            value={formData.location?.address || ""}
            onChange={(e) =>
              onNestedFieldChange("location", "address", e.target.value)
            }
            placeholder="Enter your complete address"
            className="h-11 border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="city" className="text-sm font-medium text-primary">
              City
            </Label>
            <Input
              id="city"
              value={formData.location?.city || ""}
              onChange={(e) =>
                onNestedFieldChange("location", "city", e.target.value)
              }
              placeholder="Your city"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-3">
            <Label
              htmlFor="country"
              className="text-sm font-medium text-primary"
            >
              Country
            </Label>
            <Input
              id="country"
              value={formData.location?.country || ""}
              onChange={(e) =>
                onNestedFieldChange("location", "country", e.target.value)
              }
              placeholder="Your country"
              className="h-11 border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

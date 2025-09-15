"use client";

import React, { useState, useEffect } from "react";
import { MatchFilters } from "../types/filter.types";
import { FILTER_OPTIONS, DEFAULT_FILTERS } from "../constants/filter.constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, RotateCcw, Check } from "lucide-react";

interface MatchFilterSheetProps {
  filters: MatchFilters;
  onFiltersChange: (filters: MatchFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

type Education = NonNullable<MatchFilters["education"]>[number];
type Smoking = NonNullable<MatchFilters["smoking"]>[number];
type Drinking = NonNullable<MatchFilters["drinking"]>[number];
type Children = NonNullable<MatchFilters["children"]>[number];
type GenderPreference = NonNullable<MatchFilters["genderPreference"]>;
type LookingFor = NonNullable<MatchFilters["lookingFor"]>;
type LastActiveWithin = NonNullable<MatchFilters["lastActiveWithin"]>;

export const MatchFilterSheet: React.FC<MatchFilterSheetProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onClose,
  isLoading = false,
}) => {
  const [tempFilters, setTempFilters] = useState<MatchFilters>(filters);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  useEffect(() => {
    setHasChanges(JSON.stringify(tempFilters) !== JSON.stringify(filters));
  }, [tempFilters, filters]);

  const updateFilter = <K extends keyof MatchFilters>(
    key: K,
    value: MatchFilters[K]
  ) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: MatchFilters = {
      ageRange: DEFAULT_FILTERS.ageRange,
      heightRange: DEFAULT_FILTERS.heightRange,
      minProfileCompleteness: DEFAULT_FILTERS.minProfileCompleteness,
      lastActiveWithin: DEFAULT_FILTERS.lastActiveWithin as LastActiveWithin,
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const toggleArrayFilter = <K extends keyof MatchFilters>(
    key: K,
    value: string
  ) => {
    const currentArray = (tempFilters[key] as string[]) || [];
    let newArray: string[];

    if (currentArray.includes(value)) {
      newArray = currentArray.filter((item) => item !== value);
    } else {
      newArray = [...currentArray, value];
    }

    updateFilter(
      key,
      newArray.length > 0 ? (newArray as MatchFilters[K]) : undefined
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (
      tempFilters.ageRange &&
      (tempFilters.ageRange.min !== 18 || tempFilters.ageRange.max !== 99)
    )
      count++;
    if (tempFilters.genderPreference) count++;
    if (tempFilters.lookingFor) count++;
    if (
      tempFilters.heightRange &&
      (tempFilters.heightRange.min !== 140 ||
        tempFilters.heightRange.max !== 220)
    )
      count++;
    if (tempFilters.education?.length) count++;
    if (tempFilters.smoking?.length) count++;
    if (tempFilters.drinking?.length) count++;
    if (tempFilters.children?.length) count++;
    if (tempFilters.interests?.length) count++;
    if (tempFilters.religion) count++;
    if (tempFilters.languages?.length) count++;
    if (tempFilters.isVerified) count++;
    if (tempFilters.lastActiveWithin && tempFilters.lastActiveWithin !== 30)
      count++;
    if (
      tempFilters.minProfileCompleteness &&
      tempFilters.minProfileCompleteness > 0
    )
      count++;
    return count;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[500px] sm:max-w-[500px] p-3"
      >
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-primary-600" />
              <SheetTitle className="text-xl">Filters</SheetTitle>
              {getActiveFiltersCount() > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary-100 text-primary-700"
                >
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-500 hover:text-red-600"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          <div className="space-y-6">
            {/* Age Range */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Age Range
              </Label>
              <div className="px-4 py-6 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    {tempFilters.ageRange?.min || 18} years
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {tempFilters.ageRange?.max || 99} years
                  </span>
                </div>
                <Slider
                  value={[
                    tempFilters.ageRange?.min || 18,
                    tempFilters.ageRange?.max || 99,
                  ]}
                  onValueChange={(values: number[]) => {
                    const [min, max] = values;
                    updateFilter("ageRange", { min, max });
                  }}
                  min={18}
                  max={99}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Looking For (Radio) */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                I’m looking for
              </Label>
              <RadioGroup
                value={tempFilters.genderPreference || ""}
                onValueChange={(value) =>
                  updateFilter("genderPreference", value as GenderPreference)
                }
              >
                {FILTER_OPTIONS.genderPreferenceOptions.map((option) => (
                  <RadioGroupItem key={option.value} value={option.value}>
                    <span className="font-medium">{option.label}</span>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Relationship Type (Radio) */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Relationship Type
              </Label>
              <RadioGroup
                value={tempFilters.lookingFor || ""}
                onValueChange={(value) =>
                  updateFilter("lookingFor", value as LookingFor)
                }
              >
                {FILTER_OPTIONS.lookingForOptions.map((option) => (
                  <RadioGroupItem key={option.value} value={option.value}>
                    <div>
                      <span className="font-medium">{option.label}</span>
                      <p className="text-sm text-gray-500 mt-1">
                        {option.value === "friendship" &&
                          "Looking for platonic connections"}
                        {option.value === "relationship" &&
                          "Seeking long-term commitment"}
                        {option.value === "casual" && "Open to casual dating"}
                        {option.value === "other" && "Something else in mind"}
                      </p>
                    </div>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Height Range */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Height Range
              </Label>
              <div className="px-4 py-6 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    {tempFilters.heightRange?.min || 140} cm
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {tempFilters.heightRange?.max || 220} cm
                  </span>
                </div>
                <Slider
                  value={[
                    tempFilters.heightRange?.min || 140,
                    tempFilters.heightRange?.max || 220,
                  ]}
                  onValueChange={(values: number[]) => {
                    const [min, max] = values;
                    updateFilter("heightRange", { min, max });
                  }}
                  min={140}
                  max={220}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Education (Checkboxes) */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Education Level
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {FILTER_OPTIONS.educationOptions.map((option) => {
                  const isSelected =
                    tempFilters.education?.includes(
                      option.value as Education
                    ) || false;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                        isSelected
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() =>
                          toggleArrayFilter("education", option.value)
                        }
                      />
                      <span className="font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Lifestyle Preferences */}
            <div className="space-y-6">
              <Label className="text-lg font-semibold text-gray-900">
                Lifestyle Preferences
              </Label>

              {/* Smoking */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  Smoking
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_OPTIONS.smokingOptions.map((option) => {
                    const isSelected =
                      tempFilters.smoking?.includes(option.value as Smoking) ||
                      false;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                          isSelected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleArrayFilter("smoking", option.value)
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Drinking */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  Drinking
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_OPTIONS.drinkingOptions.map((option) => {
                    const isSelected =
                      tempFilters.drinking?.includes(
                        option.value as Drinking
                      ) || false;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                          isSelected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleArrayFilter("drinking", option.value)
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Children */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  Children
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {FILTER_OPTIONS.childrenOptions.map((option) => {
                    const isSelected =
                      tempFilters.children?.includes(
                        option.value as Children
                      ) || false;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleArrayFilter("children", option.value)
                          }
                        />
                        <span className="font-medium">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <Separator />

            {/* Interests */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Interests
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_OPTIONS.interestOptions.map((option) => {
                  const isSelected =
                    tempFilters.interests?.includes(option.value) || false;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                        isSelected
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() =>
                          toggleArrayFilter("interests", option.value)
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Religion */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Religion
              </Label>
              <RadioGroup
                value={tempFilters.religion || ""}
                onValueChange={(value) =>
                  updateFilter("religion", value || undefined)
                }
              >
                <RadioGroupItem value="">
                  <span className="font-medium">Any</span>
                </RadioGroupItem>
                {FILTER_OPTIONS.religionOptions.map((option) => (
                  <RadioGroupItem key={option.value} value={option.value}>
                    <span className="font-medium">{option.label}</span>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Languages */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-900">
                Languages
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_OPTIONS.languageOptions.map((option) => {
                  const isSelected =
                    tempFilters.languages?.includes(option.value) || false;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                        isSelected
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() =>
                          toggleArrayFilter("languages", option.value)
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Activity & Verification */}
            <div className="space-y-6">
              <Label className="text-lg font-semibold text-gray-900">
                Activity & Verification
              </Label>

              {/* Last Active (Radio) */}
              <div className="space-y-3">
                <Label className="text-base font-medium text-gray-700">
                  Last Active
                </Label>
                <RadioGroup
                  value={tempFilters.lastActiveWithin?.toString() || ""}
                  onValueChange={(value) =>
                    updateFilter(
                      "lastActiveWithin",
                      parseInt(value) as LastActiveWithin
                    )
                  }
                >
                  {FILTER_OPTIONS.lastActiveOptions.map((option) => (
                    <RadioGroupItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      <span className="font-medium">{option.label}</span>
                    </RadioGroupItem>
                  ))}
                </RadioGroup>
              </div>

              {/* Verified Only (Switch) */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <Label className="text-base font-medium text-gray-900">
                    Verified profiles only
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Show only users with verified photos
                  </p>
                </div>
                <Switch
                  checked={tempFilters.isVerified || false}
                  onCheckedChange={(checked) =>
                    updateFilter("isVerified", checked)
                  }
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 w-full">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-primary-600 hover:bg-primary-700"
              disabled={isLoading || !hasChanges}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 text-white border-b-2 border-white mr-2"></div>
                  Applying...
                </div>
              ) : (
                <div className="flex items-center text-white">
                  <Check className="w-4 h-4 mr-2" />
                  Apply Filters
                  {getActiveFiltersCount() > 0 &&
                    ` (${getActiveFiltersCount()})`}
                </div>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

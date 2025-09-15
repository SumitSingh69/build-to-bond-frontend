import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, X, MapPin, Briefcase, Heart, User, UserX } from "lucide-react";
import { MatchUser } from "../types";
import { cn } from "@/lib/utils";
import BioDisplay from "@/components/BioDisplay";
import api from "@/lib/api";
import { toast } from "sonner";

interface SearchBarProps {
  onUserClick: (userId: string) => void;
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onUserClick,
  onLike,
  onPass,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MatchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      const result = await api.apiRequest<{
        success: boolean;
        message: string;
        data: MatchUser[];
      }>(
        `/users/search?name=${encodeURIComponent(
          searchQuery.trim()
        )}&page=1&limit=10`,
        {
          method: "GET",
        }
      );

      if (result.success) {
        setSearchResults(result.data || []);
        if (result.data && result.data.length > 0) {
          toast.success(`🔍 Found ${result.data.length} user${result.data.length > 1 ? 's' : ''} matching "${searchQuery.trim()}"`);
        } else {
          toast.info(`🔍 No users found matching "${searchQuery.trim()}"`);
        }
      } else {
        setError(result.message || "Search failed");
        setSearchResults([]);
        toast.error("❌ Search failed. Please try again.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search users. Please try again.");
      setSearchResults([]);
      toast.error("❌ Failed to search users. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-6">
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={handleInputChange}
              className="pl-10 pr-10 py-3 border-gray-300 focus:border-rose-500 focus:ring-rose-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500"></div>
              <span className="text-sm">Searching...</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-10">
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {isSearching && searchResults.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results
            </h3>
            <Badge variant="secondary" className="text-xs">
              {searchResults.length} found
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((user) => {
              const initials =
                `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
              const displayLocation =
                user.location?.city && user.location?.country
                  ? `${user.location.city}, ${user.location.country}`
                  : user.location?.city || user.location?.country || "";

              return (
                <Card
                  key={user._id}
                  className={cn(
                    "bg-white rounded-2xl shadow-lg border border-gray-200",
                    "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden"
                  )}
                  onClick={() => onUserClick(user._id)}
                >
                  <CardContent className="p-0">
                    {/* Profile Image Section */}
                    <div className="relative h-48">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                          src={user.profilePicture || user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="object-cover"
                        />
                        <AvatarFallback className="w-full h-full rounded-none bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-2xl font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Quick Action Buttons */}
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPass(user._id);
                          }}
                          className="w-8 h-8 p-0 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLike(user._id);
                          }}
                          className="w-8 h-8 p-0 rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg hover:scale-110 transition-all duration-200"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* User Info Section */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h4 className="text-lg font-bold text-primary">
                          {user.firstName} {user.lastName}, {user.age}
                        </h4>
                      </div>

                      {displayLocation && (
                        <div className="flex items-center gap-1 text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span className="text-xs">{displayLocation}</span>
                        </div>
                      )}

                      {user.occupation && (
                        <div className="flex items-center gap-1 text-gray-600 mb-3">
                          <Briefcase className="w-3 h-3 text-primary" />
                          <span className="text-xs">{user.occupation}</span>
                        </div>
                      )}

                      <BioDisplay
                        text={user.bio}
                        className="text-gray-700 text-xs mb-3 line-clamp-2"
                      />

                      {user.interests && user.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {user.interests
                            .slice(0, 2)
                            .map((interest: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs px-2 py-0.5 text-primary bg-primary-50 border-gray-200"
                              >
                                {interest}
                              </Badge>
                            ))}
                          {user.interests.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 text-primary bg-primary-50 border-gray-200"
                            >
                              +{user.interests.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* No results message */}
      {isSearching &&
        searchResults.length === 0 &&
        !isLoading &&
        !error &&
        searchQuery.trim().length >= 2 && (
          <div className="mt-4 p-6 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-1">No users found</p>
            <p className="text-sm">Try searching with a different name</p>
          </div>
        )}
    </div>
  );
};

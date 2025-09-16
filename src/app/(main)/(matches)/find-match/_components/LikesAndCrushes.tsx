"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Heart, Users, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiModule from "@/lib/api";
import { toast } from "sonner";

interface LikedUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  isMatch: boolean;
}

interface LikesData {
  likes: LikedUser[];
  totalLikes: number;
}

interface CrushesData {
  crushes: LikedUser[];
  totalCrushes: number;
}

interface MatchesData {
  matches: LikedUser[];
  totalMatches: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const LikesAndCrushes: React.FC = () => {
  const [likesData, setLikesData] = useState<LikesData | null>(null);
  const [crushesData, setCrushesData] = useState<CrushesData | null>(null);
  const [matchesData, setMatchesData] = useState<MatchesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("crushes");

  const fetchLikesData = async () => {
    try {
      const response = await apiModule.authAPI.getLikes() as ApiResponse<LikesData>;
      if (response.success) {
        setLikesData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch likes:", error);
      toast.error("Failed to load likes");
    }
  };

  const fetchCrushesData = async () => {
    try {
      const response = await apiModule.authAPI.getCrushes() as ApiResponse<CrushesData>;
      if (response.success) {
        setCrushesData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch crushes:", error);
      toast.error("Failed to load crushes");
    }
  };

  const fetchMatchesData = async () => {
    try {
      const response = await apiModule.authAPI.getMatches() as ApiResponse<MatchesData>;
      if (response.success) {
        setMatchesData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      toast.error("Failed to load matches");
    }
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchLikesData(),
        fetchCrushesData(),
        fetchMatchesData(),
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleLikeBack = async (userId: string) => {
    try {
      const response = await apiModule.authAPI.likeUser(userId) as ApiResponse<{action: string; targetUserId: string; isMatch: boolean; matchId?: string}>;
      if (response.success) {
        if (response.data?.isMatch) {
          toast.success("🎉 It's a Match!", {
            description: "You both liked each other!",
            duration: 5000,
          });
        } else {
          toast.success("❤️ Liked back!", {
            description: "Your like has been sent.",
            duration: 3000,
          });
        }
        // Refresh data
        fetchAllData();
      }
    } catch (error) {
      console.error("Failed to like user:", error);
      toast.error("Failed to like user");
    }
  };

  const UserCard: React.FC<{ user: LikedUser; showLikeButton?: boolean }> = ({ 
    user, 
    showLikeButton = false 
  }) => {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user.profilePicture || user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-pink-100 to-rose-200 text-gray-600 font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h4 className="font-semibold text-primary">
                {user.firstName} {user.lastName}
                {user.isMatch && (
                  <Badge className="ml-2 bg-green-100 text-green-700 border-green-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Match
                  </Badge>
                )}
              </h4>
              {user.bio && (
                <p className="text-sm text-gray-600 truncate">{user.bio}</p>
              )}
            </div>
            
            {showLikeButton && !user.isMatch && (
              <Button
                size="sm"
                onClick={() => handleLikeBack(user._id)}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Heart className="w-4 h-4 mr-1" />
                Like Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-primary">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Your Connections</h2>
        <p className="text-gray-600">See who liked you and your matches</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crushes" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Crushes ({crushesData?.totalCrushes || 0})
          </TabsTrigger>
          <TabsTrigger value="likes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Your Likes ({likesData?.totalLikes || 0})
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Matches ({matchesData?.totalMatches || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crushes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                People who liked you
              </CardTitle>
            </CardHeader>
            <CardContent>
              {crushesData?.crushes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No one has liked you yet. Keep swiping! 💕
                </p>
              ) : (
                <div className="space-y-3">
                  {crushesData?.crushes.map((user) => (
                    <UserCard 
                      key={user._id} 
                      user={user} 
                      showLikeButton={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                People you liked
              </CardTitle>
            </CardHeader>
            <CardContent>
              {likesData?.likes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  You haven&apos;t liked anyone yet. Start exploring! 👀
                </p>
              ) : (
                <div className="space-y-3">
                  {likesData?.likes.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Your Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {matchesData?.matches.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No matches yet. Keep liking to find your perfect match! ✨
                </p>
              ) : (
                <div className="space-y-3">
                  {matchesData?.matches.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button onClick={fetchAllData} variant="outline">
          <Loader2 className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default LikesAndCrushes;
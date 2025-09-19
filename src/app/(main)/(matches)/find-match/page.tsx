"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Confetti from "react-confetti";
import {
  MatchHeader,
  MatchFallback,
  MatchCard,
  MatchFilterSheet,
  RecommendedCarousel,
  SearchBar,
  MatchNotification,
} from "./_components";
import { UserDetailSheet } from "./_components/UserDetailSheet";
import { useMatchFinder } from "@/hooks/useMatchFinder";
import { useLike } from "@/hooks/useLike";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MatchUser } from "./types";

const FindMatchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userIdFromQuery = searchParams.get("userId");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isMatchNotificationOpen, setIsMatchNotificationOpen] = useState(false);
  const [matchedUser, setMatchedUser] = useState<MatchUser | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (userIdFromQuery) {
      setSelectedUserId(userIdFromQuery);
      setIsUserDetailOpen(true);
    }
  }, [userIdFromQuery]);

  const triggerConfetti = () => {
    setShowConfetti(true);

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const {
    matches,
    recommendedMatches,
    loading,
    error,
    filters,
    pagination,
    refresh,
    loadMore,
    handleLike,
    handlePass,
    applyFilters,
    clearFilters,
  } = useMatchFinder();

  const { likeUser, clearError: clearMatchError } = useLike();

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleRefresh = () => {
    refresh();
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsUserDetailOpen(true);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("userId", userId);
    window.history.pushState({}, "", currentUrl.toString());
  };

  const handleCloseUserDetail = () => {
    setIsUserDetailOpen(false);
    setSelectedUserId(null);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("userId");
    window.history.pushState({}, "", currentUrl.toString());
  };

  const handleEnhancedLike = async (userId: string) => {
    try {
      clearMatchError();
      const result = await likeUser(userId);

      if (result?.isMatch) {
        const user =
          matches.find((m) => m._id === userId) ||
          recommendedMatches.find((m) => m._id === userId);

        if (user) {
          setMatchedUser(user);
          setIsMatchNotificationOpen(true);
        }

        triggerConfetti();

        toast.success("🎉 It's a Match!", {
          description: "You both liked each other! Start a conversation.",
          duration: 5000,
        });
      } else {
        triggerConfetti();

        toast.success("❤️ Liked!", {
          description: "Your like has been sent.",
          duration: 3000,
        });
      }

      handleLike(userId);
    } catch (error) {
      console.error("Failed to like user:", error);
      toast.error("Failed to like user", {
        description: "Please try again later.",
        duration: 4000,
      });
    }
  };

  const handleEnhancedPass = async (userId: string) => {
    try {
      clearMatchError();

      toast.info("👋 Passed", {
        description: "You passed on this user.",
        duration: 2000,
      });

      handlePass(userId);
    } catch (error) {
      console.error("Failed to pass user:", error);
      toast.error("Failed to pass user", {
        description: "Please try again later.",
        duration: 4000,
      });
    }
  };

  const handleCloseMatchNotification = () => {
    setIsMatchNotificationOpen(false);
    setMatchedUser(null);
  };

  const handleSendMessage = () => {
    if (matchedUser) {
      toast.success("💬 Opening chat...", {
        description: `Starting conversation with ${matchedUser.firstName}`,
        duration: 3000,
      });

      console.log("Navigate to chat with:", matchedUser._id);
    }
    handleCloseMatchNotification();
  };

  const handleKeepSwiping = () => {
    toast.info("🔥 Keep swiping!", {
      description: "Find more amazing people to connect with.",
      duration: 2000,
    });
    handleCloseMatchNotification();
  };

  if (loading && matches.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4">
        <MatchHeader onFilterClick={handleFilterClick} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <MatchHeader onFilterClick={handleFilterClick} />
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">Failed to load matches</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && matches.length === 0) {
    return (
      <div className="max-w-md mx-auto p-4">
        <MatchHeader onFilterClick={handleFilterClick} />
        <MatchFallback />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={200}
          gravity={0.3}
          colors={[
            "#ff69b4",
            "#ff1493",
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#feca57",
          ]}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MatchHeader onFilterClick={handleFilterClick} />

        <SearchBar
          onUserClick={handleUserClick}
          onLike={handleEnhancedLike}
          onPass={handleEnhancedPass}
        />

        <RecommendedCarousel
          recommendedUsers={recommendedMatches}
          onUserClick={handleUserClick}
          onLike={handleEnhancedLike}
          onPass={handleEnhancedPass}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.map((match, index) => (
            <MatchCard
              key={match._id}
              user={match}
              onLike={handleEnhancedLike}
              onPass={handleEnhancedPass}
              onUserClick={handleUserClick}
              className={`transform transition-all duration-300 ${
                index === 0 ? "scale-100" : "scale-95 opacity-80"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          {pagination.hasNextPage && (
            <Button
              onClick={loadMore}
              disabled={loading}
              className="bg-primary-600 text-white px-8 py-5 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More Matches</span>
              )}
            </Button>
          )}

          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-primary-600 text-white px-8 py-5 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? "Refreshing..." : "Refresh Matches"}
          </Button>
        </div>
      </div>

      <MatchFilterSheet
        filters={filters}
        onFiltersChange={applyFilters}
        onClearFilters={handleClearFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isLoading={loading}
      />

      <UserDetailSheet
        userId={selectedUserId}
        isOpen={isUserDetailOpen}
        onClose={handleCloseUserDetail}
        onLike={handleLike}
        onPass={handlePass}
      />

      <MatchNotification
        isOpen={isMatchNotificationOpen}
        onClose={handleCloseMatchNotification}
        matchedUser={matchedUser}
        onSendMessage={handleSendMessage}
        onKeepSwiping={handleKeepSwiping}
      />
    </div>
  );
};

export default FindMatchPage;

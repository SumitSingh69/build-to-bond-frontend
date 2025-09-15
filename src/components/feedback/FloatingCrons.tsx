"use client";


import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { X, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
interface FeedbackToUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}
interface FeedbackResponse {
  success?: boolean;
  data?: {
    pendingFeedback: boolean;
    feedbackTo: FeedbackToUser[];
  };
  pendingFeedback?: boolean;
  feedbackTo?: FeedbackToUser[];
}
const FloatingCrons = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [ratings, setRatings] = useState<{ [userId: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUserAuthenticated = () => {
    if (typeof window === "undefined") return false;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    return !!(accessToken || refreshToken || user);
  };

  useEffect(() => {
    const fetchPendingFeedback = async () => {
      if (!isUserAuthenticated()) {
        return;
      }

      try {
        const response = (await apiRequest("/users/feedback/pending", {
          method: "GET",
        })) as FeedbackResponse;

        let processedData: FeedbackResponse;
        if (response.success && response.data) {
          processedData = response.data;
        } else if (response.pendingFeedback !== undefined) {
          processedData = response;
        } else {
          processedData = { pendingFeedback: false, feedbackTo: [] };
        }

        setFeedbackData(processedData);

        if (
          processedData.pendingFeedback &&
          processedData.feedbackTo &&
          processedData.feedbackTo.length > 0
        ) {
          setCurrentUserIndex(0);
        }
      } catch (error) {
        console.error("Error fetching pending feedback:", error);
      }
    };

    fetchPendingFeedback();
  }, []);

  const users = feedbackData?.feedbackTo || [];
  const currentUser = users[currentUserIndex];
  const currentRating = ratings[currentUser?._id] || 0;

  const handleStarClick = (rating: number) => {
    if (!currentUser) return;
    setRatings((prev) => ({ ...prev, [currentUser._id]: rating }));
  };

  const handleNext = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      submitFeedback();
    }
  };

  const submitFeedback = async () => {
    if (!isUserAuthenticated()) {
      console.log("User not authenticated - cannot submit feedback");
      setIsOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
  
      const feedbackArray = Object.entries(ratings).map(([userId, rating]) => {
        users.find((u) => u._id === userId);
        return {
          userId: userId,
          rating: rating,
        };
      });

      await apiRequest("/users/feedback/pending", {
        method: "POST",
        body: JSON.stringify({
          feedbacks: feedbackArray,
        }),
      });

      setIsOpen(false);
      setRatings({});
      setCurrentUserIndex(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRatings({});
    setCurrentUserIndex(0);
  };

  const hasPendingFeedback = feedbackData?.pendingFeedback && users.length > 0;

  if (!hasPendingFeedback) return null;
  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            size="icon"
          >
            <Heart className="h-6 w-6 text-white" />

            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {users.length}
            </div>
          </Button>
        </div>
      )}

      {isOpen && currentUser && (
        <div className="fixed bottom-6 left-6 z-50">
          <Card className="w-80 shadow-xl border-0 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <h3 className="font-semibold text-gray-900">
                    Rate Conversation
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">
                    {currentUserIndex + 1} of {users.length}
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    How was your conversation?
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Rate your experience
                  </label>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= currentRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentUserIndex < users.length - 1) {
                        setCurrentUserIndex(currentUserIndex + 1);
                      } else {
                        handleClose();
                      }
                    }}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                    disabled={isSubmitting || currentRating === 0}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </div>
                    ) : currentUserIndex === users.length - 1 ? (
                      "Submit All"
                    ) : (
                      "Next"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
export default FloatingCrons;

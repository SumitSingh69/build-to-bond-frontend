"use client";

import React, { useState } from "react";
import { MatchHeader, MatchFallback, MatchCard, MatchFilterSheet } from "./_components";
import { UserDetailSheet } from "./_components/UserDetailSheet";
import { useMatchFinder } from "@/hooks/useMatchFinder";
import { Button } from "@/components/ui/button";

const FindMatchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const {
    matches,
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

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    // The filters are already applied through applyFilters function
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
  };

  const handleCloseUserDetail = () => {
    setIsUserDetailOpen(false);
    setSelectedUserId(null);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MatchHeader onFilterClick={handleFilterClick} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.map((match, index) => (
            <MatchCard
              key={match._id}
              user={match}
              onLike={handleLike}
              onPass={handlePass}
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

      {/* Filter Sheet */}
      <MatchFilterSheet
        filters={filters}
        onFiltersChange={applyFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isLoading={loading}
      />

      {/* User Detail Sheet */}
      <UserDetailSheet
        userId={selectedUserId}
        isOpen={isUserDetailOpen}
        onClose={handleCloseUserDetail}
        onLike={handleLike}
        onPass={handlePass}
      />
    </div>
  );
};

export default FindMatchPage;

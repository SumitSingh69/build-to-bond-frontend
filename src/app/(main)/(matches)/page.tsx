"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, User, Star, Calendar } from 'lucide-react';
import { useMatch } from '@/hooks/useMatch';

import { MatchUser } from "./find-match/types";

interface MatchHistoryItem {
  matchedUserId: MatchUser;
  compatibilityScore: number;
  status: 'pending' | 'liked' | 'passed' | 'super_liked' | 'matched' | 'expired';
  actionTakenAt?: string;
  generatedAt: string;
}

interface LikeItem {
  user: MatchUser;
  likedAt: string;
  isSuper: boolean;
  compatibilityScore: number;
}

interface MatchStats {
  totalMatches: number;
  totalLikes: number;
  totalPasses: number;
}

const MatchesPage = () => {
  const {
    getMatches,
    getMatchHistory,
    getLikes,
    loading,
    error,
    clearError
  } = useMatch();

  const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([]);
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [activeTab, setActiveTab] = useState('matches');

  const loadMatches = useCallback(async () => {
    clearError();
    
    try {
      const [matchesResult, historyResult, likesResult] = await Promise.all([
        getMatches(1, 20),
        getMatchHistory(1, 20),
        getLikes(1, 20)
      ]);

      setMatches(matchesResult.matches);
      setMatchHistory(historyResult.matches);
      setLikes(likesResult.likes);
      setStats(historyResult.stats);
    } catch (error) {
      console.error('Failed to load matches:', error);
    }
  }, [getMatches, getMatchHistory, getLikes, clearError]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      matched: { color: 'bg-green-100 text-green-700 border-green-200', icon: '💕' },
      liked: { color: 'bg-pink-100 text-pink-700 border-pink-200', icon: '❤️' },
      super_liked: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '⭐' },
      passed: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '👋' },
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⏳' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-xs flex items-center gap-1`}>
        <span>{config.icon}</span>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches</h1>
        <p className="text-gray-600">Connect with people who like you back</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.totalLikes}</div>
              <div className="text-sm text-gray-600">Total Likes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{matches.length}</div>
              <div className="text-sm text-gray-600">Mutual Matches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{likes.length}</div>
              <div className="text-sm text-gray-600">People Who Liked You</div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadMatches}
              className="mt-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches">Mutual Matches ({matches.length})</TabsTrigger>
          <TabsTrigger value="likes">Likes ({likes.length})</TabsTrigger>
          <TabsTrigger value="history">History ({matchHistory.length})</TabsTrigger>
        </TabsList>

        {/* Mutual Matches */}
        <TabsContent value="matches" className="mt-6">
          {matches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
                <p className="text-gray-600">Keep swiping to find your perfect match!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => {
                const user = match.matchedUserId;
                const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                
                return (
                  <Card key={match.matchedUserId._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-100 to-violet-200 text-gray-600 font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{user.age} years old</p>
                        </div>
                        {getStatusBadge(match.status)}
                      </div>
                      
                      {match.compatibilityScore > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">
                            {match.compatibilityScore}% match
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <User className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* People Who Liked You */}
        <TabsContent value="likes" className="mt-6">
          {likes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No likes yet</h3>
                <p className="text-gray-600">Be patient, your perfect match is out there!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {likes.map((like) => {
                const user = like.user;
                const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                
                return (
                  <Card key={user._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-100 to-violet-200 text-gray-600 font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{user.age} years old</p>
                        </div>
                        {like.isSuper && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                            ⭐ Super
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 mb-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(like.likedAt)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" variant="outline">
                          <Heart className="w-4 h-4 mr-1" />
                          Like Back
                        </Button>
                        <Button size="sm" variant="outline">
                          <User className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Match History */}
        <TabsContent value="history" className="mt-6">
          {matchHistory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No history yet</h3>
                <p className="text-gray-600">Start swiping to build your match history!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {matchHistory.map((match) => {
                const user = match.matchedUserId;
                const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                
                return (
                  <Card key={match.matchedUserId._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-100 to-violet-200 text-gray-600 font-semibold text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(match.actionTakenAt || match.generatedAt)}
                          </p>
                        </div>
                        {getStatusBadge(match.status)}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchesPage;
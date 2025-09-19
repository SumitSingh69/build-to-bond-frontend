"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  UserCheck, 
  TrendingUp, 
  MessageCircle,
  Star,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart as RechartsPieChart, Cell, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie } from 'recharts';
import { useLike } from '@/hooks/useLike';
import { useStats } from '@/hooks/useStats';
import { format } from 'date-fns';
import apiModule from '@/lib/api';

// Define interfaces for type safety
interface UserData {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  avatar?: string;
  age?: number;
  location?: string;
  isMatch?: boolean;
}

interface ChatRoom {
  otherUser?: UserData;
  lastMessage?: {
    content?: string;
    createdAt?: string;
  };
  unreadCount?: number;
}

interface DashboardData {
  stats: {
    totalLikesGiven?: number;
    totalLikesReceived?: number;
    totalMatches?: number;
    totalProfileViews?: number;
    totalMessagesExchanged?: number;
    matchRate?: number;
    responseRate?: number;
    engagementScore?: number;
    profileCompleteness?: number;
    chatInitiationRate?: number;
    avgChatLength?: number;
  };
  weeklyActivity?: Array<{
    displayDate: string;
    likes: number;
    matches: number;
  }>;
  insights?: {
    profileCompleteness?: number;
    recommendations?: Array<{
      title: string;
      description: string;
      priority?: 'high' | 'medium' | 'low';
    }>;
  };
}

const UserStatsPage = () => {
  const router = useRouter();
  const {
    getLikes,
    getCrushes,
    getMatches
  } = useLike();

  const {
    getDashboard
  } = useStats();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Separate state for different data types
  const [crushesData, setCrushesData] = useState<UserData[]>([]);
  const [matchesData, setMatchesData] = useState<UserData[]>([]);
  const [whoLikesYouData, setWhoLikesYouData] = useState<UserData[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Fetch chat rooms data
  const fetchChatRooms = async () => {
    try {
      const response = await apiModule.chatAPI.getAllChats() as { success: boolean; chats: ChatRoom[] };
      if (response.success) {
        setChatRooms(response.chats || []);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  // Fetch match history
  const fetchMatchHistory = async () => {
    try {
      const response = await apiModule.matchAPI.getMatchHistory() as { success: boolean; data: UserData[] };
      if (response.success) {
        // Note: matchHistory is not used in current implementation
        console.log('Match history loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching match history:', error);
    }
  };

  // Fetch who has crushed on me (NEW - using our custom endpoint)
  const fetchWhoHasCrushedOnMe = async () => {
    try {
      const response = await apiModule.authAPI.getWhoHasCrushedOnMe() as { success: boolean; data?: { crushers: UserData[] } };
      if (response.success) {
        // Use this data for the "Who Added You as Crush" section
        setWhoLikesYouData(response.data?.crushers || []);
      }
    } catch (error) {
      console.error('Error fetching who has crushed on me:', error);
    }
  };

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Load dashboard data from the stats API
      const dashboard = await getDashboard();
      
      // Load individual data sets in parallel
      const [, crushes, matches] = await Promise.all([
        getLikes(),
        getCrushes(), 
        getMatches()
      ]);

      // Also fetch additional data
      await Promise.all([
        fetchChatRooms(),
        fetchMatchHistory(),
        fetchWhoHasCrushedOnMe() // Use the new function instead
      ]);

      if (dashboard) {
        setDashboardData(dashboard);
      }

      if (crushes) {
        setCrushesData(crushes.crushes || []);
      }
      if (matches) {
        setMatchesData(matches.matches || []);
      }

    } catch (error) {
      console.error('Failed to load stats data:', error);
    } finally {
      setLoading(false);
    }
  }, [getDashboard, getLikes, getCrushes, getMatches]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const getAvatarUrl = (user: UserData | undefined) => {
    // Handle undefined or null user
    if (!user) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=unknown-user`;
    }
    
    if (user.profilePicture && typeof user.profilePicture === 'string' && user.profilePicture.trim()) {
      return user.profilePicture;
    }
    if (user.avatar && typeof user.avatar === 'string' && user.avatar.trim()) {
      return user.avatar;
    }
    const seed = `${user.firstName || ''}-${user.lastName || ''}` || user._id || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  const handleViewProfile = (userId: string | undefined) => {
    if (userId) {
      router.push(`/find-match?userId=${userId}`);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, color = "text-blue-600" }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    description?: string;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const chartConfig = {
    likes: {
      label: "Likes",
      color: "#8b5cf6",
    },
    matches: {
      label: "Matches",
      color: "#ec4899",
    },
  } satisfies ChartConfig;

  const pieData = dashboardData ? [
    { name: 'Matches', value: dashboardData.stats.totalMatches || 0, color: '#10b981' },
    { name: 'Likes Given', value: dashboardData.stats.totalLikesGiven || 0, color: '#8b5cf6' },
    { name: 'Likes Received', value: dashboardData.stats.totalLikesReceived || 0, color: '#ec4899' },
    { name: 'Profile Views', value: dashboardData.stats.totalProfileViews || 0, color: '#f59e0b' }
  ].filter(item => (item.value || 0) > 0) : [];

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your stats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Dating Stats</h1>
          <p className="text-muted-foreground">Track your dating journey and insights</p>
        </div>
        <Button onClick={loadAllData} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Likes Given"
          value={dashboardData?.stats.totalLikesGiven || 0}
          icon={Heart}
          description="People you've liked"
          color="text-pink-600"
        />
        <StatCard
          title="Who Added You as Crush"
          value={whoLikesYouData.length || 0}
          icon={UserCheck}
          description="People who crushed on you"
          color="text-purple-600"
        />
        <StatCard
          title="Your Crushes"
          value={crushesData.length || 0}
          icon={Star}
          description="People you marked as crush"
          color="text-red-600"
        />
        <StatCard
          title="Mutual Matches"
          value={matchesData.length || 0}
          icon={Users}
          description="Perfect connections"
          color="text-green-600"
        />
        <StatCard
          title="Active Chats"
          value={chatRooms.length || 0}
          icon={MessageCircle}
          description="Ongoing conversations"
          color="text-blue-600"
        />
        <StatCard
          title="Match Rate"
          value={`${dashboardData?.stats.matchRate || 0}%`}
          icon={TrendingUp}
          description="Success percentage"
          color="text-orange-600"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="crushes">Crushes</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Your likes and matches this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData?.weeklyActivity || []}>
                      <XAxis dataKey="displayDate" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="likes" fill="var(--color-likes)" />
                      <Bar dataKey="matches" fill="var(--color-matches)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Status Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Interaction Breakdown
                </CardTitle>
                <CardDescription>How your interactions are distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crushes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* People You Added as Crush */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-red-600" />
                  Your Crushes ({crushesData.length})
                </CardTitle>
                <CardDescription>People you&apos;ve marked as crushes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {crushesData.length > 0 ? (
                  <>
                    {crushesData.slice(0, 8).map((person, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={getAvatarUrl(person)} />
                          <AvatarFallback>
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{person.firstName} {person.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {person.age ? `${person.age} years old` : 'Age not specified'}
                            {person.location && ` • ${person.location}`}
                          </p>
                          {person.isMatch && (
                            <Badge variant="default" className="text-xs mt-1">
                              <Heart className="h-3 w-3 mr-1" />
                              Mutual Match!
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewProfile(person._id || person.id)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                    {crushesData.length > 8 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All {crushesData.length} Crushes
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No crushes yet</p>
                    <p className="text-sm text-muted-foreground">Start exploring profiles to add crushes!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* People Who Added You as Crush */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Who Added You as Crush ({whoLikesYouData.length})
                </CardTitle>
                <CardDescription>People who have added you to their crushes list</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {whoLikesYouData.length > 0 ? (
                  <>
                    {whoLikesYouData.slice(0, 8).map((person, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={getAvatarUrl(person)} />
                          <AvatarFallback>
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{person.firstName} {person.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {person.age ? `${person.age} years old` : 'Age not specified'}
                            {person.location && ` • ${person.location}`}
                          </p>
                          {person.isMatch && (
                            <Badge variant="default" className="text-xs mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              It&apos;s a Match!
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">
                            <Heart className="h-4 w-4 mr-1" />
                            Add to Crush
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewProfile(person._id || person.id)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                    {whoLikesYouData.length > 8 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All {whoLikesYouData.length} Admirers
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No one has added you as crush yet</p>
                    <p className="text-sm text-muted-foreground">Keep your profile active to get more attention!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mutual Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Mutual Matches ({matchesData.length})
                </CardTitle>
                <CardDescription>People you both liked each other</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {matchesData.length > 0 ? (
                  <>
                    {matchesData.slice(0, 8).map((person, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={getAvatarUrl(person)} />
                          <AvatarFallback>
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{person.firstName} {person.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {person.age ? `${person.age} years old` : 'Age not specified'}
                            {person.location && ` • ${person.location}`}
                          </p>
                          <Badge variant="default" className="text-xs mt-1">
                            <Users className="h-3 w-3 mr-1" />
                            Mutual Match
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewProfile(person._id || person.id)}
                          >
                            View Profile
                          </Button>
                          <Button size="sm" variant="default">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Start Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                    {matchesData.length > 8 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All {matchesData.length} Matches
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No mutual matches yet</p>
                    <p className="text-sm text-muted-foreground">Keep liking profiles to find your matches!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Match Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Match Analytics</CardTitle>
                <CardDescription>Your matching performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Match Rate</span>
                    <span className="text-sm text-muted-foreground">{dashboardData?.stats.matchRate || 0}%</span>
                  </div>
                  <Progress value={dashboardData?.stats.matchRate || 0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Response Rate</span>
                    <span className="text-sm text-muted-foreground">{dashboardData?.stats.responseRate || 0}%</span>
                  </div>
                  <Progress value={dashboardData?.stats.responseRate || 0} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{matchesData.length}</div>
                    <div className="text-sm text-muted-foreground">Total Matches</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{chatRooms.length}</div>
                    <div className="text-sm text-muted-foreground">Active Chats</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Active Conversations ({chatRooms.length})
                </CardTitle>
                <CardDescription>Your ongoing chats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatRooms.length > 0 ? (
                  <>
                    {chatRooms.slice(0, 8).map((room, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={getAvatarUrl(room.otherUser)} />
                          <AvatarFallback>
                            {room.otherUser?.firstName?.[0]}{room.otherUser?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{room.otherUser?.firstName} {room.otherUser?.lastName}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {room.lastMessage?.content || 'No messages yet'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {room.lastMessage?.createdAt ? format(new Date(room.lastMessage.createdAt), 'MMM dd, HH:mm') : ''}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {(room.unreadCount || 0) > 0 && (
                            <Badge variant="default" className="text-xs">
                              {room.unreadCount}
                            </Badge>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewProfile(room.otherUser?._id || room.otherUser?.id)}
                            >
                              View Profile
                            </Button>
                            <Button size="sm" variant="outline">
                              Open Chat
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {chatRooms.length > 8 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All {chatRooms.length} Chats
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active conversations</p>
                    <p className="text-sm text-muted-foreground">Start chatting with your matches!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Chat Analytics</CardTitle>
                <CardDescription>Your conversation insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{chatRooms.length}</div>
                    <div className="text-sm text-muted-foreground">Total Chats</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {chatRooms.filter(room => (room.unreadCount || 0) > 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Chats</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Chat Initiation Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardData?.stats.chatInitiationRate || 0}%
                    </span>
                  </div>
                  <Progress value={dashboardData?.stats.chatInitiationRate || 0} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Average Chat Length</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardData?.stats.avgChatLength || 0} messages
                    </span>
                  </div>
                  <Progress value={Math.min((dashboardData?.stats.avgChatLength || 0) * 5, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Trends</CardTitle>
              <CardDescription>Track your dating app engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.weeklyActivity || []}>
                    <XAxis dataKey="displayDate" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} />
                    <Line type="monotone" dataKey="matches" stroke="var(--color-matches)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Metrics</CardTitle>
                <CardDescription>Your dating app performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Match Rate</span>
                    <span className="text-sm text-muted-foreground">{dashboardData?.stats.matchRate || 0}%</span>
                  </div>
                  <Progress value={dashboardData?.stats.matchRate || 0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Profile Engagement</span>
                    <span className="text-sm text-muted-foreground">{dashboardData?.stats.engagementScore || 0}%</span>
                  </div>
                  <Progress value={dashboardData?.stats.engagementScore || 0} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completeness</span>
                    <span className="text-sm text-muted-foreground">{dashboardData?.insights?.profileCompleteness || 0}%</span>
                  </div>
                  <Progress value={dashboardData?.insights?.profileCompleteness || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Tips to improve your success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData?.insights?.recommendations?.slice(0, 3).map((rec: { title: string; description: string; priority?: 'high' | 'medium' | 'low' }, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className={`h-5 w-5 mt-0.5 ${
                      rec.priority === 'high' ? 'text-red-500' : 
                      rec.priority === 'medium' ? 'text-yellow-500' : 
                      'text-green-500'
                    }`} />
                    <div>
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                )) || (
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Keep it up!</p>
                      <p className="text-sm text-muted-foreground">You&apos;re doing great with your profile</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserStatsPage;

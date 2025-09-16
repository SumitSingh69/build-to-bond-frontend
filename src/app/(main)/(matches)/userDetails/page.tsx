"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
import { format, subDays} from 'date-fns';

const UserStatsPage = () => {
  const {
    getLikes,
    getCrushes,
    getMatches,
    loading: likesLoading,
    error: likesError
  } = useLike();

  const {
    getDashboard,
    loading: statsLoading,
    error: statsError,
    clearError
  } = useStats();

  const [dashboardData, setDashboardData] = useState<any>(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [likesData, setLikesData] = useState<any[]>([]);
  const [crushesData, setCrushesData] = useState<any[]>([]);
  const [matchesData, setMatchesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Load dashboard data from the new stats API
      const dashboard = await getDashboard();
      
      // Also load the individual likes, crushes, matches for the people section
      const [likes, crushes, matches] = await Promise.all([
        getLikes(),
        getCrushes(), 
        getMatches()
      ]);

      if (dashboard) {
        setDashboardData(dashboard);
      }

      if (likes) {
        setLikesData(likes.likes || []);
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

  const getAvatarUrl = (user: any) => {
    if (user.profilePicture && user.profilePicture.trim()) {
      return user.profilePicture;
    }
    if (user.avatar && user.avatar.trim()) {
      return user.avatar;
    }
    const seed = `${user.firstName}-${user.lastName}` || user._id || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
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
    { name: 'Matches', value: dashboardData.stats.totalMatches, color: '#10b981' },
    { name: 'Likes Given', value: dashboardData.stats.totalLikesGiven, color: '#8b5cf6' },
    { name: 'Likes Received', value: dashboardData.stats.totalLikesReceived, color: '#ec4899' },
    { name: 'Profile Views', value: dashboardData.stats.totalProfileViews, color: '#f59e0b' }
  ].filter(item => item.value > 0) : [];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Likes Given"
          value={dashboardData?.stats.totalLikesGiven || 0}
          icon={Heart}
          description="People you've liked"
          color="text-pink-600"
        />
        <StatCard
          title="People Who Like You"
          value={dashboardData?.stats.totalLikesReceived || 0}
          icon={UserCheck}
          description="Your admirers"
          color="text-purple-600"
        />
        <StatCard
          title="Mutual Matches"
          value={dashboardData?.stats.totalMatches || 0}
          icon={Users}
          description="Perfect connections"
          color="text-green-600"
        />
        <StatCard
          title="Match Rate"
          value={`${dashboardData?.stats.matchRate || 0}%`}
          icon={TrendingUp}
          description="Success percentage"
          color="text-blue-600"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
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

        <TabsContent value="people" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* People You Liked */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  People You Liked ({dashboardData?.stats.totalLikesGiven || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {likesData.slice(0, 5).map((person, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getAvatarUrl(person)} />
                      <AvatarFallback>
                        {person.firstName?.[0]}{person.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{person.firstName} {person.lastName}</p>
                      {person.isMatch && (
                        <Badge variant="secondary" className="text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          Match
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {likesData.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View All ({likesData.length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* People Who Like You */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  Your Admirers ({dashboardData?.stats.totalLikesReceived || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {crushesData.slice(0, 5).map((person, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getAvatarUrl(person)} />
                      <AvatarFallback>
                        {person.firstName?.[0]}{person.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{person.firstName} {person.lastName}</p>
                      {person.isMatch && (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Match
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {crushesData.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View All ({crushesData.length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Mutual Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Mutual Matches ({dashboardData?.stats.totalMatches || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {matchesData.slice(0, 5).map((person, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getAvatarUrl(person)} />
                      <AvatarFallback>
                        {person.firstName?.[0]}{person.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{person.firstName} {person.lastName}</p>
                      <Badge variant="default" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat Now
                      </Badge>
                    </div>
                  </div>
                ))}
                {matchesData.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View All ({matchesData.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
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
                    <span className="text-sm text-muted-foreground">{dashboardData?.insights.profileCompleteness || 0}%</span>
                  </div>
                  <Progress value={dashboardData?.insights.profileCompleteness || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Tips to improve your success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData?.insights.recommendations.slice(0, 3).map((rec: any, index: number) => (
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
                      <p className="text-sm text-muted-foreground">You're doing great with your profile</p>
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

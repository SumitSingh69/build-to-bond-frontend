'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Save, BarChart3, Heart, Users, Eye as EyeIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { User } from '@/context/AuthContext'

interface ProfileDetailsFormProps {
  profile: User
  onSave?: (updatedProfile: Partial<User>) => void | Promise<void>
  isLoading?: boolean
}

export default function ProfileDetailsForm({ profile, onSave, isLoading = false }: ProfileDetailsFormProps) {
  const [formData, setFormData] = useState<User>(profile)
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (field: keyof User, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsEditing(true)
  }

  const handleNestedInputChange = (
    parentField: keyof User,
    childField: string,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as Record<string, unknown>),
        [childField]: value
      }
    }))
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData)
    }
    setIsEditing(false)
  }

  return (
    <div className="flex-1 space-y-6" suppressHydrationWarning>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Basic Information</span>
            {isEditing && (
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.location?.address || ''}
              onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value="6969"
                readOnly
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='space-y-2'>
            <Label>Age Preference</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className='space-y-2'>
                <Label htmlFor="min-age" className="text-sm text-gray-600">From</Label>
                <Input
                  id="min-age"
                  type="number"
                  value={formData.agePreferences?.min || ''}
                  onChange={(e) => handleNestedInputChange('agePreferences', 'min', parseInt(e.target.value))}
                  min="18"
                  max="100"
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="max-age" className="text-sm text-gray-600">To</Label>
                <Input
                  id="max-age"
                  type="number"
                  value={formData.agePreferences?.max || ''}
                  onChange={(e) => handleNestedInputChange('agePreferences', 'max', parseInt(e.target.value))}
                  min="18"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Privacy</Label>
              <p className="text-sm text-gray-600">Make your profile {formData.privacy}</p>
            </div>
            <Switch
              checked={formData.privacy === 'public'}
              onCheckedChange={(checked) => handleInputChange('privacy', checked ? 'public' : 'private')}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor="looking-for">Looking For</Label>
            <Select
              value={formData.lookingFor}
              onValueChange={(value) => handleInputChange('lookingFor', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="relationship">Relationship</SelectItem>
                <SelectItem value="friendship">Friendship</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='space-y-2'>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.socialLinks?.instagram || ''}
              onChange={(e) => handleNestedInputChange('socialLinks', 'instagram', e.target.value)}
              placeholder="@username"
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.socialLinks?.twitter || ''}
              onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
              placeholder="@username"
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.socialLinks?.facebook || ''}
              onChange={(e) => handleNestedInputChange('socialLinks', 'facebook', e.target.value)}
              placeholder="facebook.com/username"
            />
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan: {(formData.subscription || 'free').toUpperCase()}</p>
              <p className="text-sm text-gray-600">
                {formData.subscription === 'solara' ? 'Premium' : 'Basic'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Subscription: {formData.subscription || 'free'}
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="overflow-hidden">
        <CardHeader className="border-b border-primary-200">
          <CardTitle className="flex items-center space-x-2 text-primary-800">
            <BarChart3 className="w-5 h-5" />
            <span>Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-100 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-pink-100 group-hover:from-red-200 group-hover:to-pink-200 transition-colors duration-300">
                  <Heart className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">{profile.likes?.length || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Likes</p>
                </div>
              </div>
            </div>


            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-300">
                  <Users className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{profile.matches?.length || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Matches</p>
                </div>
              </div>
            </div>


            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors duration-300">
                  <BarChart3 className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">{profile.profileViews || 0}</p>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                </div>
              </div>
            </div>


            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-violet-100 group-hover:from-purple-200 group-hover:to-violet-200 transition-colors duration-300">
                  <EyeIcon className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">{profile.profileCompleteness || 0}%</p>
                  <p className="text-sm font-medium text-gray-600">Completeness</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

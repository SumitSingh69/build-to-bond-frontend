'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/types/auth.types'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onSave: (updatedData: Partial<User>) => Promise<void>
  isLoading?: boolean
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  user, 
  onSave, 
  isLoading = false 
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({})

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        dob: user.dob || '',
        gender: user.gender,
        genderPreference: user.genderPreference,
        lookingFor: user.lookingFor,
        privacy: user.privacy,
        occupation: user.occupation || '',
        education: user.education,
        smoking: user.smoking,
        drinking: user.drinking,
        relationshipStatus: user.relationshipStatus,
        children: user.children,
        religion: user.religion || '',
        height: user.height && user.height >= 100 ? user.height : undefined,
        agePreferences: {
          min: user.agePreferences?.min || 18,
          max: user.agePreferences?.max || 99
        },
        location: {
          address: user.location?.address || '',
          city: user.location?.city || '',
          country: user.location?.country || ''
        },
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          facebook: user.socialLinks?.facebook || '',
          twitter: user.socialLinks?.twitter || '',
          linkedin: user.socialLinks?.linkedin || ''
        }
      })
    }
  }, [isOpen, user])

  const handleInputChange = (field: keyof User, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBioChange = (value: string) => {
    // Count characters
    const charCount = value.length
    
    // Only allow up to 150 characters
    if (charCount <= 150) {
      setFormData((prev: Partial<User>) => ({ ...prev, bio: value }))
    }
  }

  const getBioCharCount = () => {
    const bio = formData.bio || ''
    return bio.length
  }

  const handleNestedInputChange = (parentField: keyof User, childField: string, value: string | number | boolean | undefined) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as Record<string, unknown>),
        [childField]: value
      }
    }))
  }

  const handleSubmit = async () => {
    try {
      // Validate bio character count before submission
      const bioCharCount = getBioCharCount()
      if (bioCharCount > 150) {
        toast.error('Bio must be 150 characters or less')
        return
      }

      // Filter out empty/undefined values and validate specific fields
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          // Skip empty/undefined values
          if (value === null || value === undefined || value === '') return false
          
          // Special handling for height - must be at least 100cm
          if (key === 'height' && typeof value === 'number' && value < 100) return false
          
          // For objects, check if they have any valid values
          if (typeof value === 'object' && !Array.isArray(value)) {
            return Object.values(value).some(v => v !== null && v !== undefined && v !== '')
          }
          
          return true
        })
      )

      await onSave(cleanedData)
      onClose()
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleClose = () => {
    setFormData({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information. All fields are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleBioChange(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className={getBioCharCount() > 150 ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Share a brief description about yourself
                </span>
                <span className={`${getBioCharCount() > 150 ? 'text-red-500' : getBioCharCount() > 130 ? 'text-yellow-500' : 'text-gray-500'}`}>
                  {getBioCharCount()}/150 characters
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender || ''} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="genderPreference">Gender Preference</Label>
                <Select 
                  value={formData.genderPreference || ''} 
                  onValueChange={(value) => handleInputChange('genderPreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lookingFor">Looking For</Label>
                <Select 
                  value={formData.lookingFor || ''} 
                  onValueChange={(value) => handleInputChange('lookingFor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What are you looking for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendship">Friendship</SelectItem>
                    <SelectItem value="relationship">Relationship</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacy">Privacy</Label>
                <Select 
                  value={formData.privacy || ''} 
                  onValueChange={(value) => handleInputChange('privacy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select privacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Your occupation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Select 
                  value={formData.education || ''} 
                  onValueChange={(value) => handleInputChange('education', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                    <SelectItem value="master">Master&apos;s Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => handleInputChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Height in cm"
                  min="100"
                  max="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationshipStatus">Relationship Status</Label>
                <Select 
                  value={formData.relationshipStatus || ''} 
                  onValueChange={(value) => handleInputChange('relationshipStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <Select 
                  value={formData.children || ''} 
                  onValueChange={(value) => handleInputChange('children', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="have_children">Have Children</SelectItem>
                    <SelectItem value="want_children">Want Children</SelectItem>
                    <SelectItem value="dont_want_children">Don&apos;t Want Children</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smoking">Smoking</Label>
                <Select 
                  value={formData.smoking || ''} 
                  onValueChange={(value) => handleInputChange('smoking', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="sometimes">Sometimes</SelectItem>
                    <SelectItem value="regularly">Regularly</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drinking">Drinking</Label>
                <Select 
                  value={formData.drinking || ''} 
                  onValueChange={(value) => handleInputChange('drinking', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="socially">Socially</SelectItem>
                    <SelectItem value="regularly">Regularly</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  value={formData.religion || ''}
                  onChange={(e) => handleInputChange('religion', e.target.value)}
                  placeholder="Your religion (optional)"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Location</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.location?.address || ''}
                onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                placeholder="Your address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.location?.city || ''}
                  onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
                  placeholder="Your city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.location?.country || ''}
                  onChange={(e) => handleNestedInputChange('location', 'country', e.target.value)}
                  placeholder="Your country"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || getBioCharCount() > 150}
            className={`${getBioCharCount() > 150 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : getBioCharCount() > 150 ? 'Bio too long' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  currentProfilePicture?: string;
  userName?: string;
  onFileSelect: (file: File | null) => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export default function ProfilePictureUpload({
  currentProfilePicture,
  userName = "User",
  onFileSelect,
  isUploading = false,
  disabled = false,
}: ProfilePictureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please select a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    onFileSelect(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayImage = previewUrl || currentProfilePicture;
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage 
            src={displayImage} 
            alt={userName}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <div 
          className={`absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 
            ${!disabled && !isUploading ? 'group-hover:opacity-100 cursor-pointer' : ''} 
            transition-opacity flex items-center justify-center`}
          onClick={triggerFileInput}
        >
          {!disabled && !isUploading && (
            <Camera className="w-8 h-8 text-white" />
          )}
          {isUploading && (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Remove button for selected file */}
        {selectedFile && !isUploading && (
          <button
            onClick={handleRemoveFile}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload button */}
      <Button
        onClick={triggerFileInput}
        variant="outline"
        size="sm"
        disabled={disabled || isUploading}
        className="flex items-center space-x-2"
      >
        <Upload className="w-4 h-4" />
        <span>
          {selectedFile ? 'Change Photo' : 'Upload Photo'}
        </span>
      </Button>

      {/* File info */}
      {selectedFile && (
        <div className="text-sm text-gray-600 text-center">
          <div className="font-medium">{selectedFile.name}</div>
          <div className="text-xs">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>Supported formats: JPEG, PNG, WebP</p>
        <p>Maximum size: 5MB</p>
        <p>Recommended: Square image for best results</p>
      </div>
    </div>
  );
}
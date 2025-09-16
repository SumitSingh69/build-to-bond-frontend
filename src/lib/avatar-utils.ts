/**
 * Avatar utility functions for consistent avatar display across the application
 */

interface AvatarUser {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  avatar?: string;
}

/**
 * Get avatar URL with Dicebear fallback
 * Priority: profilePicture -> avatar -> Dicebear generated avatar
 */
export function getAvatarUrl(user: AvatarUser): string {
  // Check for profile picture
  if (user.profilePicture && user.profilePicture.trim()) {
    return user.profilePicture;
  }
  
  // Check for avatar field
  if (user.avatar && user.avatar.trim()) {
    return user.avatar;
  }
  
  // Generate Dicebear avatar using available data as seed
  const seed = user.email || 
               `${user.firstName}-${user.lastName}` || 
               user._id || 
               'user';
  
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * Get error handler for avatar images that falls back to Dicebear
 */
export function getAvatarErrorHandler(user: AvatarUser) {
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const seed = user.email || 
                 `${user.firstName}-${user.lastName}` || 
                 user._id || 
                 'user';
    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };
}

/**
 * Get initials from user name
 */
export function getUserInitials(user: AvatarUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  
  if (user.firstName) {
    return user.firstName.slice(0, 2).toUpperCase();
  }
  
  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  
  return 'U';
}
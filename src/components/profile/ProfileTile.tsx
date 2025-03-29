import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Image as ImageIcon, 
  Edit,
  ArrowRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ImageCropper from './ImageCropper';
import { updateProfilePicture } from '@/services/profileService';
import useProfileRealtime from '@/hooks/useProfileRealtime';

const ProfileTile: React.FC = () => {
  const { user, session, signOut, updateUser } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    file,
    handleFileChange,
    clearFile,
    error: fileError
  } = useFileUpload({
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  useEffect(() => {
    if (fileError) {
      toast({
        title: "File Error",
        description: fileError,
        variant: "destructive"
      });
    }
  }, [fileError, toast]);

  useEffect(() => {
    const setupProfileStorage = async () => {
      try {
        const { error } = await supabase.functions.invoke('setup-profile-storage');
        if (error) console.error('Failed to setup profile storage:', error);
      } catch (err) {
        console.error('Error invoking setup-profile-storage function:', err);
      }
    };
    
    setupProfileStorage();
  }, []);

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e);
    if (e.target.files && e.target.files[0]) {
      setUploadDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setUploadDialogOpen(false);
    clearFile();
    setCroppedImage(null);
  };

  const handleCroppedImage = (image: string) => {
    setCroppedImage(image);
  };

  const handleUpload = async () => {
    if (!croppedImage || !user) return;
    
    setIsUploading(true);
    
    try {
      const updatedProfile = await updateProfilePicture(user.id, croppedImage);
      
      if (updatedProfile) {
        updateUser({ 
          ...user, 
          avatar_url: updatedProfile.avatar_url 
        });
        
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      }
      
      handleDialogClose();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleChangePassword = () => {
    navigate('/reset-password');
  };

  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    }
    
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative flex items-center w-full p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="relative group cursor-pointer" onClick={handleProfileClick}>
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
              />
            </div>
            <div className="ml-3 text-left flex-1 overflow-hidden">
              <p className="font-medium text-sm truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role || 'User'}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>View Profile</span>
            <ArrowRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleChangePassword} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Change Password</span>
            <ArrowRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Image Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Crop and position your photo, then click save to update your profile picture.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {file && (
              <ImageCropper 
                image={URL.createObjectURL(file)} 
                onCropComplete={handleCroppedImage} 
                aspectRatio={1}
              />
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!croppedImage || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileTile;

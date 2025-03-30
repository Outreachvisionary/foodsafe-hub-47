
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

interface ProfileTileProps {
  collapsed?: boolean;
}

const ProfileTile: React.FC<ProfileTileProps> = ({ collapsed = false }) => {
  const { t } = useTranslation();
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`w-full justify-between px-2 hover:bg-secondary group ${collapsed ? 'justify-center' : ''}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-8 w-8 mr-2 ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all">
              <AvatarImage src={user?.avatar_url || ''} />
              <AvatarFallback className="bg-accent/10 text-accent">{user?.full_name?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="text-sm font-medium truncate">
                {user?.full_name || user?.email || t('common.user')}
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('profile.title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
          <User className="mr-2 h-4 w-4 text-blue-500" />
          {t('profile.viewProfile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4 text-orange-500" />
          {t('profile.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <LanguageSelector />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {t('auth.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileTile;

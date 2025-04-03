import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';

const MainNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle({
              className: location.pathname === '/dashboard' ? 'bg-accent text-accent-foreground' : ''
            })}>
              {t('navigation.dashboard')}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/documents" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle({
              className: location.pathname === '/documents' ? 'bg-accent text-accent-foreground' : ''
            })}>
              {t('navigation.documents')}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {user && (
          <>
            <NavigationMenuItem>
              <Link to="/users" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle({
                  className: location.pathname === '/users' ? 'bg-accent text-accent-foreground' : ''
                })}>
                  User Management
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/db-test" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle({
                  className: location.pathname === '/db-test' ? 'bg-accent text-accent-foreground' : ''
                })}>
                  Database Test
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;

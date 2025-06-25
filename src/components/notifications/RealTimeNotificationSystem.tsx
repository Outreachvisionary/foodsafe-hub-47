
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Global state to track active subscriptions per user
const activeSubscriptions = new Map<string, boolean>();

const RealTimeNotificationSystem: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Early return if no user
    if (!user?.id) {
      console.log('No user available for notifications');
      return;
    }

    const userId = user.id;
    const subscriptionKey = `notifications_${userId}`;

    // Check if we already have an active subscription for this user
    if (activeSubscriptions.get(subscriptionKey)) {
      console.log('Notification subscription already active for user:', userId);
      return;
    }

    console.log('Setting up notification subscription for user:', userId);

    // Mark subscription as active immediately
    activeSubscriptions.set(subscriptionKey, true);

    // Create a unique channel name
    const channelName = `${subscriptionKey}_${Date.now()}`;
    
    const channel = supabase.channel(channelName);

    // Configure the channel with all listeners
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          console.log('Document change notification:', payload);
          // Handle document changes for notifications
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'non_conformances'
        },
        (payload) => {
          console.log('Non-conformance change notification:', payload);
          // Handle non-conformance changes for notifications
        }
      )
      .subscribe((status) => {
        console.log(`Notification subscription status for ${userId}:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications channel');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to notifications channel');
          // Clear the active subscription flag on error
          activeSubscriptions.delete(subscriptionKey);
        } else if (status === 'CLOSED') {
          console.log('Notification channel subscription closed');
          activeSubscriptions.delete(subscriptionKey);
        }
      });

    // Cleanup function
    return () => {
      console.log('Cleaning up notification subscription for user:', userId);
      
      // Remove the channel
      supabase.removeChannel(channel);
      
      // Clear the active subscription flag
      activeSubscriptions.delete(subscriptionKey);
    };
  }, [user?.id]);

  // This component doesn't render anything visible
  return null;
};

export default RealTimeNotificationSystem;

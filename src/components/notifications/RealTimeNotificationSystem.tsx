
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

const RealTimeNotificationSystem: React.FC = () => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscriptionStateRef = useRef<'idle' | 'subscribing' | 'subscribed'>('idle');

  useEffect(() => {
    if (!user) {
      // Clean up if user is not available
      if (channelRef.current) {
        console.log('Cleaning up channel due to no user');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscriptionStateRef.current = 'idle';
      }
      return;
    }

    // Prevent multiple subscriptions
    if (subscriptionStateRef.current !== 'idle') {
      console.log('Subscription already in progress or active, skipping');
      return;
    }

    // Set subscribing state immediately to prevent concurrent attempts
    subscriptionStateRef.current = 'subscribing';

    // Clean up any existing channel before creating a new one
    if (channelRef.current) {
      console.log('Removing existing channel before creating new one');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create a new channel with a unique name
    const channelName = `notifications_${user.id}_${Date.now()}`;
    console.log('Creating new channel:', channelName);
    
    const channel = supabase.channel(channelName);

    // Set up the channel listeners before subscribing
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          console.log('Document change:', payload);
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
          console.log('Non-conformance change:', payload);
          // Handle non-conformance changes for notifications
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications channel');
          subscriptionStateRef.current = 'subscribed';
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to notifications channel');
          subscriptionStateRef.current = 'idle';
        } else if (status === 'CLOSED') {
          console.log('Channel subscription closed');
          subscriptionStateRef.current = 'idle';
        }
      });

    // Store the channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log('Cleaning up notifications channel in useEffect cleanup');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      subscriptionStateRef.current = 'idle';
    };
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-subscriptions

  // This component doesn't render anything visible
  return null;
};

export default RealTimeNotificationSystem;


import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

const RealTimeNotificationSystem: React.FC = () => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    // Clean up any existing channel before creating a new one
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create a new channel with a unique name
    const channelName = `notifications_${user.id}_${Date.now()}`;
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
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to notifications channel');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Failed to subscribe to notifications channel');
      }
    });

    // Store the channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('Cleaning up notifications channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-subscriptions

  // This component doesn't render anything visible
  return null;
};

export default RealTimeNotificationSystem;

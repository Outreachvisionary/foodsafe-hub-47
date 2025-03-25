
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { fetchNotifications, markNotificationAsRead } from '@/services/supabaseService';
import { DocumentNotification } from '@/types/supabase';

type NotificationType = 'info' | 'warning' | 'error' | 'success';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAll: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Convert Supabase notification to app notification format
  const mapDbNotificationToAppNotification = (dbNotification: DocumentNotification): Notification => {
    return {
      id: dbNotification.id,
      type: dbNotification.type as NotificationType,
      title: dbNotification.document_title,
      message: dbNotification.message,
      read: dbNotification.is_read,
      timestamp: new Date(dbNotification.created_at),
    };
  };

  // Load notifications from Supabase
  const loadNotifications = useCallback(async () => {
    try {
      const dbNotifications = await fetchNotifications();
      const appNotifications = dbNotifications.map(mapDbNotificationToAppNotification);
      setNotifications(appNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // For each unread notification, mark it as read
      const unreadNotificationIds = notifications
        .filter(notification => !notification.read)
        .map(notification => notification.id);
      
      // Update all unread notifications in parallel
      await Promise.all(unreadNotificationIds.map(id => markNotificationAsRead(id)));
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, [notifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

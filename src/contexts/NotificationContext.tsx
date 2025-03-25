
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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
  addNotification: (type: NotificationType, title: string, message: string) => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Document Expiring',
      message: 'Quality Manual will expire in 5 days',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      type: 'info',
      title: 'Audit Scheduled',
      message: 'Internal audit scheduled for next Tuesday',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: '3',
      type: 'success',
      title: 'Document Approved',
      message: 'HACCP Plan approved by Management',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((type: NotificationType, title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      read: false,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

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

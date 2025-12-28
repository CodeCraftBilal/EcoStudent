"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSession } from "./useSession";
import { useSocket } from "./useSocket";
import { Notification } from "@/lib/types/types";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { BACKEND_URL } from "@/lib/types/constants";
import { authFetch } from "@/lib/authFetch";

interface NotificationContextType {
  notifications: Notification[];
  messageNotifications: Notification[];

  addNotification: (notification: Notification) => void;
  addMessageNotification: (notification: Notification) => void;

  markAsRead: (id: string, type?: "notification" | "message") => void;
  markAllAsRead: (type?: "notification" | "message") => void;

  unreadNotificationCount: number;
  unreadMessageCount: number;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  messageNotifications: [],
  addNotification: () => {},
  addMessageNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  unreadNotificationCount: 0,
  unreadMessageCount: 0,
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session, isLoading } = useSession();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messageNotifications, setMessageNotifications] = useState<Notification[]>([]);

  /* ===============================
     FETCH INITIAL DATA (REST)
  ================================*/
  useEffect(() => {
    if (!session || isLoading) return;

    const fetchNotifications = async () => {
      try {
        const [notifRes, msgRes] = await Promise.all([
          authFetch(`${BACKEND_URL}/notification`, {
            credentials: "include",
          }),
          authFetch(`${BACKEND_URL}/messages/notifications`, {
            credentials: "include",
          }),
        ]);

        if (notifRes.ok) {
          const notifData: Notification[] = await notifRes.json();
          setNotifications(notifData);
        }

        if (msgRes.ok) {
          const msgData: Notification[] = await msgRes.json();
          setMessageNotifications(msgData);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [session, isLoading]);

  /* ===============================
     SOCKET LISTENER (REALTIME)
  ================================*/
  useEffect(() => {
    if (!socket || !session || isLoading) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on(
      SOCKET_EVENTS.NOTIFICATION.NOTIFICATION_NEW,
      handleNewNotification
    );

    return () => {
      socket.off(
        SOCKET_EVENTS.NOTIFICATION.NOTIFICATION_NEW,
        handleNewNotification
      );
    };
  }, [socket, session, isLoading]);

  /* ===============================
     ADDERS (MANUAL / FUTURE USE)
  ================================*/
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const addMessageNotification = useCallback((notification: Notification) => {
    setMessageNotifications(prev => [notification, ...prev]);
  }, []);

  /* ===============================
     MARK READ
  ================================*/
  const markAsRead = (
    id: string,
    type: "notification" | "message" = "notification"
  ) => {
    const updater = (items: Notification[]) =>
      items.map(n => (n.id === id ? { ...n, read: true } : n));

    if (type === "message") {
      setMessageNotifications(updater);
    } else {
      setNotifications(updater);
    }
  };

  const markAllAsRead = (
    type: "notification" | "message" = "notification"
  ) => {
    const updater = (items: Notification[]) =>
      items.map(n => ({ ...n, read: true }));

    if (type === "message") {
      setMessageNotifications(updater);
    } else {
      setNotifications(updater);
    }
  };

  /* ===============================
     COUNTS
  ================================*/
  const unreadNotificationCount = notifications.filter(n => !n.read).length;
  const unreadMessageCount = messageNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        messageNotifications,
        addNotification,
        addMessageNotification,
        markAsRead,
        markAllAsRead,
        unreadNotificationCount,
        unreadMessageCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

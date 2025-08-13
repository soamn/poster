"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type NotificationType = "success" | "error" | "info" | "warning";

type Notification = {
  message: string;
  messageType: NotificationType;
  time: number;
};

type NotificationContextType = {
  showNotification: (msg: string, type: NotificationType, time?: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);

  const showNotification = useCallback((msg: string, type: NotificationType, time = 3000) => {
    setNotification({ message: msg, messageType: type, time });
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, time);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {visible && notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-4 py-3 rounded shadow-lg ${
              {
                success: "bg-green-500 text-white",
                error: "bg-red-500 text-white",
                info: "bg-blue-500 text-white",
                warning: "bg-yellow-500 text-black",
              }[notification.messageType]
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Hook to use in any component
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

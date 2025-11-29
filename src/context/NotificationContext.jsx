import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "High Energy Usage",
            message: "Block A2 exceeded daily energy threshold by 15%.",
            time: "10 min ago",
            read: false,
            type: "warning"
        },
        {
            id: 2,
            title: "Report Generated",
            message: "Monthly Waste Management report is ready for download.",
            time: "1 hour ago",
            read: false,
            type: "success"
        },
        {
            id: 3,
            title: "System Maintenance",
            message: "Scheduled maintenance for water sensors tonight at 2 AM.",
            time: "5 hours ago",
            read: true,
            type: "info"
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

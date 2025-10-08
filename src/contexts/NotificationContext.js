const { createContext, useContext, useState } = React;
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useLocalStorage('notifications', []);
    const [showNotifications, setShowNotifications] = useState(false);

    const addNotification = (message) => {
        const newNotification = { id: crypto.randomUUID(), message, read: false, date: new Date().toISOString() };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const value = {
        notifications,
        showNotifications,
        setShowNotifications,
        addNotification,
        markNotificationAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

const useNotifications = () => useContext(NotificationContext);
const NotificationPanel = () => {
    const { notifications, markNotificationAsRead } = useNotifications();

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
            <div className="py-2 px-4 text-gray-800 font-bold border-b">Notifications</div>
            <div className="divide-y">
                {notifications.length > 0 ? notifications.slice(0, 10).map(n => (
                    <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-3 hover:bg-gray-100 cursor-pointer ${n.read ? 'text-gray-500' : 'text-gray-800'}`}>
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-gray-400">{new Date(n.date).toLocaleString()}</p>
                    </div>
                )) : <p className="p-4 text-sm text-gray-500">No new notifications.</p>}
            </div>
        </div>
    );
};
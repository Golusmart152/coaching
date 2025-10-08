const Header = ({ searchQuery, setSearchQuery, navigateTo }) => {
    const { user, handleLogout } = useAuth();
    const { notifications, showNotifications, setShowNotifications } = useNotifications();

    return (
        <header className="bg-gray-900 text-white p-4 shadow-lg">
            <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                <h1 className="text-2xl font-bold">Institute Admin Panel</h1>

                <div className="flex-1 max-w-md mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    navigateTo('/search', searchQuery);
                                }
                            }}
                            placeholder="Search students, employees, transactions..."
                            className="w-full pl-4 pr-12 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                        <button
                            onClick={() => navigateTo('/search', searchQuery)}
                            className="absolute right-2 top-1 bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <nav className="flex flex-wrap items-center justify-center lg:justify-end gap-4">
                    <div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative z-10 block rounded-md bg-gray-800 p-2 focus:outline-none">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                        {showNotifications && <NotificationPanel />}
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-400">{user.role}</p>
                    </div>
                    <button onClick={() => navigateTo('/dashboard')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        Dashboard
                    </button>
                    <button onClick={() => navigateTo('/settings')} className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
                        ⚙️ Settings
                    </button>
                    <button onClick={handleLogout} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};
const App = () => {
    const { useState, useEffect } = React;

    const [user, setUser] = useLocalStorage('user', null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!user);
    const [page, setPage] = useState('dashboard');
    const [mode, setMode] = useState('offline');
    const [students, setStudents] = useLocalStorage('students', []);
    const [courses, setCourses] = useLocalStorage('courses', []);
    const [fees, setFees] = useLocalStorage('fees', []);
    const [results, setResults] = useLocalStorage('results', []);
    const [enquiries, setEnquiries] = useLocalStorage('enquiries', []);
    const [employees, setEmployees] = useLocalStorage('employees', []);
    const [salaries, setSalaries] = useLocalStorage('salaries', []);
    const [exams, setExams] = useLocalStorage('exams', []);
    const [nextStudentId, setNextStudentId] = useLocalStorage('nextStudentId', 1001);
    const [nextEmployeeId, setNextEmployeeId] = useLocalStorage('nextEmployeeId', 101);
    const [nextExamId, setNextExamId] = useLocalStorage('nextExamId', 1);
    const [instituteDetails, setInstituteDetails] = useLocalStorage('instituteDetails', {
        name: '',
        address: '',
        phone: '',
        email: ''
    });
    const [notifications, setNotifications] = useLocalStorage('notifications', []);
    const [showNotifications, setShowNotifications] = useState(false);

    const addNotification = (message) => {
        const newNotification = { id: crypto.randomUUID(), message, read: false, date: new Date().toISOString() };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        showMessage("You have been logged out.");
    };

    // --- Component-agnostic functions ---
    const showMessage = (message, duration = 3000) => {
      const messageBox = document.getElementById('messageBox');
      if (messageBox) {
          messageBox.textContent = message;
          messageBox.classList.remove('hidden');
          setTimeout(() => {
              messageBox.classList.add('hidden');
          }, duration);
      }
    };

   const renderPage = () => {
    if (!isLoggedIn) {
        return <LoginPage
                setIsLoggedIn={setIsLoggedIn}
                setMode={setMode}
                showMessage={showMessage}
                employees={employees}
                setUser={setUser}
            />;
    }

    const userRole = user ? user.role : '';

    const accessDenied = <PageContainer title="Access Denied">You do not have permission to view this page.</PageContainer>;

    const pageMap = {
        'dashboard': { component: Dashboard, props: { setPage, students, courses, enquiries, employees, exams, fees }, roles: ['Admin', 'Teacher', 'Data Entry'] },
        'students': { component: StudentsPage, props: { students, setStudents, courses, nextStudentId, setNextStudentId, showMessage }, roles: ['Admin', 'Teacher', 'Data Entry'] },
        'courses': { component: CoursesPage, props: { courses, setCourses, showMessage }, roles: ['Admin', 'Teacher'] },
        'fees': { component: FeesPage, props: { students, courses, fees, setFees, showMessage, instituteDetails }, roles: ['Admin'] },
        'exams': { component: ExamsPage, props: { students, exams, setExams, results, setResults, nextExamId, setNextExamId, showMessage }, roles: ['Admin', 'Teacher'] },
        'reports': { component: ReportsPage, props: { students, fees, results, courses, enquiries, employees, showMessage }, roles: ['Admin'] },
        'enquiries': { component: EnquiriesPage, props: { courses, enquiries, setEnquiries, showMessage, addNotification }, roles: ['Admin', 'Data Entry'] },
        'employees': { component: EmployeePage, props: { employees, setEmployees, salaries, setSalaries, instituteDetails, showMessage, PageContainer, Table }, roles: ['Admin'] },
        'certificates': { component: CertificatesPage, props: {}, roles: ['Admin'] },
        'instituteDetails': { component: InstituteDetailsPage, props: { instituteDetails, setInstituteDetails, showMessage }, roles: ['Admin'] },
    };

    const currentPage = pageMap[page] || pageMap['dashboard'];

    if (currentPage.roles.includes(userRole)) {
        const PageComponent = currentPage.component;
        return <PageComponent {...currentPage.props} />;
    } else {
        return accessDenied;
    }
};

    const NotificationPanel = () => (
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

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            {isLoggedIn && (
                <header className="bg-gray-900 text-white p-4 shadow-lg">
                    <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <h1 className="text-2xl font-bold">Institute Admin Panel</h1>
                        <nav className="flex flex-wrap items-center justify-center md:justify-end gap-4">
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
                            <button onClick={() => setPage('dashboard')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                                Dashboard
                            </button>
                            <button onClick={handleLogout} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                                Logout
                            </button>
                        </nav>
                    </div>
                </header>
            )}

            <main className="container mx-auto max-w-7xl py-8">
                {renderPage()}
            </main>

            {isLoggedIn && (
                <footer className="w-full text-center py-4 text-gray-500 text-sm">
                    <p>Logged in as: <span className="font-mono bg-gray-200 rounded-md px-2 py-1 text-xs">{user.email || user.role}</span></p>
                </footer>
            )}
        </div>
    );
};

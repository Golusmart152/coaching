const App = () => {
    const { useState, useEffect } = React;
    const {
        students, setStudents,
        courses, setCourses,
        fees, setFees,
        results, setResults,
        enquiries, setEnquiries,
        employees, setEmployees,
        salaries, setSalaries,
        exams, setExams,
        nextStudentId, setNextStudentId,
        nextEmployeeId, setNextEmployeeId,
        nextExamId, setNextExamId,
        instituteDetails, setInstituteDetails
    } = useData();
    const { user, setUser, isLoggedIn, setIsLoggedIn, handleLogout: authHandleLogout } = useAuth();
    const {
        notifications,
        showNotifications,
        setShowNotifications,
        addNotification,
        markNotificationAsRead
    } = useNotifications();

    const [page, setPage] = useState('dashboard');
    const [mode, setMode] = useState('offline');
    const [searchQuery, setSearchQuery] = useState('');

    // Router functions
    const parseRoute = () => {
        const hash = window.location.hash.slice(1) || '/';
        const [path, queryString] = hash.split('?');
        const params = new URLSearchParams(queryString || '');
        return { path, params };
    };
    
    const navigateTo = (path, query = '') => {
        const url = query ? `${path}?q=${encodeURIComponent(query)}` : path;
        window.location.hash = url;
    };
    
    const handleRouteChange = () => {
        if (!isLoggedIn) return;
        
        const { path, params } = parseRoute();
        const query = params.get('q') || '';
        
        switch(path) {
            case '/search':
                setPage('search');
                setSearchQuery(query);
                break;
            case '/dashboard':
                setPage('dashboard');
                break;
            default:
                if (path.startsWith('/')) {
                    const pageName = path.slice(1);
                    if (pageMap[pageName]) {
                        setPage(pageName);
                    } else {
                        setPage('dashboard');
                        window.location.hash = '/dashboard';
                    }
                } else {
                    setPage('dashboard');
                    window.location.hash = '/dashboard';
                }
                break;
        }
    };
    
    // Initialize routing
    useEffect(() => {
        if (isLoggedIn) {
            handleRouteChange();
        } else {
            setPage('dashboard');
        }
        window.addEventListener('hashchange', handleRouteChange);
        return () => window.removeEventListener('hashchange', handleRouteChange);
    }, [isLoggedIn]);


    // Page definitions for routing
    const pageMap = {
        'dashboard': { component: Dashboard, props: { setPage }, roles: ['Admin', 'Teacher', 'Data Entry'] },
        'students': { component: StudentsPage, props: { showMessage }, roles: ['Admin', 'Teacher', 'Data Entry'] },
        'courses': { component: CoursesPage, props: { showMessage }, roles: ['Admin', 'Teacher'] },
        'fees': { component: FeesPage, props: { showMessage }, roles: ['Admin'] },
        'exams': { component: ExamsPage, props: { showMessage }, roles: ['Admin', 'Teacher'] },
        'reports': { component: ReportsPage, props: { showMessage }, roles: ['Admin'] },
        'enquiries': { component: EnquiriesPage, props: { showMessage }, roles: ['Admin', 'Data Entry'] },
        'employees': { component: EmployeePage, props: { showMessage, PageContainer, Table }, roles: ['Admin'] },
        'certificates': { component: CertificatesPage, props: {}, roles: ['Admin'] },
        'instituteDetails': { component: InstituteDetailsPage, props: { showMessage }, roles: ['Admin'] },
        'search': { component: SearchPage, props: { searchQuery, showMessage, navigateTo }, roles: ['Admin', 'Teacher', 'Data Entry'] },
        'settings': { component: SettingsPage, props: { navigateTo, showMessage }, roles: ['Admin'] },
        'user-management': { component: UserManagementPage, props: { showMessage, navigateTo }, roles: ['Admin'] },
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
                setMode={setMode}
                showMessage={showMessage}
            />;
    }

    const userRole = user ? user.role : '';

    const accessDenied = <PageContainer title="Access Denied">You do not have permission to view this page.</PageContainer>;

    const currentPage = pageMap[page] || pageMap['dashboard'];

    if (currentPage.roles.includes(userRole)) {
        const PageComponent = currentPage.component;
        return <PageComponent {...currentPage.props} />;
    } else {
        return accessDenied;
    }
};

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            {isLoggedIn && (
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    navigateTo={navigateTo}
                />
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

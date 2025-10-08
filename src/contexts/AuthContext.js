const { createContext, useContext, useState } = React;
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!user);

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        window.location.hash = '/';
    };

    const value = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);
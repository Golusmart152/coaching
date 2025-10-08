const LoginPage = ({ setMode, showMessage }) => {
    const { useState } = React;
    const { employees } = useData();
    const { setIsLoggedIn, setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOfflineLogin = (e) => {
        e.preventDefault();
        const employee = employees.find(emp => emp.email === email);

        if (employee && employee.password === password) {
            setIsLoggedIn(true);
            setMode('offline');
            setUser(employee);
            showMessage(`Logged in as ${employee.role}!`);
        } else if (email === OFFLINE_USERNAME && password === OFFLINE_PASSWORD) {
            // Fallback for the original admin user
            setIsLoggedIn(true);
            setMode('offline');
            setUser({ role: 'Admin', firstName: 'Super', lastName: 'Admin' });
            showMessage('Logged in as Super Admin!');
        } else {
            showMessage('Invalid email or password.');
        }
    };

    const handleCloudLogin = async (e) => {
        e.preventDefault();
        showMessage('Cloud login functionality coming soon!');
        // This is where Firebase Authentication would be implemented
        // try {
        //    const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //    const user = employees.find(emp => emp.email === userCredential.user.email);
        //    setIsLoggedIn(true);
        //    setMode('cloud');
        //    setUser(user);
        //    dataService.setMode('cloud', db, auth, userCredential.user.uid);
        //    showMessage('Logged in to the cloud!');
        // } catch (error) {
        //    showMessage('Cloud login failed: ' + error.message);
        // }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Employee Login</h2>
                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                    <div className="space-y-4">
                        <button
                            type="submit"
                            onClick={handleOfflineLogin}
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            Login
                        </button>
                        <button
                            type="submit"
                            onClick={handleCloudLogin}
                            className="w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
                        >
                            Login to Cloud
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Login with the credentials created in the Employee section.</p>
                    <p>Default Super Admin: `admin` / `password`</p>
                </div>
            </div>
        </div>
    );
};

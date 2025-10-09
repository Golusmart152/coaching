const LoginPage = ({ setMode, showMessage }) => {
    const { useState } = React;
    const { setIsLoggedIn, setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOfflineLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showMessage('Please enter both email and password.');
            return;
        }

        try {
            // Find the employee in the Dexie database
            const employee = await db.employees.where('email').equals(email).first();

            if (employee && employee.password === password) {
                setIsLoggedIn(true);
                setMode('offline');
                setUser(employee);
                showMessage(`Logged in as ${employee.role}!`);
            } else {
                showMessage('Invalid email or password.');
            }
        } catch (error) {
            console.error("Login error:", error);
            showMessage('An error occurred during login. Please try again.');
        }
    };

    const handleCloudLogin = async (e) => {
        e.preventDefault();
        showMessage('Cloud login functionality coming soon!');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Employee Login</h2>
                <form className="space-y-4" onSubmit={handleOfflineLogin}>
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
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={handleCloudLogin}
                            className="w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
                        >
                            Login to Cloud
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Login with the credentials created in the Employee section.</p>
                </div>
            </div>
        </div>
    );
};
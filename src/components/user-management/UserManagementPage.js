const UserManagementPage = ({ showMessage, navigateTo }) => {
    const { useState, useEffect } = React;
    
    // Available roles and modules for permissions
    const availableRoles = ['Super Admin', 'Admin', 'Teacher', 'Data Entry', 'Student'];
    const modules = ['students', 'employees', 'courses', 'fees', 'exams', 'results', 'enquiries', 'salaries', 'reports'];
    const permissionLevels = ['Block', 'View Only', 'Edit Info', 'Delete Info'];

    // Initialize default permissions for a user (moved to top to fix hoisting issue)
    const getDefaultPermissions = (role) => {
        const defaultPermissions = {};
        modules.forEach(module => {
            if (role === 'Super Admin') {
                defaultPermissions[module] = 'Delete Info';
            } else if (role === 'Admin') {
                defaultPermissions[module] = 'Edit Info';
            } else if (role === 'Teacher') {
                defaultPermissions[module] = module === 'students' || module === 'exams' || module === 'results' ? 'Edit Info' : 'View Only';
            } else {
                defaultPermissions[module] = 'View Only';
            }
        });
        return defaultPermissions;
    };
    
    // Mock users data - using lazy initializer to fix runtime bug
    const [users, setUsers] = useLocalStorage('systemUsers', () => ([
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@institute.com',
            role: 'Super Admin',
            status: 'Active',
            lastLogin: '2025-09-12T10:30:00',
            permissions: getDefaultPermissions('Super Admin')
        }
    ]));
    
    // Get current user role (for Super Admin protection)
    // TODO: Integrate with real authentication context in production
    const currentUser = { role: 'Admin' }; // Hardcoded for demo - replace with real auth
    const isCurrentUserSuperAdmin = currentUser.role === 'Super Admin';
    
    // Fix Super Admin permissions on first load
    useEffect(() => {
        const superAdmin = users.find(user => user.role === 'Super Admin');
        if (superAdmin && Object.keys(superAdmin.permissions).length === 0) {
            setUsers(users.map(user => 
                user.role === 'Super Admin' 
                    ? { ...user, permissions: getDefaultPermissions('Super Admin') }
                    : user
            ));
        }
    }, []);
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [view, setView] = useState('table'); // 'table' or 'permissions'
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Teacher',
        status: 'Active',
        permissions: {}
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [preservePermissions, setPreservePermissions] = useState(true);

    const handleAddUser = () => {
        if (!newUser.name.trim() || !newUser.email.trim()) {
            showMessage('Please fill in all required fields', 3000);
            return;
        }

        const emailExists = users.some(user => 
            user.email.toLowerCase() === newUser.email.toLowerCase() && 
            (!editingUser || user.id !== editingUser.id)
        );
        if (emailExists) {
            showMessage('A user with this email already exists', 3000);
            return;
        }

        if (editingUser) {
            // Update existing user
            let finalPermissions = editingUser.permissions;
            
            if (editingUser.role !== newUser.role) {
                if (!preservePermissions) {
                    // Reset to role defaults
                    finalPermissions = getDefaultPermissions(newUser.role);
                } else {
                    // Cap existing permissions to new role's maximum
                    const roleDefaults = getDefaultPermissions(newUser.role);
                    finalPermissions = Object.keys(editingUser.permissions).reduce((capped, module) => {
                        const currentPerm = editingUser.permissions[module];
                        const rolePerm = roleDefaults[module];
                        const permLevels = ['Block', 'View Only', 'Edit Info', 'Delete Info'];
                        const currentIndex = permLevels.indexOf(currentPerm);
                        const roleIndex = permLevels.indexOf(rolePerm);
                        
                        // Cap permission to role's maximum
                        capped[module] = currentIndex > roleIndex ? rolePerm : currentPerm;
                        return capped;
                    }, {});
                }
            }
            
            const updatedUser = {
                ...editingUser,
                ...newUser,
                permissions: finalPermissions
            };
            setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
            showMessage('User updated successfully', 3000);
        } else {
            // Add new user
            const user = {
                id: Date.now(),
                ...newUser,
                permissions: getDefaultPermissions(newUser.role),
                lastLogin: null
            };
            setUsers([...users, user]);
            showMessage('User added successfully', 3000);
        }
        
        setNewUser({ name: '', email: '', role: 'Teacher', status: 'Active', permissions: {} });
        setEditingUser(null);
        setShowAddForm(false);
    };
    
    const handleEditUser = (user) => {
        // Prevent non-Super Admins from editing Super Admin
        if (user.role === 'Super Admin' && !isCurrentUserSuperAdmin) {
            showMessage('Only Super Admin can edit Super Admin accounts', 3000);
            return;
        }
        
        setEditingUser(user);
        setNewUser({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            permissions: user.permissions
        });
        setPreservePermissions(true);
        setShowAddForm(true);
    };

    const handleDeleteUser = (userId) => {
        const targetUser = users.find(user => user.id === userId);
        
        // Protect Super Admin from deletion
        if (targetUser?.role === 'Super Admin') {
            showMessage('Super Admin accounts cannot be deleted', 3000);
            return;
        }
        
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setUsers(users.filter(user => user.id !== userId));
            showMessage('User deleted successfully', 3000);
        }
    };

    const handleStatusToggle = (userId) => {
        const targetUser = users.find(user => user.id === userId);
        
        // Prevent non-Super Admins from disabling Super Admin
        if (targetUser?.role === 'Super Admin' && !isCurrentUserSuperAdmin) {
            showMessage('Only Super Admin can disable Super Admin accounts', 3000);
            return;
        }
        
        setUsers(users.map(user => 
            user.id === userId 
                ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' }
                : user
        ));
        showMessage('User status updated', 3000);
    };

    const handlePermissionChange = (module, permission) => {
        if (!selectedUser) return;
        
        // Prevent non-Super Admins from changing Super Admin permissions
        if (selectedUser.role === 'Super Admin' && !isCurrentUserSuperAdmin) {
            showMessage('Only Super Admin can modify Super Admin permissions', 3000);
            return;
        }
        
        const updatedPermissions = {
            ...selectedUser.permissions,
            [module]: permission
        };
        
        const updatedUser = {
            ...selectedUser,
            permissions: updatedPermissions
        };
        
        setSelectedUser(updatedUser);
        setUsers(users.map(user => 
            user.id === selectedUser.id ? updatedUser : user
        ));
    };

    const getPermissionColor = (permission) => {
        switch(permission) {
            case 'Block': return 'bg-red-100 text-red-800';
            case 'View Only': return 'bg-yellow-100 text-yellow-800';
            case 'Edit Info': return 'bg-blue-100 text-blue-800';
            case 'Delete Info': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderUserTable = () => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">System Users</h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    + Add New User
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => {
                                            // Check permissions for Super Admin access
                                            if (user.role === 'Super Admin' && !isCurrentUserSuperAdmin) {
                                                showMessage('Only Super Admin can access Super Admin permissions', 3000);
                                                return;
                                            }
                                            setSelectedUser(user);
                                            setView('permissions');
                                        }}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Permissions
                                    </button>
                                    {(user.role !== 'Super Admin' || isCurrentUserSuperAdmin) && (
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    {(user.role !== 'Super Admin' || isCurrentUserSuperAdmin) && (
                                        <button
                                            onClick={() => handleStatusToggle(user.id)}
                                            className="text-yellow-600 hover:text-yellow-900"
                                        >
                                            {user.status === 'Active' ? 'Disable' : 'Enable'}
                                        </button>
                                    )}
                                    {user.role !== 'Super Admin' && (
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPermissionsPanel = () => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">User Permissions: {selectedUser?.name}</h3>
                    <p className="text-sm text-gray-600">Role: {selectedUser?.role}</p>
                </div>
                <button
                    onClick={() => setView('table')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                    ← Back to Users
                </button>
            </div>
            
            <div className="p-6">
                <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-4">Module Permissions</h4>
                    <p className="text-sm text-gray-600 mb-4">
                        Configure granular permissions for each module. Choose the appropriate access level:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                        {permissionLevels.map(level => (
                            <div key={level} className={`px-3 py-2 rounded-lg text-center text-sm font-medium ${getPermissionColor(level)}`}>
                                {level}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {modules.map(module => (
                        <div key={module} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                                <h5 className="font-medium text-gray-800 capitalize">{module}</h5>
                                <p className="text-sm text-gray-600">
                                    {module === 'students' && 'Student registration, enrollment, and management'}
                                    {module === 'employees' && 'Staff management and employee records'}
                                    {module === 'courses' && 'Course creation and curriculum management'}
                                    {module === 'fees' && 'Fee collection and payment tracking'}
                                    {module === 'exams' && 'Examination setup and management'}
                                    {module === 'results' && 'Grade entry and result management'}
                                    {module === 'enquiries' && 'Student inquiries and admissions'}
                                    {module === 'salaries' && 'Staff salary and payroll management'}
                                    {module === 'reports' && 'Analytics and reporting system'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <select
                                    value={selectedUser?.permissions?.[module] || 'View Only'}
                                    onChange={(e) => handlePermissionChange(module, e.target.value)}
                                    disabled={selectedUser?.role === 'Super Admin' && !isCurrentUserSuperAdmin}
                                    className={`form-select text-sm border-gray-300 rounded-md ${selectedUser?.role === 'Super Admin' && !isCurrentUserSuperAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    {permissionLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Permission Levels Explained:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li><strong>Block:</strong> User cannot see or access this module</li>
                        <li><strong>View Only:</strong> User can view data but cannot make changes</li>
                        <li><strong>Edit Info:</strong> User can view and modify existing records</li>
                        <li><strong>Delete Info:</strong> User has full control including delete permissions</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderAddUserForm = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">
                    {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            className="form-input w-full"
                            placeholder="Enter full name"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="form-input w-full"
                            placeholder="Enter email address"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            className="form-select w-full"
                        >
                            {availableRoles.filter(role => 
                                // Only Super Admin can create/edit Super Admin accounts
                                role !== 'Super Admin' || isCurrentUserSuperAdmin
                            ).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        
                        {editingUser && editingUser.role !== newUser.role && (
                            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={preservePermissions}
                                        onChange={(e) => setPreservePermissions(e.target.checked)}
                                        className="form-checkbox"
                                    />
                                    <span className="text-sm text-yellow-800">
                                        Preserve existing permissions (will be capped to new role's maximum)
                                    </span>
                                </label>
                                <div className="mt-1 text-xs text-yellow-700">
                                    Uncheck to reset all permissions to role defaults
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={newUser.status}
                            onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                            className="form-select w-full"
                        >
                            <option value="Active">Active</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => {
                            setShowAddForm(false);
                            setEditingUser(null);
                            setPreservePermissions(true);
                            setNewUser({ name: '', email: '', role: 'Teacher', status: 'Active', permissions: {} });
                        }}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {editingUser ? 'Update User' : 'Add User'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <PageContainer title="User Management">
            <p className="text-gray-600 mb-6 text-center md:text-left">
                Manage user accounts, roles, and granular permissions for different modules and features.
            </p>

            {view === 'table' ? renderUserTable() : renderPermissionsPanel()}
            
            {showAddForm && renderAddUserForm()}
        </PageContainer>
    );
};
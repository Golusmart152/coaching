const EmployeePage = ({ showMessage, PageContainer, Table }) => {
    const { useState, useEffect } = React;
    const { employees, setEmployees, salaries, setSalaries, instituteDetails } = useData();
    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', role: '', salary: '', password: '', bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' } });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('bankDetails.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                bankDetails: {
                    ...prev.bankDetails,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simple validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
            showMessage('Please fill in all required fields.');
            return;
        }

        if (editingId) {
            const updatedEmployees = employees.map(emp => {
                if (emp.id === editingId) {
                    const updatedEmployee = { ...emp, ...formData };
                    if (!formData.password) {
                        updatedEmployee.password = emp.password; // Keep old password if new one is not provided
                    }
                    return updatedEmployee;
                }
                return emp;
            });
            setEmployees(updatedEmployees);
            showMessage('Employee updated successfully!');
        } else {
            if (!formData.password) {
                showMessage('Password is required for new employees.');
                return;
            }
            const newEmployee = { id: crypto.randomUUID(), ...formData };
            setEmployees([...employees, newEmployee]);
            showMessage('Employee added successfully!');
        }
        setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', role: '', salary: '', password: '', bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' } });
        setEditingId(null);
        setView('master');
    };

    const handleEdit = (employee) => {
        setFormData({ ...employee, password: '' }); // Clear password field for security
        setEditingId(employee.id);
        setView('form');
    };

    const handleDelete = (id) => {
        setEmployees(employees.filter(emp => emp.id !== id));
        showMessage('Employee deleted successfully!');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };

    const filteredEmployees = employees.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(searchTerm);
    });

    const employeeColumns = [{
        header: 'Full Name',
        accessor: 'fullName',
        render: (item) => <button onClick={() => handleViewDetails(item)} className="text-blue-600 hover:underline">{`${item.firstName} ${item.lastName}`}</button>
    }, {
        header: 'Role',
        accessor: 'role'
    }, {
        header: 'Email',
        accessor: 'email'
    }, {
        header: 'Phone',
        accessor: 'phone'
    }, {
        header: 'Salary',
        accessor: 'salary',
        render: (item) => item.salary ? `₹${item.salary}` : 'N/A'
    }, {
        header: 'Actions',
        accessor: 'actions',
        render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-yellow-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600 transition-colors">Delete</button>
            </div>
        )
    }];

    if (view === 'cards') {
        return (
            <PageContainer title="Employee Management">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => setView('form')}
                        className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                        <p className="text-xl font-semibold text-green-800">New Employee Registration</p>
                    </div>
                    <div
                        onClick={() => setView('master')}
                        className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-blue-600 mb-2">{employees.length}</p>
                        <p className="text-xl font-semibold text-blue-800">Employee Master</p>
                    </div>
                     <div
                        onClick={() => setView('salary')}
                        className="bg-purple-100 p-6 rounded-lg shadow-md hover:bg-purple-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-purple-600 mb-2">₹</p>
                        <p className="text-xl font-semibold text-purple-800">Salary Management</p>
                    </div>
                </div>
            </PageContainer>
        );
    } else if (view === 'form') {
        return (
            <PageContainer title="New Employee Registration">
                <button onClick={() => { setView('cards'); setEditingId(null); setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', role: '', salary: '', bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' } }); }} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Employee Home
                </button>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name *" required className="form-input" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name *" required className="form-input" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" required className="form-input" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="form-input" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={editingId ? "New Password (optional)" : "Password *"} required={!editingId} className="form-input" />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="form-input col-span-1 md:col-span-2" />
                    <select name="role" value={formData.role} onChange={handleChange} required className="form-select">
                        <option value="">Select Role *</option>
                        <option value="Admin">Admin</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Data Entry">Data Entry</option>
                    </select>
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary (₹)" className="form-input" />
                    <div className="col-span-1 md:col-span-2 p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Bank Details (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="bankDetails.accountHolderName" value={formData.bankDetails.accountHolderName} onChange={handleChange} placeholder="Account Holder Name" className="form-input" />
                            <input type="text" name="bankDetails.bankName" value={formData.bankDetails.bankName} onChange={handleChange} placeholder="Bank Name" className="form-input" />
                            <input type="text" name="bankDetails.accountNumber" value={formData.bankDetails.accountNumber} onChange={handleChange} placeholder="Account Number" className="form-input" />
                            <input type="text" name="bankDetails.ifscCode" value={formData.bankDetails.ifscCode} onChange={handleChange} placeholder="IFSC Code" className="form-input" />
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            {editingId ? 'Update Employee' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </PageContainer>
        );
    } else if (view === 'master') {
        return (
            <PageContainer title="Employee Master">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Employee Home
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Employee List</h3>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-input w-full md:w-1/3"
                    />
                </div>
                <Table data={filteredEmployees.sort((a,b) => a.firstName.localeCompare(b.firstName))} columns={employeeColumns} />

                {selectedEmployee && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">Employee Profile</h3>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Full Name:</span>
                                    <span>{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Role:</span>
                                    <span>{selectedEmployee.role}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Email:</span>
                                    <span>{selectedEmployee.email}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Phone:</span>
                                    <span>{selectedEmployee.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Address:</span>
                                    <span>{selectedEmployee.address}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Salary:</span>
                                    <span>{selectedEmployee.salary ? `₹${selectedEmployee.salary}` : 'N/A'}</span>
                                </div>
                                {selectedEmployee.bankDetails?.accountNumber && (
                                    <div className="col-span-1 md:col-span-2 mt-4 p-4 border rounded-lg bg-gray-50">
                                        <h4 className="font-bold text-lg mb-2">Bank Details</h4>
                                        <div className="flex flex-col md:flex-row md:space-x-8">
                                            <div>
                                                <p><strong>Account Holder:</strong> {selectedEmployee.bankDetails.accountHolderName}</p>
                                                <p><strong>Bank:</strong> {selectedEmployee.bankDetails.bankName}</p>
                                            </div>
                                            <div>
                                                <p><strong>Account No:</strong> {selectedEmployee.bankDetails.accountNumber}</p>
                                                <p><strong>IFSC Code:</strong> {selectedEmployee.bankDetails.ifscCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 text-right">
                                <button onClick={handleCloseModal} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        );
    } else if (view === 'salary') {
        return (
            <SalaryPage
                employees={employees}
                salaries={salaries}
                setSalaries={setSalaries}
                instituteDetails={instituteDetails}
                showMessage={showMessage}
                PageContainer={PageContainer}
                Table={Table}
            />
        );
    }
};

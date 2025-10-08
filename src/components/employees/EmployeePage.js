const EmployeePage = ({ showMessage, PageContainer, Table }) => {
    const { useState } = React;
    const { employees, setEmployees, salaries, setSalaries, instituteDetails } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'master', 'salary'
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', address: '', role: '',
        salary: '', password: '', bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' }
    });
    const [editingId, setEditingId] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const resetFormData = () => {
        setFormData({
            firstName: '', lastName: '', email: '', phone: '', address: '', role: '',
            salary: '', password: '', bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' }
        });
        setEditingId(null);
    };

    // --- Handlers ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
            showMessage('Please fill in all required fields.');
            return;
        }

        if (editingId) {
            const updatedEmployees = employees.map(emp => {
                if (emp.id === editingId) {
                    const updatedEmployee = { ...emp, ...formData };
                    if (!formData.password) {
                        updatedEmployee.password = emp.password;
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
        resetFormData();
        setView('master');
    };

    const handleEdit = (employee) => {
        setFormData({ ...employee, password: '' });
        setEditingId(employee.id);
        setView('form');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            setEmployees(employees.filter(emp => emp.id !== id));
            showMessage('Employee deleted successfully!');
        }
    };

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    // --- Render Logic ---
    const renderContent = () => {
        switch (view) {
            case 'form':
                return (
                    <EmployeeForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        setView={setView}
                        setEditingId={setEditingId}
                        editingId={editingId}
                    />
                );
            case 'master':
                return (
                    <EmployeeTable
                        employees={employees}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleViewDetails={handleViewDetails}
                        setView={setView}
                    />
                );
            case 'salary':
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
            case 'cards':
            default:
                return (
                    <PageContainer title="Employee Management">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                onClick={() => { resetFormData(); setView('form'); }}
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
        }
    };

    return (
        <>
            {renderContent()}
            {selectedEmployee && (
                <EmployeeDetailsModal
                    employee={selectedEmployee}
                    onClose={() => setSelectedEmployee(null)}
                />
            )}
        </>
    );
};
const EmployeePage = ({ showMessage, PageContainer, Table }) => {
    const { useState } = React;
    const { employees, getNextId, addItem, updateItem, deleteItem, loading } = useData();

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

        const schema = editingId ? employeeSchema.partial() : employeeSchema;
        if (!editingId) {
            schema.required({ password: true });
        }

        try {
            schema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        if (editingId) {
            const employeeToUpdate = { ...formData, id: editingId };
            if (!formData.password) {
                const originalEmployee = employees.find(emp => emp.id === editingId);
                employeeToUpdate.password = originalEmployee.password;
            }
            await updateItem('employees', employeeToUpdate);
            showMessage('Employee updated successfully!');
        } else {
            const nextId = await getNextId('nextEmployeeId');
            const newEmployee = { ...formData, employeeId: nextId };
            await addItem('employees', newEmployee);
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            await deleteItem('employees', id);
            showMessage('Employee deleted successfully!');
        }
    };

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    // --- Render Logic ---
    if (loading) {
        return <PageContainer title="Loading Employees..."><p>Loading data from the database...</p></PageContainer>;
    }

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
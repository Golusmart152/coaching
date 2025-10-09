const EmployeePage = ({ showMessage, PageContainer, Table }) => {
    const { useState } = React;
    const { employees, getNextId, addEmployee, updateEmployee, deleteEmployee, loading } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'master', 'salary'
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // --- Handlers ---
    const handleFormSubmit = async (data) => {
        if (editingEmployee) {
            const employeeToUpdate = { ...data, id: editingEmployee.id };
            if (!data.password) {
                // Keep old password if new one is not provided
                employeeToUpdate.password = editingEmployee.password;
            }
            await updateEmployee(employeeToUpdate);
            showMessage('Employee updated successfully!');
        } else {
            if (!data.password) {
                showMessage('Password is required for new employees.');
                return;
            }
            const nextId = await getNextId('nextEmployeeId');
            const newEmployee = { ...data, employeeId: nextId };
            await addEmployee(newEmployee);
            showMessage('Employee added successfully!');
        }
        setEditingEmployee(null);
        setView('master');
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            await deleteEmployee(id);
            showMessage('Employee deleted successfully!');
        }
    };

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleCancelForm = () => {
        setEditingEmployee(null);
        setView('cards');
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
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                        editingEmployee={editingEmployee}
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
                                onClick={() => { setEditingEmployee(null); setView('form'); }}
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
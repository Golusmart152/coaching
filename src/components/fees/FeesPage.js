const FeesPage = ({ showMessage }) => {
    const { useState } = React;
    const { students, courses, fees, instituteDetails, addFee, updateFee, deleteFee, loading } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'list', 'ledger'
    const [editingFee, setEditingFee] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    // --- Handlers ---
    const handleFormSubmit = async (data) => {
        if (editingFee) {
            await updateFee({ ...data, id: editingFee.id });
            showMessage('Fee record updated successfully!');
        } else {
            await addFee(data);
            showMessage('Fee record added successfully!');
        }
        setEditingFee(null);
        setView('list');
    };

    const handleEdit = (fee) => {
        setEditingFee(fee);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this fee record?')) {
            await deleteFee(id);
            showMessage('Fee record deleted successfully!');
        }
    };

    const handleCancelForm = () => {
        setEditingFee(null);
        setView('cards');
    };

    // --- Render Logic ---
    if (loading) {
        return <PageContainer title="Loading Fees..."><p>Loading data from the database...</p></PageContainer>;
    }

    const renderContent = () => {
        switch (view) {
            case 'form':
                return (
                    <FeeForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                        editingFee={editingFee}
                        students={students}
                        courses={courses}
                        fees={fees}
                    />
                );
            case 'list':
                return (
                    <FeeTable
                        fees={fees}
                        students={students}
                        instituteDetails={instituteDetails}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        setView={setView}
                        showMessage={showMessage}
                    />
                );
            case 'ledger':
                return (
                    <PageContainer title="Student Ledgers">
                        <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                            &larr; Back to Fee Home
                        </button>
                        <select
                            className="form-select mb-6"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="">Select a student to view ledger</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName} ({student.studentId})
                                </option>
                            ))}
                        </select>
                        {selectedStudentId && (
                            <FeeLedger
                                selectedStudentId={selectedStudentId}
                                students={students}
                                courses={courses}
                                fees={fees}
                                setView={setView}
                            />
                        )}
                    </PageContainer>
                );
            case 'cards':
            default:
                return (
                    <PageContainer title="Fee Management">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                onClick={() => { setEditingFee(null); setView('form'); }}
                                className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                            >
                                <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                                <p className="text-xl font-semibold text-green-800">New Fee Record</p>
                            </div>
                            <div
                                onClick={() => setView('list')}
                                className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                            >
                                <p className="text-4xl font-bold text-blue-600 mb-2">{fees.length}</p>
                                <p className="text-xl font-semibold text-blue-800">Fee Records</p>
                            </div>
                             <div
                                onClick={() => setView('ledger')}
                                className="bg-purple-100 p-6 rounded-lg shadow-md hover:bg-purple-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                            >
                                <p className="text-4xl font-bold text-purple-600 mb-2">Ledger</p>
                                <p className="text-xl font-semibold text-purple-800">Student Ledgers</p>
                            </div>
                        </div>
                    </PageContainer>
                );
        }
    };

    return <>{renderContent()}</>;
};
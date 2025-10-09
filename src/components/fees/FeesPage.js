const FeesPage = ({ showMessage }) => {
    const { useState } = React;
    const { students, courses, fees, instituteDetails, addItem, updateItem, deleteItem, loading } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'list', 'ledger'
    const [formData, setFormData] = useState({
        studentId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10),
        paymentType: 'Full', totalFee: '', dueAmount: '', paymentMethod: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const resetFormData = () => {
        setFormData({
            studentId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10),
            paymentType: 'Full', totalFee: '', dueAmount: '', paymentMethod: ''
        });
        setEditingId(null);
    };

    // --- Handlers ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToValidate = {
            ...formData,
            amountPaid: parseFloat(formData.amountPaid) || 0,
            totalFee: parseFloat(formData.totalFee) || 0,
            dueAmount: parseFloat(formData.dueAmount) || 0,
        };

        try {
            feeSchema.parse(dataToValidate);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        if (editingId) {
            await updateItem('fees', { ...dataToValidate, id: editingId });
            showMessage('Fee record updated successfully!');
        } else {
            await addItem('fees', dataToValidate);
            showMessage('Fee record added successfully!');
        }
        resetFormData();
        setView('list');
    };

    const handleEdit = (fee) => {
        setFormData({ ...fee });
        setEditingId(fee.id);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this fee record?')) {
            await deleteItem('fees', id);
            showMessage('Fee record deleted successfully!');
        }
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
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        setView={setView}
                        editingId={editingId}
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
                                onClick={() => { resetFormData(); setView('form'); }}
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
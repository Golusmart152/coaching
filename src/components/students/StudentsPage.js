const StudentsPage = ({ showMessage }) => {
    const { useState, useEffect } = React;
    const { students, courses, getNextId, addItem, updateItem, deleteItem, loading } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'enrolled'
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', course: '', phone: '+91', birthdate: '', age: '',
        email: '', qualification: '', degreeName: '', casteCategory: '', state: '',
        pincode: '', dateOfRegistration: new Date().toISOString().slice(0, 10),
        documentsSubmitted: '', status: 'Active', photoUrl: '', fatherFullName: '',
        motherFullName: '', emergencyContactName: '', emergencyContactPhone: '', bloodGroup: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [nextStudentId, setNextStudentId] = useState(null);

    // Fetch the next student ID when the component mounts
    useEffect(() => {
        const fetchNextId = async () => {
            const id = await getNextId('nextStudentId');
            setNextStudentId(id);
        };
        fetchNextId();
    }, []);

    // Calculate age automatically when birthdate changes
    useEffect(() => {
        if (formData.birthdate) {
            const today = new Date();
            const birthDate = new Date(formData.birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData(prev => ({ ...prev, age: age }));
        }
    }, [formData.birthdate]);

    const resetFormData = () => {
        setFormData({
            firstName: '', lastName: '', course: '', phone: '+91', birthdate: '', age: '',
            email: '', qualification: '', degreeName: '', casteCategory: '', state: '',
            pincode: '', dateOfRegistration: new Date().toISOString().slice(0, 10),
            documentsSubmitted: '', status: 'Active', photoUrl: '', fatherFullName: '',
            motherFullName: '', emergencyContactName: '', emergencyContactPhone: '', bloodGroup: ''
        });
        setEditingId(null);
    };

    // --- Handlers ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            studentSchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        if (editingId) {
            await updateItem('students', { ...formData, id: editingId });
            showMessage('Student updated successfully!');
            setView('enrolled');
            resetFormData();
        } else {
            setShowPreview(true);
        }
    };

    const handleConfirmSave = async () => {
        // Re-validate just in case
        try {
            studentSchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        const newStudent = { ...formData, studentId: nextStudentId };
        await addItem('students', newStudent);
        showMessage('Student added successfully!');
        const newNextId = await getNextId('nextStudentId');
        setNextStudentId(newNextId);
        setShowPreview(false);
        setView('enrolled');
        resetFormData();
    };

    const handleEdit = (student) => {
        setFormData({ ...student });
        setEditingId(student.id);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            await deleteItem('students', id);
            showMessage('Student deleted successfully!');
        }
    };

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
    };

    // --- Render Logic ---
    if (loading) {
        return <PageContainer title="Loading Students..."><p>Loading data from the database...</p></PageContainer>;
    }

    const renderContent = () => {
        switch (view) {
            case 'form':
                return (
                    <StudentForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        setView={setView}
                        setEditingId={setEditingId}
                        editingId={editingId}
                        courses={courses}
                    />
                );
            case 'enrolled':
                return (
                    <StudentTable
                        students={students}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleViewDetails={handleViewDetails}
                        setView={setView}
                    />
                );
            case 'cards':
            default:
                return (
                    <PageContainer title="Student Management">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                onClick={() => { resetFormData(); setView('form'); }}
                                className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                            >
                                <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                                <p className="text-xl font-semibold text-green-800">New Student Registration</p>
                            </div>
                            <div
                                onClick={() => setView('enrolled')}
                                className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                            >
                                <p className="text-4xl font-bold text-blue-600 mb-2">{students.length}</p>
                                <p className="text-xl font-semibold text-blue-800">Enrolled Students</p>
                            </div>
                        </div>
                    </PageContainer>
                );
        }
    };

    return (
        <>
            {renderContent()}
            {selectedStudent && (
                <StudentDetailsModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
            {showPreview && (
                <StudentPreviewModal
                    formData={formData}
                    nextStudentId={nextStudentId}
                    onConfirm={handleConfirmSave}
                    onCancel={() => setShowPreview(false)}
                />
            )}
        </>
    );
};
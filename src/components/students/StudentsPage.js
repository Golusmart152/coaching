const StudentsPage = ({ showMessage }) => {
    const { useState, useEffect } = React;
    const { students, courses, getNextId, addStudent, updateStudent, deleteStudent, loading } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'enrolled'
    const [editingStudent, setEditingStudent] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [nextStudentId, setNextStudentId] = useState(null);

    // Fetch the next student ID when the component mounts
    useEffect(() => {
        const fetchNextId = async () => {
            if (!loading) {
                const id = await getNextId('nextStudentId');
                setNextStudentId(id);
            }
        };
        fetchNextId();
    }, [loading]);

    const handleFormSubmit = async (data) => {
        if (editingStudent) {
            await updateStudent({ ...data, id: editingStudent.id });
            showMessage('Student updated successfully!');
            setEditingStudent(null);
        } else {
            setPreviewData(data);
            setShowPreview(true);
        }
        setView('enrolled');
    };

    const handleConfirmSave = async () => {
        if (!previewData) return;

        const newStudent = { ...previewData, studentId: nextStudentId };
        await addStudent(newStudent);
        showMessage('Student added successfully!');

        const newNextId = await getNextId('nextStudentId');
        setNextStudentId(newNextId);

        setShowPreview(false);
        setPreviewData(null);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            await deleteStudent(id);
            showMessage('Student deleted successfully!');
        }
    };

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
    };

    const handleCancelForm = () => {
        setEditingStudent(null);
        setView('cards');
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
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                        editingStudent={editingStudent}
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
                                onClick={() => { setEditingStudent(null); setView('form'); }}
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
                    formData={previewData}
                    nextStudentId={nextStudentId}
                    onConfirm={handleConfirmSave}
                    onCancel={() => setShowPreview(false)}
                />
            )}
        </>
    );
};
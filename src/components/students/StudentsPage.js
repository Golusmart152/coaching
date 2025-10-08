const StudentsPage = ({ showMessage }) => {
    const { useState, useEffect } = React;
    const { students, setStudents, courses, nextStudentId, setNextStudentId } = useData();

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
            setFormData(prev => ({ ...prev, age }));
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

        // Validation can remain here as it's business logic for this page
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+91\d{10}$/;
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.course || !formData.phone || !formData.email || !formData.birthdate || !formData.state) {
            showMessage('Please fill in all required fields.'); return;
        }
        if (!emailRegex.test(formData.email)) {
            showMessage('Please enter a valid email address.'); return;
        }
        if (!phoneRegex.test(formData.phone)) {
            showMessage('Please enter a valid 10-digit phone number with +91 country code.'); return;
        }

        if (editingId) {
            setStudents(students.map(s => s.id === editingId ? { ...s, ...formData } : s));
            showMessage('Student updated successfully!');
            setView('enrolled');
            resetFormData();
        } else {
            setShowPreview(true);
        }
    };

    const handleConfirmSave = () => {
        const newStudent = { id: crypto.randomUUID(), studentId: nextStudentId, ...formData };
        setStudents([...students, newStudent]);
        setNextStudentId(prev => prev + 1);
        showMessage('Student added successfully!');
        setShowPreview(false);
        setView('enrolled');
        resetFormData();
    };

    const handleEdit = (student) => {
        setFormData({ ...student });
        setEditingId(student.id);
        setView('form');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            setStudents(students.filter(s => s.id !== id));
            showMessage('Student deleted successfully!');
        }
    };

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
    };

    // --- Render Logic ---
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
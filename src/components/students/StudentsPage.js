const StudentsPage = ({ showMessage }) => {
    const { useState, useEffect } = React;
    const { students, setStudents, courses, nextStudentId, setNextStudentId } = useData();
    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        course: '',
        phone: '+91',
        birthdate: '',
        age: '',
        email: '',
        qualification: '',
        degreeName: '',
        casteCategory: '',
        state: '',
        pincode: '',
        dateOfRegistration: new Date().toISOString().slice(0, 10),
        documentsSubmitted: '',
        status: 'Active',
        photoUrl: '',
        fatherFullName: '',
        motherFullName: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        bloodGroup: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation logic
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+91\d{10}$/;
        const pincodeRegex = /^\d{6}$/;
        const contactPhoneRegex = /^\d{10}$/;

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.course || !formData.phone || !formData.email || !formData.birthdate || !formData.state) {
            showMessage('Please fill in all required fields.');
            return;
        }

        if (!emailRegex.test(formData.email)) {
            showMessage('Please enter a valid email address.');
            return;
        }

        if (!phoneRegex.test(formData.phone)) {
            showMessage('Please enter a valid 10-digit phone number with +91 country code.');
            return;
        }

        if (formData.emergencyContactPhone && !contactPhoneRegex.test(formData.emergencyContactPhone)) {
             showMessage('Please enter a valid 10-digit emergency contact phone number.');
            return;
        }

        if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
            showMessage('Please enter a valid 6-digit pincode.');
            return;
        }

        if (editingId) {
            setStudents(students.map(s => s.id === editingId ? { ...s, ...formData } : s));
            showMessage('Student updated successfully!');
            setView('enrolled');
            setEditingId(null);
            setFormData({
                firstName: '',
                lastName: '',
                course: '',
                phone: '+91',
                birthdate: '',
                age: '',
                email: '',
                qualification: '',
                degreeName: '',
                casteCategory: '',
                state: '',
                pincode: '',
                dateOfRegistration: new Date().toISOString().slice(0, 10),
                documentsSubmitted: '',
                status: 'Active',
                photoUrl: '',
                fatherFullName: '',
                motherFullName: '',
                emergencyContactName: '',
                emergencyContactPhone: '',
                bloodGroup: ''
            });
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
        setFormData({
            firstName: '',
            lastName: '',
            course: '',
            phone: '+91',
            birthdate: '',
            age: '',
            email: '',
            qualification: '',
            degreeName: '',
            casteCategory: '',
            state: '',
            pincode: '',
            dateOfRegistration: new Date().toISOString().slice(0, 10),
            documentsSubmitted: '',
            status: 'Active',
            photoUrl: '',
            fatherFullName: '',
            motherFullName: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            bloodGroup: ''
        });
    };

    const handleEdit = (student) => {
        setFormData({ ...student });
        setEditingId(student.id);
        setView('form');
    };

    const handleDelete = (id) => {
        setStudents(students.filter(s => s.id !== id));
        showMessage('Student deleted successfully!');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
    };

    const filteredStudents = students.filter(student => {
        if (!student) return false;
        const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
        return (
            fullName.includes(searchTerm) ||
            (student.studentId && String(student.studentId).toLowerCase().includes(searchTerm))
        );
    });

    const studentColumns = [{
        header: 'Student ID',
        accessor: 'studentId',
        render: (item) => <button onClick={() => handleViewDetails(item)} className="text-blue-600 hover:underline">{item.studentId}</button>
    }, {
        header: 'Full Name',
        accessor: 'fullName',
        render: (item) => <button onClick={() => handleViewDetails(item)} className="text-blue-600 hover:underline">{`${item.firstName} ${item.lastName}`}</button>
    }, {
        header: 'Course',
        accessor: 'course'
    }, {
        header: 'Email',
        accessor: 'email'
    }, {
        header: 'Phone',
        accessor: 'phone'
    }, {
        header: 'Age',
        accessor: 'age'
    }, {
        header: 'Date of Reg.',
        accessor: 'dateOfRegistration'
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
            <PageContainer title="Student Management">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => setView('form')}
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
    } else if (view === 'form') {
        return (
            <PageContainer title="New Student Registration">
                <button onClick={() => { setView('cards'); setEditingId(null); setFormData({
                    firstName: '',
                    lastName: '',
                    course: '',
                    phone: '+91',
                    birthdate: '',
                    age: '',
                    email: '',
                    qualification: '',
                    degreeName: '',
                    casteCategory: '',
                    state: '',
                    pincode: '',
                    dateOfRegistration: new Date().toISOString().slice(0, 10),
                    documentsSubmitted: '',
                    status: 'Active',
                    photoUrl: '',
                    fatherFullName: '',
                    motherFullName: '',
                    emergencyContactName: '',
                    emergencyContactPhone: '',
                    bloodGroup: ''
                }); }} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Student Home
                </button>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">First Name *</span>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Last Name *</span>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Father's Full Name</span>
                        <input type="text" name="fatherFullName" value={formData.fatherFullName} onChange={handleChange} placeholder="Father's Full Name" className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Mother's Full Name</span>
                        <input type="text" name="motherFullName" value={formData.motherFullName} onChange={handleChange} placeholder="Mother's Full Name" className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Email *</span>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Phone Number *</span>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (+91)" className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Date of Birth *</span>
                        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Date of Registration *</span>
                        <input type="date" name="dateOfRegistration" value={formData.dateOfRegistration} onChange={handleChange} required className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Status</span>
                        <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                            <option value="Active">Active</option>
                            <option value="Graduated">Graduated</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Dropped">Dropped</option>
                        </select>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Emergency Contact Name</span>
                        <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Emergency Contact Name" className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Emergency Contact Phone</span>
                        <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} placeholder="10-digit phone number" className="form-input" />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Blood Group</span>
                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-select">
                            <option value="">Select Blood Group</option>
                            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Medical Conditions</span>
                        <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="Allergies, chronic conditions, etc." className="form-textarea"></textarea>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Profile Photo URL</span>
                        <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="URL of student's photo" className="form-input" />
                    </label>
                    <select name="course" value={formData.course} onChange={handleChange} required className="form-select">
                        <option value="">Select Course</option>
                        {courses.sort((a,b) => a.name.localeCompare(b.name)).map(course => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                    <select name="qualification" value={formData.qualification} onChange={handleChange} className="form-select">
                        <option value="">Select Qualification</option>
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                    </select>
                    <input type="text" name="degreeName" value={formData.degreeName} onChange={handleChange} placeholder="Degree Name" className="form-input" />
                    <select name="casteCategory" value={formData.casteCategory} onChange={handleChange} className="form-select">
                        <option value="">Select Caste Category</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                    </select>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="form-input" />
                    <select name="state" value={formData.state} onChange={handleChange} required className="form-select">
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <label className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
                        <span className="text-sm font-medium text-gray-700">Documents Submitted (comma-separated)</span>
                        <textarea name="documentsSubmitted" value={formData.documentsSubmitted} onChange={handleChange} placeholder="e.g., Aadhar Card, Marksheet, Passport Photo" className="form-textarea"></textarea>
                    </label>
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            {editingId ? 'Update Student' : 'Add Student'}
                        </button>
                    </div>
                </form>
                {showPreview && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">Review Details</h3>
                                <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Student ID:</span>
                                    <span>{nextStudentId} (New)</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Full Name:</span>
                                    <span>{`${formData.firstName} ${formData.lastName}`}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Father's Full Name:</span>
                                    <span>{formData.fatherFullName}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Mother's Full Name:</span>
                                    <span>{formData.motherFullName}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Email:</span>
                                    <span>{formData.email}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Phone:</span>
                                    <span>{formData.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Date of Birth:</span>
                                    <span>{formData.birthdate}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Age:</span>
                                    <span>{formData.age} years</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Course:</span>
                                    <span>{formData.course}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">State:</span>
                                    <span>{formData.state}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Pincode:</span>
                                    <span>{formData.pincode}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Qualification:</span>
                                    <span>{formData.qualification}</span>
                                </div>
                                {formData.degreeName && (
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">Degree:</span>
                                        <span>{formData.degreeName}</span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Caste Category:</span>
                                        <span>{formData.casteCategory}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Status:</span>
                                    <span>{formData.status}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Blood Group:</span>
                                    <span>{formData.bloodGroup}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Emergency Contact:</span>
                                    <span>{formData.emergencyContactName} ({formData.emergencyContactPhone})</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Medical Conditions:</span>
                                    <span>{formData.medicalConditions || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <span className="font-semibold text-gray-900">Registration Date:</span>
                                    <span>{formData.dateOfRegistration}</span>
                                </div>
                                 <div className="flex flex-col md:col-span-2">
                                    <span className="font-semibold text-gray-900">Documents Submitted:</span>
                                    <span>{formData.documentsSubmitted}</span>
                                </div>
                            </div>
                            <div className="mt-6 text-right space-x-4">
                                <button onClick={() => setShowPreview(false)} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300">Edit</button>
                                <button onClick={handleConfirmSave} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Confirm & Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        );
    } else if (view === 'enrolled') {
        return (
            <PageContainer title="Enrolled Students">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Student Home
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Student List</h3>
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-input w-full md:w-1/3"
                    />
                </div>
                <Table data={filteredStudents.sort((a,b) => a.firstName.localeCompare(b.firstName))} columns={studentColumns} />

                {selectedStudent && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">Student Profile</h3>
                                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Student ID:</span>
                                    <span>{selectedStudent.studentId}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Full Name:</span>
                                    <span>{`${selectedStudent.firstName} ${selectedStudent.lastName}`}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Father's Full Name:</span>
                                    <span>{selectedStudent.fatherFullName}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Mother's Full Name:</span>
                                    <span>{selectedStudent.motherFullName}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Email:</span>
                                    <span>{selectedStudent.email}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Phone:</span>
                                    <span>{selectedStudent.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Date of Birth:</span>
                                    <span>{selectedStudent.birthdate}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Age:</span>
                                    <span>{selectedStudent.age} years</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Course:</span>
                                    <span>{selectedStudent.course}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">State:</span>
                                    <span>{selectedStudent.state}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Pincode:</span>
                                    <span>{selectedStudent.pincode}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Qualification:</span>
                                    <span>{selectedStudent.qualification}</span>
                                </div>
                                {selectedStudent.degreeName && (
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">Degree:</span>
                                        <span>{selectedStudent.degreeName}</span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Caste Category:</span>
                                    <span>{selectedStudent.casteCategory}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Status:</span>
                                    <span>{selectedStudent.status}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Blood Group:</span>
                                    <span>{selectedStudent.bloodGroup || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Emergency Contact:</span>
                                    <span>{selectedStudent.emergencyContactName} ({selectedStudent.emergencyContactPhone})</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">Medical Conditions:</span>
                                    <span>{selectedStudent.medicalConditions || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col md:col-span-2">
                                    <span className="font-semibold text-gray-900">Registration Date:</span>
                                    <span>{selectedStudent.dateOfRegistration}</span>
                                </div>
                                 <div className="flex flex-col md:col-span-2">
                                    <span className="font-semibold text-gray-900">Documents Submitted:</span>
                                    <span>{selectedStudent.documentsSubmitted}</span>
                                </div>
                            </div>
                            <div className="mt-6 text-right">
                                <button onClick={handleCloseModal} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        );
    }
};

const StudentForm = ({ formData, setFormData, handleSubmit, setView, setEditingId, editingId, courses }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageContainer title={editingId ? "Edit Student" : "New Student Registration"}>
            <button onClick={() => { setView('cards'); setEditingId(null); setFormData({
                firstName: '', lastName: '', course: '', phone: '+91', birthdate: '', age: '',
                email: '', qualification: '', degreeName: '', casteCategory: '', state: '',
                pincode: '', dateOfRegistration: new Date().toISOString().slice(0, 10),
                documentsSubmitted: '', status: 'Active', photoUrl: '', fatherFullName: '',
                motherFullName: '', emergencyContactName: '', emergencyContactPhone: '', bloodGroup: ''
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
        </PageContainer>
    );
};
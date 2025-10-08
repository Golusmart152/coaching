const EnquiryForm = ({ formData, setFormData, handleSubmit, setView, editingId, courses }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageContainer title={editingId ? "Edit Enquiry" : "New Enquiry"}>
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Enquiry Home
            </button>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="form-input" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (+91)" required className="form-input" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-input" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="form-input" />
                <select name="courseEnquired" value={formData.courseEnquired} onChange={handleChange} required className="form-select">
                    <option value="">Select Course Enquired</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                </select>
                <input type="date" name="expectedJoiningDate" value={formData.expectedJoiningDate} onChange={handleChange} placeholder="Expected Joining Date" className="form-input" />
                <select name="status" value={formData.status} onChange={handleChange} required className="form-select">
                    <option value="New">New</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Lost">Lost</option>
                </select>
                {formData.status === 'Lost' && (
                     <input type="text" name="reasonLost" value={formData.reasonLost} onChange={handleChange} placeholder="Reason for losing enquiry" className="form-input" />
                )}
                <textarea name="initialComments" value={formData.initialComments} onChange={handleChange} placeholder="Initial Remarks/Comments" className="form-textarea col-span-1 md:col-span-2"></textarea>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingId ? 'Update Enquiry' : 'Add Enquiry'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
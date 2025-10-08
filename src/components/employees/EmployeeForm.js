const EmployeeForm = ({ formData, setFormData, handleSubmit, setView, setEditingId, editingId }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('bankDetails.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                bankDetails: {
                    ...prev.bankDetails,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <PageContainer title={editingId ? "Edit Employee" : "New Employee Registration"}>
            <button onClick={() => { setView('cards'); setEditingId(null); setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', role: '', salary: '', password: '', bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' } }); }} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Employee Home
            </button>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name *" required className="form-input" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name *" required className="form-input" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" required className="form-input" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="form-input" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={editingId ? "New Password (optional)" : "Password *"} required={!editingId} className="form-input" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="form-input col-span-1 md:col-span-2" />
                <select name="role" value={formData.role} onChange={handleChange} required className="form-select">
                    <option value="">Select Role *</option>
                    <option value="Admin">Admin</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Data Entry">Data Entry</option>
                </select>
                <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary (₹)" className="form-input" />
                <div className="col-span-1 md:col-span-2 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Bank Details (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="bankDetails.accountHolderName" value={formData.bankDetails.accountHolderName} onChange={handleChange} placeholder="Account Holder Name" className="form-input" />
                        <input type="text" name="bankDetails.bankName" value={formData.bankDetails.bankName} onChange={handleChange} placeholder="Bank Name" className="form-input" />
                        <input type="text" name="bankDetails.accountNumber" value={formData.bankDetails.accountNumber} onChange={handleChange} placeholder="Account Number" className="form-input" />
                        <input type="text" name="bankDetails.ifscCode" value={formData.bankDetails.ifscCode} onChange={handleChange} placeholder="IFSC Code" className="form-input" />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingId ? 'Update Employee' : 'Add Employee'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
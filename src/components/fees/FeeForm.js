const FeeForm = ({ formData, setFormData, handleSubmit, setView, editingId, students, courses, fees }) => {
    const handleStudentSelect = (e) => {
        const studentId = e.target.value;
        const student = students.find(s => s.id === studentId);
        if (student) {
            const course = courses.find(c => c.name === student.course);
            const totalFee = course ? parseFloat(course.totalFee) : 0;

            const totalPaid = fees
                .filter(f => f.studentId === student.id)
                .reduce((sum, f) => sum + parseFloat(f.amountPaid), 0);

            const dueAmount = totalFee - totalPaid;

            setFormData(prev => ({
                ...prev,
                studentId: studentId,
                totalFee: totalFee,
                amountPaid: '',
                dueAmount: dueAmount
            }));
        } else {
            setFormData({ studentId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10), paymentType: 'Full', totalFee: '', dueAmount: '', paymentMethod: '' });
        }
    };

    const handleAmountPaidChange = (e) => {
        const amountPaid = parseFloat(e.target.value) || 0;
        const totalFee = parseFloat(formData.totalFee) || 0;
        const dueAmount = totalFee - amountPaid;
        setFormData(prev => ({ ...prev, amountPaid, dueAmount }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageContainer title={editingId ? "Edit Fee Record" : "New Fee Record"}>
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Fee Home
            </button>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <select name="studentId" value={formData.studentId} onChange={handleStudentSelect} required className="form-select">
                    <option value="">Select Student</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>{`${student.firstName} ${student.lastName} (${student.studentId})`}</option>
                    ))}
                </select>
                <input type="number" name="totalFee" value={formData.totalFee} onChange={handleChange} placeholder="Total Fee (₹)" disabled className="form-input bg-gray-200" />
                <select name="paymentType" value={formData.paymentType} onChange={handleChange} required className="form-select">
                    <option value="Full">Full Payment</option>
                    <option value="Partial">Partial Payment</option>
                </select>
                <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleAmountPaidChange} placeholder="Amount Paid (₹)" required={formData.paymentType === 'Partial'} disabled={formData.paymentType === 'Full'} className="form-input" />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
                <input type="number" name="dueAmount" value={formData.dueAmount} onChange={handleChange} placeholder="Due Amount (₹)" disabled className="form-input bg-gray-200" />
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className="form-select">
                    <option value="">Select Payment Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                </select>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="form-input" />
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingId ? 'Update Fee' : 'Add Fee Record'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
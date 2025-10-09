const SalaryPage = ({ showMessage, PageContainer, Table }) => {
    const { useState, useEffect } = React;
    const { employees, salaries, instituteDetails, addItem, deleteItem, loading } = useData();

    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({
        employeeId: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        month: '',
        year: new Date().getFullYear().toString(),
        paymentMethod: 'Cash',
        transactionId: ''
    });
    const [editingId, setEditingId] = useState(null); // Retained for future edit functionality

    const resetFormData = () => {
        setFormData({
            employeeId: '', amount: '', date: new Date().toISOString().slice(0, 10),
            month: '', year: new Date().getFullYear().toString(),
            paymentMethod: 'Cash', transactionId: ''
        });
        setEditingId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmployeeSelect = (e) => {
        const employeeId = e.target.value;
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee && employee.salary) {
            setFormData(prev => ({
                ...prev,
                employeeId: employeeId,
                amount: employee.salary
            }));
        } else {
            resetFormData();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToValidate = {
            ...formData,
            amount: parseFloat(formData.amount) || 0,
        };

        try {
            salarySchema.parse(dataToValidate);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        await addItem('salaries', dataToValidate);
        showMessage('Salary record added successfully!');

        resetFormData();
        setView('list');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this salary record?')) {
            await deleteItem('salaries', id);
            showMessage('Salary record deleted successfully!');
        }
    };

    const generateSalarySlip = (payment) => {
        const employee = employees.find(e => e.id === payment.employeeId);
        if (!employee || !instituteDetails.name) {
            showMessage("Cannot generate slip. Check employee and institute details.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text(instituteDetails.name, 105, 20, null, null, "center");
        doc.setFontSize(12);
        doc.text(instituteDetails.address, 105, 28, null, null, "center");
        doc.text(`Phone: ${instituteDetails.phone} | Email: ${instituteDetails.email}`, 105, 36, null, null, "center");
        doc.line(15, 40, 195, 40);
        doc.setFontSize(16);
        doc.text("Salary Slip", 105, 50, null, null, "center");
        doc.setFontSize(12);
        doc.text(`Slip Generation Date: ${new Date().toLocaleDateString()}`, 15, 65);
        doc.text(`Salary for: ${payment.month} ${payment.year}`, 15, 72);
        doc.text(`Employee Name: ${employee.firstName} ${employee.lastName}`, 15, 85);
        doc.text(`Role: ${employee.role}`, 15, 92);

        doc.autoTable({
            startY: 100,
            head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
            body: [['Basic Salary', `₹${payment.amount}`, 'Taxes', '₹0.00'], ['', '', 'Other', '₹0.00']],
            theme: 'striped',
            headStyles: { fillColor: '#1f2937' },
            columnStyles: { 1: { halign: 'right' }, 3: { halign: 'right' } }
        });

        const finalY = doc.autoTable.previous.finalY;
        doc.setFontSize(14);
        doc.text('Net Salary Paid:', 15, finalY + 10);
        doc.text(`₹${payment.amount}`, 195, finalY + 10, null, null, 'right');

        if (payment.paymentMethod !== 'Cash') {
            doc.text(`Paid via ${payment.paymentMethod} (Ref: ${payment.transactionId})`, 15, finalY + 20);
        }

        doc.line(15, 280, 195, 280);
        doc.text("This is a computer-generated salary slip.", 105, 285, null, null, "center");

        doc.save(`Salary_Slip_${employee.lastName}_${payment.month}.pdf`);
        showMessage('Salary slip generated!');
    };

    const salaryColumns = [
        { header: 'Employee', render: item => { const emp = employees.find(e => e.id === item.employeeId); return emp ? `${emp.firstName} ${emp.lastName}` : 'N/A'; } },
        { header: 'Amount Paid', render: item => `₹${item.amount}` },
        { header: 'For Month', render: item => `${item.month} ${item.year}` },
        { header: 'Payment Date', accessor: 'date' },
        { header: 'Method', accessor: 'paymentMethod' },
        { header: 'Actions', render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => generateSalarySlip(item)} className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-green-600">Slip</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600">Delete</button>
            </div>
        )}
    ];

    if (loading) {
        return <PageContainer title="Loading Salary Data..."><p>Loading...</p></PageContainer>
    }

    if (view === 'form') {
        return (
            <PageContainer title="New Salary Payment">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Salary Home</button>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <select name="employeeId" value={formData.employeeId} onChange={handleEmployeeSelect} required className="form-select">
                        <option value="">Select Employee</option>
                        {employees.map(employee => (<option key={employee.id} value={employee.id}>{`${employee.firstName} ${employee.lastName}`}</option>))}
                    </select>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount (₹)" required className="form-input" />
                    <select name="month" value={formData.month} onChange={handleChange} required className="form-select">
                        <option value="">Select Month</option>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" required className="form-input" />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className="form-select">
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                    </select>
                    {formData.paymentMethod !== 'Cash' && <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} placeholder="Transaction ID" className="form-input" />}
                    <div className="col-span-1 md:col-span-2 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700">Add Payment</button>
                    </div>
                </form>
            </PageContainer>
        );
    }

    if (view === 'list') {
        return (
            <PageContainer title="Salary Records">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">&larr; Back to Salary Home</button>
                <Table data={salaries} columns={salaryColumns} />
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Salary Management">
             <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Employee Home
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => setView('form')} className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 cursor-pointer flex flex-col items-center justify-center text-center">
                    <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                    <p className="text-xl font-semibold text-green-800">New Payment Record</p>
                </div>
                <div onClick={() => setView('list')} className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 cursor-pointer flex flex-col items-center justify-center text-center">
                    <p className="text-4xl font-bold text-blue-600 mb-2">{salaries.length}</p>
                    <p className="text-xl font-semibold text-blue-800">Payment Records</p>
                </div>
            </div>
        </PageContainer>
    );
};
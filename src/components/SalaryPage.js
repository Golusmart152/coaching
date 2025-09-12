const SalaryPage = ({ employees, salaries, setSalaries, instituteDetails, showMessage, PageContainer, Table }) => {
    const { useState, useEffect } = React;
    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({ employeeId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10), paymentType: 'Full', totalSalary: '', dueAmount: '', paymentMethod: 'Cash', transactionId: '' });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmployeeSelect = (e) => {
        const employeeId = e.target.value;
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee && employee.salary) {
            const totalSalary = parseFloat(employee.salary);
            setFormData(prev => ({
                ...prev,
                employeeId: employeeId,
                totalSalary: totalSalary,
                amountPaid: prev.paymentType === 'Full' ? totalSalary : prev.amountPaid,
                dueAmount: prev.paymentType === 'Full' ? 0 : totalSalary - (parseFloat(prev.amountPaid) || 0)
            }));
        } else {
            setFormData({ employeeId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10), paymentType: 'Full', totalSalary: '', dueAmount: '', paymentMethod: 'Cash', transactionId: '' });
        }
    };

    useEffect(() => {
        const total = parseFloat(formData.totalSalary) || 0;
        const paid = parseFloat(formData.amountPaid) || 0;
        setFormData(prev => ({
            ...prev,
            dueAmount: total - paid
        }));
    }, [formData.amountPaid, formData.totalSalary]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.employeeId || !formData.amountPaid || !formData.date || (formData.paymentMethod !== 'Cash' && !formData.transactionId)) {
            showMessage('Please fill in all required fields.');
            return;
        }
        if (editingId) {
            setSalaries(salaries.map(s => s.id === editingId ? { ...s, ...formData } : s));
            showMessage('Salary record updated successfully!');
        } else {
            const newSalary = {
                id: crypto.randomUUID(),
                ...formData,
                amountPaid: parseFloat(formData.amountPaid),
                dueAmount: parseFloat(formData.dueAmount)
            };
            setSalaries([...salaries, newSalary]);
            showMessage('Salary record added successfully!');
        }
        setFormData({ employeeId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10), paymentType: 'Full', totalSalary: '', dueAmount: '', paymentMethod: 'Cash', transactionId: '' });
        setEditingId(null);
        setView('list');
    };

    const handleDelete = (id) => {
        setSalaries(salaries.filter(s => s.id !== id));
        showMessage('Salary record deleted successfully!');
    };

    const generateSalarySlip = (payment) => {
        const employee = employees.find(e => e.id === payment.employeeId);
        if (!employee || !instituteDetails.name) {
            showMessage("Please add institute details first.");
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
        doc.text(`Salary Month: ${new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' })}`, 15, 72);

        doc.text(`Employee Name: ${employee.firstName} ${employee.lastName}`, 15, 85);
        doc.text(`Role: ${employee.role}`, 15, 92);

        doc.autoTable({
            startY: 100,
            head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
            body: [
                ['Basic Salary', `₹${payment.totalSalary}`, 'Taxes', '₹0.00'],
                ['', '', 'Other', '₹0.00'],
            ],
            theme: 'striped',
            headStyles: { fillColor: '#1f2937' },
            columnStyles: { 1: { halign: 'right' }, 3: { halign: 'right' } }
        });

        const finalY = doc.autoTable.previous.finalY;
        doc.setFontSize(14);
        doc.text('Net Salary Paid:', 15, finalY + 10);
        doc.text(`₹${payment.amountPaid}`, 195, finalY + 10, null, null, 'right');

        if (payment.paymentMethod !== 'Cash') {
            doc.setFontSize(10);
            doc.text(`Paid via ${payment.paymentMethod} (Ref: ${payment.transactionId})`, 15, finalY + 20);
        }

        doc.line(15, 280, 195, 280);
        doc.text("This is a computer-generated salary slip and does not require a signature.", 105, 285, null, null, "center");

        doc.save(`Salary_Slip_${employee.lastName}_${new Date(payment.date).getMonth() + 1}.pdf`);
        showMessage('Salary slip generated!');
    };

    const salaryColumns = [{
        header: 'Employee Name',
        accessor: 'employeeId',
        render: (item) => {
            const employee = employees.find(emp => emp.id === item.employeeId);
            return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';
        }
    }, {
        header: 'Total Salary',
        accessor: 'totalSalary',
        render: (item) => `₹${item.totalSalary}`
    }, {
        header: 'Amount Paid',
        accessor: 'amountPaid',
        render: (item) => `₹${item.amountPaid}`
    }, {
        header: 'Due Amount',
        accessor: 'dueAmount',
        render: (item) => `₹${item.dueAmount}`
    }, {
        header: 'Payment Method',
        accessor: 'paymentMethod'
    }, {
        header: 'Transaction ID',
        accessor: 'transactionId'
    }, {
        header: 'Date',
        accessor: 'date'
    }, {
        header: 'Actions',
        accessor: 'actions',
        render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => generateSalarySlip(item)} className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-green-600 transition-colors">Slip</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600 transition-colors">Delete</button>
            </div>
        )
    }];

    if (view === 'cards') {
        return (
            <PageContainer title="Salary Management">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => setView('form')}
                        className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                        <p className="text-xl font-semibold text-green-800">New Payment Record</p>
                    </div>
                    <div
                        onClick={() => setView('list')}
                        className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-blue-600 mb-2">{salaries.length}</p>
                        <p className="text-xl font-semibold text-blue-800">Payment Records</p>
                    </div>
                </div>
            </PageContainer>
        );
    } else if (view === 'form') {
        return (
            <PageContainer title="New Salary Payment">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Salary Home
                </button>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <select name="employeeId" value={formData.employeeId} onChange={handleEmployeeSelect} required className="form-select">
                        <option value="">Select Employee</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>{`${employee.firstName} ${employee.lastName}`}</option>
                        ))}
                    </select>
                    <input type="number" name="totalSalary" value={formData.totalSalary} onChange={handleChange} placeholder="Total Salary (₹)" disabled className="form-input bg-gray-200" />
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className="form-select">
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                    </select>
                    {formData.paymentMethod !== 'Cash' && (
                        <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} placeholder="Transaction ID (optional)" className="form-input" />
                    )}
                    <select name="paymentType" value={formData.paymentType} onChange={handleChange} required className="form-select">
                        <option value="Full">Full Payment</option>
                        <option value="Partial">Partial Payment</option>
                    </select>
                    <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} placeholder="Amount Paid (₹)" required={formData.paymentType === 'Partial'} disabled={formData.paymentType === 'Full'} className="form-input" />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
                    <input type="number" name="dueAmount" value={formData.dueAmount} onChange={handleChange} placeholder="Due Amount (₹)" disabled className="form-input bg-gray-200" />
                    <div className="col-span-1 md:col-span-2 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            {editingId ? 'Update Salary' : 'Add Payment Record'}
                        </button>
                    </div>
                </form>
            </PageContainer>
        );
    } else if (view === 'list') {
        return (
            <PageContainer title="Salary Records">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Salary Home
                </button>
                <h3 className="text-xl font-semibold mb-2">Salary Records</h3>
                <Table data={salaries} columns={salaryColumns} />
            </PageContainer>
        );
    }
};

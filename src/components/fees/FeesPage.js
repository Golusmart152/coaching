const FeesPage = ({ showMessage }) => {
    const { useState } = React;
    const { students, courses, fees, setFees, instituteDetails } = useData();
    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({
        studentId: '',
        amountPaid: '',
        date: new Date().toISOString().slice(0, 10),
        paymentType: 'Full',
        totalFee: '',
        dueAmount: '',
        paymentMethod: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentSelect = (e) => {
        const studentId = e.target.value;
        const student = students.find(s => s.id === studentId);
        if (student) {
            const course = courses.find(c => c.name === student.course);
            const totalFee = course ? parseFloat(course.totalFee) : 0;

            // Calculate total paid from all past transactions for this student
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.studentId || !formData.amountPaid || !formData.date) {
            showMessage('Please fill in all required fields.');
            return;
        }
        if (editingId) {
            setFees(fees.map(f => f.id === editingId ? { ...f, ...formData } : f));
            showMessage('Fee record updated successfully!');
        } else {
            const newFee = {
                id: crypto.randomUUID(),
                ...formData,
                amountPaid: parseFloat(formData.amountPaid),
                dueAmount: parseFloat(formData.dueAmount)
            };
            setFees([...fees, newFee]);
            showMessage('Fee record added successfully!');
        }
        setFormData({ studentId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10), paymentType: 'Full', totalFee: '', dueAmount: '', paymentMethod: '' });
        setEditingId(null);
    };

    const handleEdit = (fee) => {
        setFormData({ ...fee });
        setEditingId(fee.id);
        setView('form');
    };

    const handleDelete = (id) => {
        setFees(fees.filter(f => f.id !== id));
        showMessage('Fee record deleted successfully!');
    };

    const generateReceipt = (fee) => {
        const student = students.find(s => s.id === fee.studentId);
        if (!student || !instituteDetails.name) {
            showMessage("Please add institute details first.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text(instituteDetails.name, 105, 20, null, null, "center");
        doc.setFontSize(12);
        doc.text(instituteDetails.address, 105, 28, null, null, "center");
        doc.text(`Phone: ${instituteDetails.phone} | Email: ${instituteDetails.email}`, 105, 36, null, null, "center");

        // Title
        doc.setFontSize(18);
        doc.text("Fee Receipt", 105, 50, null, null, "center");
        doc.setFontSize(12);

        // Student Info
        doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 15, 65);
        doc.text(`Student ID: ${student.studentId}`, 15, 75);
        doc.text(`Student Name: ${student.firstName} ${student.lastName}`, 15, 85);
        doc.text(`Course: ${student.course}`, 15, 95);

        // Payment Details
        doc.autoTable({
            startY: 110,
            head: [['Description', 'Amount']],
            body: [
                ['Total Course Fee', `₹${fee.totalFee}`],
                ['Amount Paid', `₹${fee.amountPaid}`],
                ['Due Amount', `₹${fee.dueAmount}`],
            ],
            theme: 'striped',
            headStyles: { fillColor: '#1f2937' },
            columnStyles: {
                1: { halign: 'right' }
            }
        });

        // Footer
        doc.text("Thank you for your payment!", 105, doc.autoTable.previous.finalY + 15, null, null, "center");

        doc.save(`Fee_Receipt_${student.studentId}.pdf`);
        showMessage('Fee receipt generated!');
    };

    const feeColumns = [{
        header: 'Student ID',
        accessor: 'studentId',
        render: (item) => students.find(s => s.id === item.studentId)?.studentId || 'N/A'
    }, {
        header: 'Student Name',
        accessor: 'studentId',
        render: (item) => {
            const student = students.find(s => s.id === item.studentId);
            return student ? `${student.firstName} ${student.lastName}` : 'N/A';
        }
    }, {
        header: 'Total Fee',
        accessor: 'totalFee',
        render: (item) => `₹${item.totalFee}`
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
        header: 'Date',
        accessor: 'date'
    }, {
        header: 'Actions',
        accessor: 'actions',
        render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-yellow-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600 transition-colors">Delete</button>
                <button onClick={() => generateReceipt(item)} className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-blue-600 transition-colors">Receipt</button>
            </div>
        )
    }];

    const FeeLedgerPage = () => {
        const studentFees = fees.filter(f => f.studentId === selectedStudentId);
        const student = students.find(s => s.id === selectedStudentId);

        const totalPaid = studentFees.reduce((sum, f) => sum + parseFloat(f.amountPaid), 0);
        const course = courses.find(c => c.name === student?.course);
        const totalFee = course ? parseFloat(course.totalFee) : 0;
        const dueAmount = totalFee - totalPaid;

        const feeLedgerColumns = [{
            header: 'Date',
            accessor: 'date'
        }, {
            header: 'Amount Paid',
            accessor: 'amountPaid',
            render: (item) => `₹${item.amountPaid}`
        }, {
            header: 'Payment Type',
            accessor: 'paymentType'
        }, {
            header: 'Payment Method',
            accessor: 'paymentMethod'
        }];

        return (
            <PageContainer title="Student Fee Ledger">
                 <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Fee Home
                </button>
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-6">
                    <h3 className="text-xl font-semibold mb-2">{student?.firstName} {student?.lastName} - {student?.course}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-semibold">
                        <p>Total Fee: <span className="text-gray-700 font-normal">₹{totalFee}</span></p>
                        <p>Total Paid: <span className="text-gray-700 font-normal">₹{totalPaid}</span></p>
                        <p>Due Amount: <span className="text-red-500 font-normal">₹{dueAmount}</span></p>
                    </div>
                </div>
                <Table data={studentFees} columns={feeLedgerColumns} />
            </PageContainer>
        )
    }

    if (view === 'cards') {
        return (
            <PageContainer title="Fee Management">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        onClick={() => setView('form')}
                        className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                        <p className="text-xl font-semibold text-green-800">New Fee Record</p>
                    </div>
                    <div
                        onClick={() => setView('list')}
                        className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-blue-600 mb-2">{fees.length}</p>
                        <p className="text-xl font-semibold text-blue-800">Fee Records</p>
                    </div>
                     <div
                        onClick={() => setView('ledger')}
                        className="bg-purple-100 p-6 rounded-lg shadow-md hover:bg-purple-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-purple-600 mb-2">Ledger</p>
                        <p className="text-xl font-semibold text-purple-800">Student Ledgers</p>
                    </div>
                </div>
            </PageContainer>
        );
    } else if (view === 'form') {
        return (
            <PageContainer title="New Fee Record">
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
    } else if (view === 'list') {
        return (
            <PageContainer title="Fee Records">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Fee Home
                </button>
                <h3 className="text-xl font-semibold mb-2">Fee Records</h3>
                <Table data={fees} columns={feeColumns} />
            </PageContainer>
        );
    } else if (view === 'ledger') {
        return (
            <PageContainer title="Student Ledgers">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Fee Home
                </button>
                <select
                    className="form-select mb-6"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                    <option value="">Select a student to view ledger</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>
                            {student.firstName} {student.lastName} ({student.studentId})
                        </option>
                    ))}
                </select>
                {selectedStudentId && <FeeLedgerPage />}
            </PageContainer>
        )
    }
};

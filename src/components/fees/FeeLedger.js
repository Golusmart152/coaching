const FeeLedger = ({ selectedStudentId, students, courses, fees, setView }) => {
    const studentFees = fees.filter(f => f.studentId === selectedStudentId);
    const student = students.find(s => s.id === selectedStudentId);

    if (!student) {
        return (
            <PageContainer title="Student Fee Ledger">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Fee Home
                </button>
                <p>Please select a student to view their ledger.</p>
            </PageContainer>
        );
    }

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
    );
};
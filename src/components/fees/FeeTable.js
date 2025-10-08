const FeeTable = ({ fees, students, instituteDetails, handleEdit, handleDelete, setView, showMessage }) => {
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

    return (
        <PageContainer title="Fee Records">
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Fee Home
            </button>
            <h3 className="text-xl font-semibold mb-2">Fee Records</h3>
            <Table data={fees} columns={feeColumns} />
        </PageContainer>
    );
};
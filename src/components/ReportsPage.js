const ReportsPage = ({ showMessage }) => {
    const { useState } = React;
    const { students, fees, results, courses, enquiries, employees } = useData();
    const [reportType, setReportType] = useState('students');

    const generateCsv = (data, filename) => {
        if (data.length === 0) {
            showMessage('No data to export.');
            return;
        }
        const headers = Object.keys(data[0]).join(',');
        const csvContent = data.map(row =>
            Object.values(row).map(value =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(',')
        ).join('\n');

        const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage(`${filename} exported to CSV!`);
    };

    const generatePdf = (title, content, filename) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text(title, 10, 15);
        let y = 30;
        doc.setFontSize(12);

        const printSection = (sectionTitle, data, columns) => {
            doc.text(sectionTitle, 10, y);
            y += 8;
            if (data.length === 0) {
                doc.text("No data available.", 15, y);
                y += 10;
                return;
            }

            doc.autoTable({
                head: [columns.map(col => col.header)],
                body: data.map(item => columns.map(col => String(col.render ? col.render(item) : item[col.accessor]))),
                startY: y,
                theme: 'striped',
                headStyles: { fillColor: '#1f2937' }
            });
            y = doc.autoTable.previous.finalY + 10;
        };

        content.forEach(section => {
            if (y > 270) {
                doc.addPage();
                y = 15;
            }
            printSection(section.title, section.data, section.columns);
        });

        doc.save(filename);
        showMessage(`${filename} generated!`);
    };

    const getReportData = () => {
        switch (reportType) {
            case 'students':
                const studentData = students.map(s => ({
                    'studentId': s.studentId,
                    'fullName': `${s.firstName} ${s.lastName}`,
                    'email': s.email,
                    'phone': s.phone,
                    'birthdate': s.birthdate,
                    'age': s.age,
                    'course': s.course,
                    'qualification': s.qualification,
                    'degreeName': s.degreeName,
                    'casteCategory': s.casteCategory,
                    'state': s.state,
                    'pincode': s.pincode,
                }));
                return {
                    data: studentData,
                    columns: [
                        { header: 'Student ID', accessor: 'studentId' },
                        { header: 'Full Name', accessor: 'fullName' },
                        { header: 'Course', accessor: 'course' },
                        { header: 'Email', accessor: 'email' },
                        { header: 'Phone', accessor: 'phone' },
                        { header: 'Age', accessor: 'age' },
                        { header: 'State', accessor: 'state' },
                        { header: 'Pincode', accessor: 'pincode' }
                    ]
                };
            case 'fees':
                const feeData = fees.map(f => {
                    const student = students.find(s => s.id === f.studentId);
                    return {
                        'studentId': student?.studentId,
                        'studentName': `${student?.firstName} ${student?.lastName}`,
                        'amountPaid': f.amountPaid,
                        'dueAmount': f.dueAmount,
                        'date': f.date
                    };
                });
                return {
                    data: feeData,
                    columns: [
                        { header: 'Student ID', accessor: 'studentId' },
                        { header: 'Student Name', accessor: 'studentName' },
                        { header: 'Amount Paid', accessor: 'amountPaid', render: item => `₹${item.amountPaid}` },
                        { header: 'Due Amount', accessor: 'dueAmount', render: item => `₹${item.dueAmount}` },
                        { header: 'Date', accessor: 'date' }
                    ]
                };
            case 'exams':
                const examData = results.map(r => {
                    const student = students.find(s => s.id === r.studentId);
                    const exam = exams.find(e => e.id === r.examId);
                    return {
                        'studentId': student?.studentId,
                        'studentName': `${student?.firstName} ${student?.lastName}`,
                        'examName': exam?.subjectName || 'N/A',
                        'score': r.score,
                        'date': exam?.date || 'N/A'
                    };
                });
                return {
                    data: examData,
                    columns: [
                        { header: 'Student ID', accessor: 'studentId' },
                        { header: 'Student Name', accessor: 'studentName' },
                        { header: 'Exam Name', accessor: 'examName' },
                        { header: 'Score', accessor: 'score', render: item => `${item.score}%` },
                        { header: 'Date', accessor: 'date' }
                    ]
                };
            case 'courses':
                const courseData = courses.map(c => ({
                    'name': c.name,
                    'description': c.description,
                    'duration': c.duration,
                    'totalFee': c.totalFee
                }));
                return {
                    data: courseData,
                    columns: [
                        { header: 'Name', accessor: 'name' },
                        { header: 'Description', accessor: 'description' },
                        { header: 'Duration', accessor: 'duration' },
                        { header: 'Total Fee', accessor: 'totalFee', render: item => `₹${item.totalFee}` }
                    ]
                };
            case 'enquiries':
                const enquiryData = enquiries.map(e => ({
                    'name': e.name,
                    'phone': e.phone,
                    'courseEnquired': e.courseEnquired,
                    'expectedJoining': e.expectedJoiningDate,
                    'initialComments': e.initialComments,
                    'followUps': e.followUps.length > 0 ? e.followUps.map(f => `${f.date}: ${f.remark}`).join(' | ') : 'N/A'
                }));
                return {
                    data: enquiryData,
                    columns: [
                        { header: 'Name', accessor: 'name' },
                        { header: 'Phone', accessor: 'phone' },
                        { header: 'Course Enquired', accessor: 'courseEnquired' },
                        { header: 'Expected Joining', accessor: 'expectedJoining' },
                        { header: 'Initial Comments', accessor: 'initialComments' },
                        { header: 'Follow-ups', accessor: 'followUps' }
                    ]
                };
            case 'employees':
                const employeeData = employees.map(e => ({
                    'employeeId': e.employeeId,
                    'fullName': `${e.firstName} ${e.lastName}`,
                    'role': e.role,
                    'email': e.email,
                    'phone': e.phone,
                    'dateOfJoining': e.dateOfJoining,
                    'extraInfo': e.role === 'Teacher' ? e.subjects : e.designation,
                }));
                return {
                    data: employeeData,
                    columns: [
                        { header: 'Employee ID', accessor: 'employeeId' },
                        { header: 'Full Name', accessor: 'fullName' },
                        { header: 'Role', accessor: 'role' },
                        { header: 'Extra Info', accessor: 'extraInfo' },
                        { header: 'Date of Joining', accessor: 'dateOfJoining' }
                    ]
                };
            case 'certificates':
                const certificateData = students.map(s => ({
                    'studentId': s.studentId,
                    'fullName': `${s.firstName} ${s.lastName}`,
                    'course': s.course
                }));
                return {
                    data: certificateData,
                    columns: [
                        { header: 'Student ID', accessor: 'studentId' },
                        { header: 'Full Name', accessor: 'fullName' },
                        { header: 'Course', accessor: 'course' }
                    ]
                };
            default:
                return { data: [], columns: [] };
        }
    };

    const currentReportData = getReportData();

    return (
        <PageContainer title="Reports">
            <div className="flex flex-col md:flex-row md:justify-center gap-4 mb-8">
                <button
                    onClick={() => setReportType('students')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        reportType === 'students' ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Student Report
                </button>
                <button
                    onClick={() => setReportType('fees')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        reportType === 'fees' ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Fee Report
                </button>
                <button
                    onClick={() => setReportType('exams')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        reportType === 'exams' ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Exam Report
                </button>
                <button
                    onClick={() => setReportType('courses')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        reportType === 'courses' ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Course Report
                </button>
                <button
                    onClick={() => setReportType('enquiries')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        reportType === 'enquiries' ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Enquiry Report
                </button>
                 <button
                    onClick={() => setReportType('employees')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        reportType === 'employees' ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Employee Report
                </button>
                 <button
                    onClick={() => setReportType('certificates')}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        reportType === 'certificates' ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    Certificate Report
                </button>
            </div>

            <div className="flex justify-center md:justify-start gap-4 mb-6">
                <button
                    onClick={() => generateCsv(currentReportData.data, `${reportType}_report.csv`)}
                    className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                >
                    Export as CSV
                </button>
                <button
                    onClick={() => generatePdf(
                        `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
                        [{
                            title: `List of ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`,
                            data: currentReportData.data,
                            columns: currentReportData.columns
                        }],
                        `${reportType}_report.pdf`
                    )}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                >
                    Download as PDF
                </button>
            </div>
            <h3 className="text-xl font-semibold mb-2">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Preview</h3>
            <Table data={currentReportData.data} columns={currentReportData.columns} />
        </PageContainer>
    );
};

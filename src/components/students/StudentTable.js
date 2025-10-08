const StudentTable = ({ students, handleEdit, handleDelete, handleViewDetails, setView }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredStudents = students.filter(student => {
        if (!student) return false;
        const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
        return (
            fullName.includes(searchTerm) ||
            (student.studentId && String(student.studentId).toLowerCase().includes(searchTerm))
        );
    });

    const studentColumns = [{
        header: 'Student ID',
        accessor: 'studentId',
        render: (item) => <button onClick={() => handleViewDetails(item)} className="text-blue-600 hover:underline">{item.studentId}</button>
    }, {
        header: 'Full Name',
        accessor: 'fullName',
        render: (item) => <button onClick={() => handleViewDetails(item)} className="text-blue-600 hover:underline">{`${item.firstName} ${item.lastName}`}</button>
    }, {
        header: 'Course',
        accessor: 'course'
    }, {
        header: 'Email',
        accessor: 'email'
    }, {
        header: 'Phone',
        accessor: 'phone'
    }, {
        header: 'Age',
        accessor: 'age'
    }, {
        header: 'Date of Reg.',
        accessor: 'dateOfRegistration'
    }, {
        header: 'Actions',
        accessor: 'actions',
        render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-yellow-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600 transition-colors">Delete</button>
            </div>
        )
    }];

    return (
        <PageContainer title="Enrolled Students">
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Student Home
            </button>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Student List</h3>
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-input w-full md:w-1/3"
                />
            </div>
            <Table data={filteredStudents.sort((a,b) => a.firstName.localeCompare(b.firstName))} columns={studentColumns} />
        </PageContainer>
    );
};
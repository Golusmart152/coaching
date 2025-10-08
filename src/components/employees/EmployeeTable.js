const EmployeeTable = ({ employees, handleEdit, handleDelete, handleViewDetails, setView }) => {
    const { useState } = React;
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredEmployees = employees.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return fullName.includes(searchTerm);
    });

    const employeeColumns = [{
        header: 'Full Name',
        accessor: 'fullName',
        render: (item) => <button onClick={() => handleViewDetails(item)} className="text-blue-600 hover:underline">{`${item.firstName} ${item.lastName}`}</button>
    }, {
        header: 'Role',
        accessor: 'role'
    }, {
        header: 'Email',
        accessor: 'email'
    }, {
        header: 'Phone',
        accessor: 'phone'
    }, {
        header: 'Salary',
        accessor: 'salary',
        render: (item) => item.salary ? `₹${item.salary}` : 'N/A'
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
        <PageContainer title="Employee Master">
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Employee Home
            </button>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Employee List</h3>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-input w-full md:w-1/3"
                />
            </div>
            <Table data={filteredEmployees.sort((a,b) => a.firstName.localeCompare(b.firstName))} columns={employeeColumns} />
        </PageContainer>
    );
};
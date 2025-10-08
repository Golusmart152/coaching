const CourseTable = ({ courses, handleEdit, handleDelete, setView }) => {
    const courseColumns = [{
        header: 'Name',
        accessor: 'name'
    }, {
        header: 'Description',
        accessor: 'description'
    }, {
        header: 'Duration',
        accessor: 'duration'
    }, {
        header: 'Lectures',
        accessor: 'numberOfLectures'
    }, {
        header: 'Hours',
        accessor: 'numberOfHours'
    }, {
        header: 'Total Fee',
        accessor: 'totalFee',
        render: (item) => `₹${item.totalFee}`
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
        <PageContainer title="All Courses">
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Course Home
            </button>
            <h3 className="text-xl font-semibold mb-2">Available Courses</h3>
            <Table data={courses.sort((a,b) => a.name.localeCompare(b.name))} columns={courseColumns} />
        </PageContainer>
    );
};
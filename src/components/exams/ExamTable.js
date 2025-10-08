const ExamTable = ({ exams, handleEditExam, handleDeleteExam }) => {
    const examColumns = [{
        header: 'Exam ID',
        accessor: 'id'
    }, {
        header: 'Subject',
        accessor: 'subjectName'
    }, {
        header: 'Topic',
        accessor: 'topic'
    }, {
        header: 'Date',
        accessor: 'date'
    }, {
        header: 'Location',
        accessor: 'location'
    }, {
        header: 'Actions',
        accessor: 'actions',
        render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => handleEditExam(item)} className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-yellow-600 transition-colors">Edit</button>
                <button onClick={() => handleDeleteExam(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600 transition-colors">Delete</button>
            </div>
        )
    }];

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Exam List</h3>
            <Table data={exams} columns={examColumns} />
        </div>
    );
};
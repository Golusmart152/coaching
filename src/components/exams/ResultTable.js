const ResultTable = ({ results, students }) => {
    const resultColumns = [{
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
        header: 'Exam ID',
        accessor: 'examId'
    }, {
        header: 'Score',
        accessor: 'score',
        render: (item) => `${item.score}%`
    }];

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2 mt-8">Results Records</h3>
            <Table data={results.sort((a,b) => b.examId - a.examId)} columns={resultColumns} />
        </div>
    );
};
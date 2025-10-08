const ExamsPage = ({ showMessage }) => {
    const { useState } = React;
    const { students, exams, setExams, results, setResults, nextExamId, setNextExamId } = useData();
    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({
        subjectName: '',
        topic: '',
        duration: '', // In hours
        date: '',
        time: '',
        location: ''
    });
    const [resultFormData, setResultFormData] = useState({ studentId: '', examId: '', score: '' });
    const [selectedExamId, setSelectedExamId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResultChange = (e) => {
        const { name, value } = e.target;
        setResultFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleExamSubmit = (e) => {
        e.preventDefault();
        if (!formData.subjectName || !formData.topic || !formData.duration || !formData.date || !formData.time || !formData.location) {
            showMessage('Please fill in all exam details.');
            return;
        }
        const newExam = {
            id: nextExamId,
            ...formData,
        };
        setExams([...exams, newExam]);
        setNextExamId(prev => prev + 1);
        showMessage('Exam created successfully!');
        setFormData({
            subjectName: '',
            topic: '',
            duration: '',
            date: '',
            time: '',
            location: ''
        });
    };

    const handleResultSubmit = (e) => {
        e.preventDefault();
        if (!resultFormData.studentId || !resultFormData.examId || !resultFormData.score) {
            showMessage('Please fill in all result details.');
            return;
        }
        const newResult = {
            id: crypto.randomUUID(),
            studentId: resultFormData.studentId,
            examId: resultFormData.examId,
            score: resultFormData.score
        };
        setResults([...results, newResult]);
        showMessage('Result added successfully!');
        setResultFormData({ studentId: '', examId: '', score: '' });
    };

    const handleEditExam = (exam) => {
        showMessage('Edit exam functionality coming soon!');
    };

    const handleDeleteExam = (id) => {
        setExams(exams.filter(e => e.id !== id));
        setResults(results.filter(r => r.examId !== id)); // Delete associated results
        showMessage('Exam and its results deleted successfully!');
    };

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

    if (view === 'cards') {
        return (
            <PageContainer title="Exam & Results Management">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => setView('createExam')}
                        className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                        <p className="text-xl font-semibold text-green-800">Create New Exam</p>
                    </div>
                    <div
                        onClick={() => setView('allExams')}
                        className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-blue-600 mb-2">{exams.length}</p>
                        <p className="text-xl font-semibold text-blue-800">All Exams & Results</p>
                    </div>
                </div>
            </PageContainer>
        );
    } else if (view === 'createExam') {
        return (
            <PageContainer title="Create New Exam">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Exam Home
                </button>
                <form onSubmit={handleExamSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="subjectName" value={formData.subjectName} onChange={handleChange} placeholder="Subject Name" required className="form-input" />
                    <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="Topic" required className="form-input" />
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (in hours)" required className="form-input" />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required className="form-input" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="form-input" />
                    <div className="col-span-1 md:col-span-2 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Create Exam</button>
                    </div>
                </form>
            </PageContainer>
        );
    } else if (view === 'allExams') {
        return (
            <PageContainer title="All Exams & Results">
                 <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Exam Home
                </button>
                <h3 className="text-xl font-semibold mb-2">Exam List</h3>
                <Table data={exams} columns={examColumns} />
                <h3 className="text-xl font-semibold mb-2 mt-8">Add Results</h3>
                <form onSubmit={handleResultSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <select name="examId" value={resultFormData.examId} onChange={handleResultChange} required className="form-select">
                        <option value="">Select Exam</option>
                        {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{`${exam.subjectName} - ${exam.topic} (${exam.date})`}</option>
                        ))}
                    </select>
                    <select name="studentId" value={resultFormData.studentId} onChange={handleResultChange} required className="form-select">
                        <option value="">Select Student</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{`${student.firstName} ${student.lastName} (${student.studentId})`}</option>
                        ))}
                    </select>
                    <input type="number" name="score" value={resultFormData.score} onChange={handleResultChange} placeholder="Score (%)" min="0" max="100" required className="form-input" />
                    <div className="col-span-1 md:col-span-3 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Add Result</button>
                    </div>
                </form>
                <h3 className="text-xl font-semibold mb-2 mt-8">Results Records</h3>
                <Table data={results.sort((a,b) => b.examId - a.examId)} columns={resultColumns} />
            </PageContainer>
        );
    }
};

const ExamsPage = ({ showMessage }) => {
    const { useState } = React;
    const { students, exams, setExams, results, setResults, nextExamId, setNextExamId } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'createExam', 'allExams'
    const [examFormData, setExamFormData] = useState({
        subjectName: '', topic: '', duration: '', date: '', time: '', location: ''
    });
    const [resultFormData, setResultFormData] = useState({ studentId: '', examId: '', score: '' });

    const resetExamFormData = () => {
        setExamFormData({
            subjectName: '', topic: '', duration: '', date: '', time: '', location: ''
        });
    };

    // --- Handlers ---
    const handleExamSubmit = (e) => {
        e.preventDefault();
        if (!examFormData.subjectName || !examFormData.topic || !examFormData.duration || !examFormData.date || !examFormData.time || !examFormData.location) {
            showMessage('Please fill in all exam details.');
            return;
        }
        const newExam = { id: nextExamId, ...examFormData };
        setExams([...exams, newExam]);
        setNextExamId(prev => prev + 1);
        showMessage('Exam created successfully!');
        resetExamFormData();
        setView('allExams');
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
        // In a real implementation, you would likely set the form data and switch to the form view:
        // setExamFormData(exam);
        // setView('createExam');
    };

    const handleDeleteExam = (id) => {
        if (window.confirm('Are you sure you want to delete this exam and all its results?')) {
            setExams(exams.filter(e => e.id !== id));
            setResults(results.filter(r => r.examId !== id));
            showMessage('Exam and its results deleted successfully!');
        }
    };

    // --- Render Logic ---
    const renderContent = () => {
        switch (view) {
            case 'createExam':
                return (
                    <ExamForm
                        formData={examFormData}
                        setFormData={setExamFormData}
                        handleSubmit={handleExamSubmit}
                        setView={setView}
                    />
                );
            case 'allExams':
                return (
                    <PageContainer title="All Exams & Results">
                        <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                           &larr; Back to Exam Home
                       </button>
                        <ExamTable
                            exams={exams}
                            handleEditExam={handleEditExam}
                            handleDeleteExam={handleDeleteExam}
                        />
                        <ResultForm
                            resultFormData={resultFormData}
                            handleResultChange={(e) => setResultFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            handleResultSubmit={handleResultSubmit}
                            exams={exams}
                            students={students}
                        />
                        <ResultTable
                            results={results}
                            students={students}
                        />
                    </PageContainer>
                );
            case 'cards':
            default:
                return (
                    <PageContainer title="Exam & Results Management">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                onClick={() => { resetExamFormData(); setView('createExam'); }}
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
        }
    };

    return <>{renderContent()}</>;
};
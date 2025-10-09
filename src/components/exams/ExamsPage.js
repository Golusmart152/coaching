const ExamsPage = ({ showMessage }) => {
    const { useState, useEffect } = React;
    const { students, exams, results, getNextId, addItem, deleteExamAndResults, loading } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'createExam', 'allExams'
    const [examFormData, setExamFormData] = useState({
        subjectName: '', topic: '', duration: '', date: '', time: '', location: ''
    });
    const [resultFormData, setResultFormData] = useState({ studentId: '', examId: '', score: '' });
    const [nextExamId, setNextExamId] = useState(null);

    // Fetch the next exam ID when the component mounts
    useEffect(() => {
        const fetchNextId = async () => {
            const id = await getNextId('nextExamId');
            setNextExamId(id);
        };
        fetchNextId();
    }, []);

    const resetExamFormData = () => {
        setExamFormData({
            subjectName: '', topic: '', duration: '', date: '', time: '', location: ''
        });
    };

    // --- Handlers ---
    const handleExamSubmit = async (e) => {
        e.preventDefault();
        try {
            examSchema.parse(examFormData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        const newExam = { ...examFormData, id: nextExamId };
        await addItem('exams', newExam);
        const newNextId = await getNextId('nextExamId');
        setNextExamId(newNextId);
        showMessage('Exam created successfully!');
        resetExamFormData();
        setView('allExams');
    };

    const handleResultSubmit = async (e) => {
        e.preventDefault();

        const dataToValidate = {
            ...resultFormData,
            examId: parseInt(resultFormData.examId, 10) || 0,
        };

        try {
            resultSchema.parse(dataToValidate);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        await addItem('results', dataToValidate);
        showMessage('Result added successfully!');
        setResultFormData({ studentId: '', examId: '', score: '' });
    };

    const handleEditExam = (exam) => {
        showMessage('Edit exam functionality coming soon!');
    };

    const handleDeleteExam = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam and all its results?')) {
            await deleteExamAndResults(id);
            showMessage('Exam and its results deleted successfully!');
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <PageContainer title="Loading Exams..."><p>Loading data from the database...</p></PageContainer>;
    }

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
const ResultForm = ({ resultFormData, handleResultChange, handleResultSubmit, exams, students }) => {
    return (
        <div>
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
        </div>
    );
};
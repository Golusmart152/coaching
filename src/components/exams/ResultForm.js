const ResultForm = ({ onSubmit, exams, students }) => {
    const { useForm } = window.ReactHookForm;
    const { zodResolver } = HookFormResolvers.zod;

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(resultSchema),
        defaultValues: { studentId: '', examId: '', score: '' }
    });

    const renderError = (field) => errors[field] && <span className="text-red-500 text-xs">{errors[field].message}</span>;

    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset(); // Reset form after successful submission
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2 mt-8">Add Results</h3>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                    <select {...register("examId", { valueAsNumber: true })} className="form-select">
                        <option value="">Select Exam</option>
                        {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>{`${exam.subjectName} - ${exam.topic} (${exam.date})`}</option>
                        ))}
                    </select>
                    {renderError("examId")}
                </div>
                <div>
                    <select {...register("studentId")} className="form-select">
                        <option value="">Select Student</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{`${student.firstName} ${student.lastName} (${student.studentId})`}</option>
                        ))}
                    </select>
                    {renderError("studentId")}
                </div>
                <div>
                    <input {...register("score")} placeholder="Score (%)" className="form-input" />
                    {renderError("score")}
                </div>
                <div className="col-span-1 md:col-span-3 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Add Result</button>
                </div>
            </form>
        </div>
    );
};
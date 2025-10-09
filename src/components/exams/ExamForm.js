const ExamForm = ({ onSubmit, onCancel, editingExam }) => {
    const { useForm } = window.ReactHookForm;
    const { zodResolver } = HookFormResolvers.zod;

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(examSchema),
        defaultValues: editingExam || {
            subjectName: '', topic: '', duration: '', date: '', time: '', location: ''
        }
    });

    const renderError = (field) => errors[field] && <span className="text-red-500 text-xs">{errors[field].message}</span>;

    return (
        <PageContainer title={editingExam ? "Edit Exam" : "Create New Exam"}>
            <button onClick={onCancel} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Exam Home
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input {...register("subjectName")} placeholder="Subject Name" className="form-input" />
                    {renderError("subjectName")}
                </div>
                <div>
                    <input {...register("topic")} placeholder="Topic" className="form-input" />
                    {renderError("topic")}
                </div>
                <div>
                    <input type="number" {...register("duration")} placeholder="Duration (in hours)" className="form-input" />
                    {renderError("duration")}
                </div>
                <div>
                    <input type="date" {...register("date")} className="form-input" />
                    {renderError("date")}
                </div>
                <div>
                    <input type="time" {...register("time")} className="form-input" />
                    {renderError("time")}
                </div>
                <div>
                    <input {...register("location")} placeholder="Location" className="form-input" />
                    {renderError("location")}
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingExam ? 'Update Exam' : 'Create Exam'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
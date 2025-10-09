const CourseForm = ({ onSubmit, onCancel, editingCourse }) => {
    const { useForm } = window.ReactHookForm;
    const { zodResolver } = HookFormResolvers.zod;

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues: editingCourse ? {
            ...editingCourse,
            durationValue: editingCourse.duration.split(' ')[0],
            durationUnit: editingCourse.duration.split(' ')[1],
        } : {
            name: '', description: '', durationValue: '', durationUnit: 'months',
            totalFee: '', numberOfLectures: '', numberOfHours: ''
        }
    });

    const renderError = (field) => errors[field] && <span className="text-red-500 text-xs">{errors[field].message}</span>;

    return (
        <PageContainer title={editingCourse ? "Edit Course" : "New Course"}>
            <button onClick={onCancel} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Course Home
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                    <input {...register("name")} placeholder="Course Name" className="form-input" />
                    {renderError("name")}
                </div>
                <div>
                    <input {...register("totalFee")} placeholder="Total Fee (₹)" className="form-input" />
                    {renderError("totalFee")}
                </div>
                <div className="flex space-x-2">
                    <div className="w-2/3">
                        <input {...register("durationValue")} placeholder="Duration" className="form-input" />
                        {renderError("durationValue")}
                    </div>
                    <div className="w-1/3">
                        <select {...register("durationUnit")} className="form-select">
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                            <option value="weeks">Weeks</option>
                            <option value="days">Days</option>
                        </select>
                    </div>
                </div>
                <div>
                    <input {...register("numberOfLectures")} placeholder="No. of Lectures" className="form-input" />
                    {renderError("numberOfLectures")}
                </div>
                <div>
                    <input {...register("numberOfHours")} placeholder="No. of Hours" className="form-input" />
                    {renderError("numberOfHours")}
                </div>
                <div className="col-span-1 md:col-span-2">
                    <textarea {...register("description")} placeholder="Description" className="form-textarea"></textarea>
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingCourse ? 'Update Course' : 'Add Course'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
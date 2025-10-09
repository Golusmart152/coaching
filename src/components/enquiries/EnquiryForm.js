const EnquiryForm = ({ onSubmit, onCancel, editingEnquiry, courses }) => {
    const { useForm } = window.ReactHookForm;
    const { zodResolver } = HookFormResolvers.zod;

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(enquirySchema),
        defaultValues: editingEnquiry || {
            name: '', address: '', phone: '+91', courseEnquired: '',
            expectedJoiningDate: '', initialComments: '', status: 'New', reasonLost: '', followUps: []
        }
    });

    const renderError = (field) => errors[field] && <span className="text-red-500 text-xs">{errors[field].message}</span>;

    const status = watch('status');

    return (
        <PageContainer title={editingEnquiry ? "Edit Enquiry" : "New Enquiry"}>
            <button onClick={onCancel} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Enquiry Home
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <input {...register("name")} placeholder="Full Name" className="form-input" />
                    {renderError("name")}
                </div>
                <div>
                    <input {...register("phone")} placeholder="Phone Number (+91)" className="form-input" />
                    {renderError("phone")}
                </div>
                <div>
                    <input {...register("email")} placeholder="Email" className="form-input" />
                    {renderError("email")}
                </div>
                <div>
                    <input {...register("address")} placeholder="Address" className="form-input" />
                </div>
                <div>
                    <select {...register("courseEnquired")} className="form-select">
                        <option value="">Select Course Enquired</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                    {renderError("courseEnquired")}
                </div>
                <div>
                    <input type="date" {...register("expectedJoiningDate")} placeholder="Expected Joining Date" className="form-input" />
                </div>
                <div>
                    <select {...register("status")} className="form-select">
                        <option value="New">New</option>
                        <option value="Follow-up Required">Follow-up Required</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Lost">Lost</option>
                    </select>
                </div>
                {status === 'Lost' && (
                    <div>
                        <input {...register("reasonLost")} placeholder="Reason for losing enquiry" className="form-input" />
                    </div>
                )}
                <div className="col-span-1 md:col-span-2">
                    <textarea {...register("initialComments")} placeholder="Initial Remarks/Comments" className="form-textarea"></textarea>
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingEnquiry ? 'Update Enquiry' : 'Add Enquiry'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
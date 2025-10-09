const StudentForm = ({ onSubmit, onCancel, editingStudent, courses }) => {
    // Correctly access useForm from the global window object
    const { useForm } = window.ReactHookForm;
    const { zodResolver } = HookFormResolvers.zod;

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: editingStudent || {
            firstName: '', lastName: '', course: '', phone: '+91', birthdate: '', age: '',
            email: '', qualification: '', degreeName: '', casteCategory: '', state: '',
            pincode: '', dateOfRegistration: new Date().toISOString().slice(0, 10),
            documentsSubmitted: '', status: 'Active', photoUrl: '', fatherFullName: '',
            motherFullName: '', emergencyContactName: '', emergencyContactPhone: '', bloodGroup: ''
        }
    });

    const birthdate = watch('birthdate');

    React.useEffect(() => {
        if (birthdate) {
            const today = new Date();
            const birthDate = new Date(birthdate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setValue('age', age);
        }
    }, [birthdate, setValue]);

    const renderError = (field) => errors[field] && <span className="text-red-500 text-xs">{errors[field].message}</span>;

    return (
        <PageContainer title={editingStudent ? "Edit Student" : "New Student Registration"}>
            <button onClick={onCancel} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Student Home
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">First Name *</span>
                    <input {...register("firstName")} placeholder="First Name" className="form-input" />
                    {renderError("firstName")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Last Name *</span>
                    <input {...register("lastName")} placeholder="Last Name" className="form-input" />
                    {renderError("lastName")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Father's Full Name</span>
                    <input {...register("fatherFullName")} placeholder="Father's Full Name" className="form-input" />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Mother's Full Name</span>
                    <input {...register("motherFullName")} placeholder="Mother's Full Name" className="form-input" />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Email *</span>
                    <input {...register("email")} placeholder="Email" className="form-input" />
                    {renderError("email")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Phone Number *</span>
                    <input {...register("phone")} placeholder="Phone Number (+91)" className="form-input" />
                    {renderError("phone")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Date of Birth *</span>
                    <input type="date" {...register("birthdate")} className="form-input" />
                    {renderError("birthdate")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Date of Registration *</span>
                    <input type="date" {...register("dateOfRegistration")} className="form-input" />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <select {...register("status")} className="form-select">
                        <option value="Active">Active</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Emergency Contact Name</span>
                    <input {...register("emergencyContactName")} placeholder="Emergency Contact Name" className="form-input" />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Emergency Contact Phone</span>
                    <input {...register("emergencyContactPhone")} placeholder="10-digit phone number" className="form-input" />
                    {renderError("emergencyContactPhone")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Blood Group</span>
                    <select {...register("bloodGroup")} className="form-select">
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Medical Conditions</span>
                    <textarea {...register("medicalConditions")} placeholder="Allergies, chronic conditions, etc." className="form-textarea"></textarea>
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Profile Photo URL</span>
                    <input {...register("photoUrl")} placeholder="URL of student's photo" className="form-input" />
                    {renderError("photoUrl")}
                </label>

                <label className="flex flex-col">
                     <span className="text-sm font-medium text-gray-700">Course *</span>
                    <select {...register("course")} className="form-select">
                        <option value="">Select Course</option>
                        {courses.sort((a,b) => a.name.localeCompare(b.name)).map(course => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                    {renderError("course")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Qualification</span>
                    <select {...register("qualification")} className="form-select">
                        <option value="">Select Qualification</option>
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Degree Name</span>
                    <input {...register("degreeName")} placeholder="Degree Name" className="form-input" />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Caste Category</span>
                    <select {...register("casteCategory")} className="form-select">
                        <option value="">Select Caste Category</option>
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Pincode</span>
                    <input {...register("pincode")} placeholder="Pincode" className="form-input" />
                    {renderError("pincode")}
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">State *</span>
                    <select {...register("state")} className="form-select">
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    {renderError("state")}
                </label>

                <label className="flex flex-col col-span-1 md:col-span-2 lg:col-span-3">
                    <span className="text-sm font-medium text-gray-700">Documents Submitted (comma-separated)</span>
                    <textarea {...register("documentsSubmitted")} placeholder="e.g., Aadhar Card, Marksheet, Passport Photo" className="form-textarea"></textarea>
                </label>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingStudent ? 'Update Student' : 'Add Student'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
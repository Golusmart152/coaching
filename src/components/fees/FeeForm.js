const FeeForm = ({ onSubmit, onCancel, editingFee, students, courses, fees }) => {
    const { useForm, Controller } = window.ReactHookForm;
    const { zodResolver } = HookFormResolvers.zod;

    const { register, handleSubmit, formState: { errors }, watch, setValue, control } = useForm({
        resolver: zodResolver(feeSchema),
        defaultValues: editingFee || {
            studentId: '', amountPaid: '', date: new Date().toISOString().slice(0, 10),
            paymentType: 'Full', totalFee: 0, dueAmount: 0, paymentMethod: '', dueDate: ''
        }
    });

    const renderError = (field) => errors[field] && <span className="text-red-500 text-xs">{errors[field].message}</span>;

    const selectedStudentId = watch('studentId');
    const paymentType = watch('paymentType');
    const amountPaid = watch('amountPaid');
    const totalFee = watch('totalFee');

    React.useEffect(() => {
        if (selectedStudentId) {
            const student = students.find(s => s.id === selectedStudentId);
            if (student) {
                const course = courses.find(c => c.name === student.course);
                const studentTotalFee = course ? parseFloat(course.totalFee) : 0;
                const totalPaidByStudent = fees
                    .filter(f => f.studentId === selectedStudentId && f.id !== editingFee?.id)
                    .reduce((sum, f) => sum + parseFloat(f.amountPaid), 0);

                setValue('totalFee', studentTotalFee);

                if (paymentType === 'Full') {
                    const remainingAmount = studentTotalFee - totalPaidByStudent;
                    setValue('amountPaid', remainingAmount);
                    setValue('dueAmount', 0);
                } else {
                     const due = studentTotalFee - totalPaidByStudent - (parseFloat(amountPaid) || 0);
                     setValue('dueAmount', due);
                }
            }
        }
    }, [selectedStudentId, paymentType, amountPaid, fees, students, courses, setValue, editingFee]);

    return (
        <PageContainer title={editingFee ? "Edit Fee Record" : "New Fee Record"}>
            <button onClick={onCancel} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Fee Home
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                    <input {...register("totalFee", { valueAsNumber: true })} placeholder="Total Fee (₹)" disabled className="form-input bg-gray-200" />
                    {renderError("totalFee")}
                </div>
                <div>
                    <select {...register("paymentType")} className="form-select">
                        <option value="Full">Full Payment</option>
                        <option value="Partial">Partial Payment</option>
                    </select>
                </div>
                <div>
                    <input type="number" {...register("amountPaid", { valueAsNumber: true })} placeholder="Amount Paid (₹)" disabled={paymentType === 'Full'} className="form-input" />
                    {renderError("amountPaid")}
                </div>
                <div>
                    <input type="date" {...register("date")} className="form-input" />
                    {renderError("date")}
                </div>
                <div>
                    <input {...register("dueAmount", { valueAsNumber: true })} placeholder="Due Amount (₹)" disabled className="form-input bg-gray-200" />
                    {renderError("dueAmount")}
                </div>
                <div>
                    <select {...register("paymentMethod")} className="form-select">
                        <option value="">Select Payment Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                    </select>
                    {renderError("paymentMethod")}
                </div>
                <div>
                    <input type="date" {...register("dueDate")} className="form-input" />
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingFee ? 'Update Fee' : 'Add Fee Record'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
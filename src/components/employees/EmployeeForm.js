const EmployeeForm = ({ onSubmit, onCancel, editingEmployee }) => {
    const { useForm } = window.ReactHookForm;
    const { zodResolver } = HookFormResolvers.zod;

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: editingEmployee || {
            firstName: '', lastName: '', email: '', phone: '', address: '', role: '',
            salary: '', password: '', bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' }
        }
    });

    const renderError = (field) => errors[field] && <span className="text-red-500 text-xs">{errors[field].message}</span>;

    return (
        <PageContainer title={editingEmployee ? "Edit Employee" : "New Employee Registration"}>
            <button onClick={onCancel} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Employee Home
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                    <input {...register("firstName")} placeholder="First Name *" className="form-input" />
                    {renderError("firstName")}
                </div>
                <div>
                    <input {...register("lastName")} placeholder="Last Name *" className="form-input" />
                    {renderError("lastName")}
                </div>
                <div>
                    <input {...register("email")} placeholder="Email *" className="form-input" />
                    {renderError("email")}
                </div>
                <div>
                    <input {...register("phone")} placeholder="Phone Number" className="form-input" />
                </div>
                <div>
                    <input type="password" {...register("password")} placeholder={editingEmployee ? "New Password (optional)" : "Password *"} className="form-input" />
                    {renderError("password")}
                </div>
                <div className="col-span-1 md:col-span-2">
                    <input {...register("address")} placeholder="Address" className="form-input" />
                </div>
                <div>
                    <select {...register("role")} className="form-select">
                        <option value="">Select Role *</option>
                        <option value="Admin">Admin</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Data Entry">Data Entry</option>
                    </select>
                    {renderError("role")}
                </div>
                <div>
                    <input {...register("salary")} placeholder="Salary (₹)" className="form-input" />
                </div>
                <div className="col-span-1 md:col-span-2 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Bank Details (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input {...register("bankDetails.accountHolderName")} placeholder="Account Holder Name" className="form-input" />
                        <input {...register("bankDetails.bankName")} placeholder="Bank Name" className="form-input" />
                        <input {...register("bankDetails.accountNumber")} placeholder="Account Number" className="form-input" />
                        <input {...register("bankDetails.ifscCode")} placeholder="IFSC Code" className="form-input" />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingEmployee ? 'Update Employee' : 'Add Employee'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
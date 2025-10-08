const EmployeeDetailsModal = ({ employee, onClose }) => {
    if (!employee) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Employee Profile</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Full Name:</span>
                        <span>{`${employee.firstName} ${employee.lastName}`}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Role:</span>
                        <span>{employee.role}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Email:</span>
                        <span>{employee.email}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Phone:</span>
                        <span>{employee.phone}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Address:</span>
                        <span>{employee.address}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Salary:</span>
                        <span>{employee.salary ? `₹${employee.salary}` : 'N/A'}</span>
                    </div>
                    {employee.bankDetails?.accountNumber && (
                        <div className="col-span-1 md:col-span-2 mt-4 p-4 border rounded-lg bg-gray-50">
                            <h4 className="font-bold text-lg mb-2">Bank Details</h4>
                            <div className="flex flex-col md:flex-row md:space-x-8">
                                <div>
                                    <p><strong>Account Holder:</strong> {employee.bankDetails.accountHolderName}</p>
                                    <p><strong>Bank:</strong> {employee.bankDetails.bankName}</p>
                                </div>
                                <div>
                                    <p><strong>Account No:</strong> {employee.bankDetails.accountNumber}</p>
                                    <p><strong>IFSC Code:</strong> {employee.bankDetails.ifscCode}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Close</button>
                </div>
            </div>
        </div>
    );
};
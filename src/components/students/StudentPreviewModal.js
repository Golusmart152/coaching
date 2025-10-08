const StudentPreviewModal = ({ formData, nextStudentId, onConfirm, onCancel }) => {
    if (!formData) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Review Details</h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Student ID:</span>
                        <span>{nextStudentId} (New)</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Full Name:</span>
                        <span>{`${formData.firstName} ${formData.lastName}`}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Father's Full Name:</span>
                        <span>{formData.fatherFullName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Mother's Full Name:</span>
                        <span>{formData.motherFullName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Email:</span>
                        <span>{formData.email}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Phone:</span>
                        <span>{formData.phone}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Date of Birth:</span>
                        <span>{formData.birthdate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Age:</span>
                        <span>{formData.age} years</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Course:</span>
                        <span>{formData.course}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">State:</span>
                        <span>{formData.state}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Pincode:</span>
                        <span>{formData.pincode}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Qualification:</span>
                        <span>{formData.qualification}</span>
                    </div>
                    {formData.degreeName && (
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Degree:</span>
                            <span>{formData.degreeName}</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Caste Category:</span>
                            <span>{formData.casteCategory}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Status:</span>
                        <span>{formData.status}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Blood Group:</span>
                        <span>{formData.bloodGroup}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Emergency Contact:</span>
                        <span>{formData.emergencyContactName} ({formData.emergencyContactPhone})</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Medical Conditions:</span>
                        <span>{formData.medicalConditions || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <span className="font-semibold text-gray-900">Registration Date:</span>
                        <span>{formData.dateOfRegistration}</span>
                    </div>
                     <div className="flex flex-col md:col-span-2">
                        <span className="font-semibold text-gray-900">Documents Submitted:</span>
                        <span>{formData.documentsSubmitted}</span>
                    </div>
                </div>
                <div className="mt-6 text-right space-x-4">
                    <button onClick={onCancel} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300">Edit</button>
                    <button onClick={onConfirm} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Confirm & Save</button>
                </div>
            </div>
        </div>
    );
};
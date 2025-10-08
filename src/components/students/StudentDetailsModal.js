const StudentDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Student Profile</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Student ID:</span>
                        <span>{student.studentId}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Full Name:</span>
                        <span>{`${student.firstName} ${student.lastName}`}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Father's Full Name:</span>
                        <span>{student.fatherFullName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Mother's Full Name:</span>
                        <span>{student.motherFullName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Email:</span>
                        <span>{student.email}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Phone:</span>
                        <span>{student.phone}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Date of Birth:</span>
                        <span>{student.birthdate}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Age:</span>
                        <span>{student.age} years</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Course:</span>
                        <span>{student.course}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">State:</span>
                        <span>{student.state}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Pincode:</span>
                        <span>{student.pincode}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Qualification:</span>
                        <span>{student.qualification}</span>
                    </div>
                    {student.degreeName && (
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Degree:</span>
                            <span>{student.degreeName}</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Caste Category:</span>
                        <span>{student.casteCategory}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Status:</span>
                        <span>{student.status}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Blood Group:</span>
                        <span>{student.bloodGroup || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Emergency Contact:</span>
                        <span>{student.emergencyContactName} ({student.emergencyContactPhone})</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">Medical Conditions:</span>
                        <span>{student.medicalConditions || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <span className="font-semibold text-gray-900">Registration Date:</span>
                        <span>{student.dateOfRegistration}</span>
                    </div>
                     <div className="flex flex-col md:col-span-2">
                        <span className="font-semibold text-gray-900">Documents Submitted:</span>
                        <span>{student.documentsSubmitted}</span>
                    </div>
                </div>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Close</button>
                </div>
            </div>
        </div>
    );
};
const EnquiryModals = ({
    showFollowUpModal,
    showEnquiryModal,
    selectedEnquiry,
    followUpData,
    handleFollowUpChange,
    handleAddFollowUp,
    handleCloseModal
}) => {
    if (!showFollowUpModal && !showEnquiryModal) {
        return null;
    }

    if (showFollowUpModal) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Add Follow-up for {selectedEnquiry.name}</h3>
                    <form onSubmit={handleAddFollowUp} className="space-y-4">
                        <input type="date" name="date" value={followUpData.date} onChange={handleFollowUpChange} required className="form-input" />
                        <textarea type="text" name="remark" value={followUpData.remark} onChange={handleFollowUpChange} placeholder="Follow-up remark" required className="form-textarea"></textarea>
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={handleCloseModal} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300">Add Follow-up</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (showEnquiryModal) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">Enquiry Details</h3>
                        <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Name:</span>
                            <span>{selectedEnquiry.name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Phone:</span>
                            <span>{selectedEnquiry.phone}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Email:</span>
                            <span>{selectedEnquiry.email}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Address:</span>
                            <span>{selectedEnquiry.address}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Course Enquired:</span>
                            <span>{selectedEnquiry.courseEnquired}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Expected Joining Date:</span>
                            <span>{selectedEnquiry.expectedJoiningDate}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Status:</span>
                            <span>{selectedEnquiry.status}</span>
                        </div>
                        {selectedEnquiry.status === 'Lost' && (
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">Reason Lost:</span>
                                <span>{selectedEnquiry.reasonLost}</span>
                            </div>
                        )}
                        <div className="flex flex-col md:col-span-2">
                            <span className="font-semibold text-gray-900">Initial Comments:</span>
                            <span>{selectedEnquiry.initialComments}</span>
                        </div>
                        <div className="flex flex-col md:col-span-2 mt-4">
                            <h4 className="font-bold text-lg mb-2">Follow-up History</h4>
                            {selectedEnquiry.followUps.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {selectedEnquiry.followUps.map((f, i) => (
                                        <li key={i} className="bg-gray-100 p-2 rounded-lg">
                                            <span className="font-semibold">{f.date}:</span> {f.remark}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No follow-ups recorded.</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 text-right">
                        <button onClick={handleCloseModal} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
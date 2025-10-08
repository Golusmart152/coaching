const EnquiryTable = ({ enquiries, handleViewEnquiry, handleOpenFollowUpModal, handleEdit, handleDelete, setView }) => {
    const enquiryColumns = [{
        header: 'Name',
        accessor: 'name'
    }, {
        header: 'Course Enquired',
        accessor: 'courseEnquired'
    }, {
        header: 'Phone No.',
        accessor: 'phone'
    }, {
        header: 'Status',
        accessor: 'status'
    }, {
        header: 'Actions',
        accessor: 'actions',
        render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => handleViewEnquiry(item)} className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-blue-600 transition-colors">View</button>
                <button onClick={() => handleOpenFollowUpModal(item)} className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-green-600 transition-colors">Add Follow-up</button>
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-yellow-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600 transition-colors">Delete</button>
            </div>
        )
    }];

    return (
        <PageContainer title="Enquiry Management">
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Enquiry Home
            </button>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Enquiry List</h3>
                <button onClick={() => setView('form')} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Add New Enquiry</button>
            </div>
            <Table data={enquiries} columns={enquiryColumns} />
        </PageContainer>
    );
};
const EnquiriesPage = ({ showMessage }) => {
    const { useState } = React;
    const { courses, enquiries, setEnquiries } = useData();
    const { addNotification } = useNotifications();
    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '+91',
        courseEnquired: '',
        expectedJoiningDate: '',
        initialComments: '',
        status: 'New',
        reasonLost: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [followUpData, setFollowUpData] = useState({ date: new Date().toISOString().slice(0, 10), remark: '' });
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFollowUpChange = (e) => {
        const { name, value } = e.target;
        setFollowUpData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.courseEnquired) {
            showMessage('Please fill in all required fields.');
            return;
        }
        if (editingId) {
            setEnquiries(enquiries.map(e => e.id === editingId ? { ...e, ...formData } : e));
            showMessage('Enquiry updated successfully!');
        } else {
            const newEnquiry = { ...formData, id: crypto.randomUUID(), followUps: [] };
            setEnquiries([...enquiries, newEnquiry]);
            showMessage('Enquiry added successfully!');
            addNotification(`New enquiry from ${formData.name} for ${formData.courseEnquired}.`);
        }
        setFormData({
            name: '',
            address: '',
            phone: '+91',
            courseEnquired: '',
            expectedJoiningDate: '',
            initialComments: '',
            status: 'New',
            reasonLost: ''
        });
        setEditingId(null);
        setView('list');
    };

    const handleEdit = (enquiry) => {
        setFormData({
            name: enquiry.name,
            address: enquiry.address,
            phone: enquiry.phone,
            courseEnquired: enquiry.courseEnquired,
            expectedJoiningDate: enquiry.expectedJoiningDate,
            initialComments: enquiry.initialComments,
            status: enquiry.status,
            reasonLost: enquiry.reasonLost
        });
        setEditingId(enquiry.id);
        setView('form');
    };

    const handleDelete = (id) => {
        setEnquiries(enquiries.filter(e => e.id !== id));
        showMessage('Enquiry deleted successfully!');
    };

    const handleOpenFollowUpModal = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowFollowUpModal(true);
    };

    const handleAddFollowUp = (e) => {
        e.preventDefault();
        if (!followUpData.date || !followUpData.remark) {
            showMessage('Please add both a date and a remark for the follow-up.');
            return;
        }
        setEnquiries(enquiries.map(e =>
            e.id === selectedEnquiry.id
                ? { ...e, followUps: [...e.followUps, { ...followUpData }] }
                : e
        ));
        showMessage('Follow-up added successfully!');
        setShowFollowUpModal(false);
        setFollowUpData({ date: new Date().toISOString().slice(0, 10), remark: '' });
    };

    const handleViewEnquiry = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowEnquiryModal(true);
    };

    const handleCloseModal = () => {
        setSelectedEnquiry(null);
        setShowFollowUpModal(false);
        setShowEnquiryModal(false);
    };

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

    if (view === 'cards') {
        return (
            <PageContainer title="Enquiry Management">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => setView('form')}
                        className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                        <p className="text-xl font-semibold text-green-800">New Enquiry</p>
                    </div>
                    <div
                        onClick={() => setView('list')}
                        className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-blue-600 mb-2">{enquiries.length}</p>
                        <p className="text-xl font-semibold text-blue-800">Enquiry List</p>
                    </div>
                </div>
            </PageContainer>
        );
    } else if (view === 'form') {
        return (
            <PageContainer title="New Enquiry">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Enquiry Home
                </button>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="form-input" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (+91)" required className="form-input" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-input" />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="form-input" />
                    <select name="courseEnquired" value={formData.courseEnquired} onChange={handleChange} required className="form-select">
                        <option value="">Select Course Enquired</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                        ))}
                    </select>
                    <input type="date" name="expectedJoiningDate" value={formData.expectedJoiningDate} onChange={handleChange} placeholder="Expected Joining Date" className="form-input" />
                    <select name="status" value={formData.status} onChange={handleChange} required className="form-select">
                        <option value="New">New</option>
                        <option value="Follow-up Required">Follow-up Required</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Lost">Lost</option>
                    </select>
                    {formData.status === 'Lost' && (
                         <input type="text" name="reasonLost" value={formData.reasonLost} onChange={handleChange} placeholder="Reason for losing enquiry" className="form-input" />
                    )}
                    <textarea name="initialComments" value={formData.initialComments} onChange={handleChange} placeholder="Initial Remarks/Comments" className="form-textarea col-span-1 md:col-span-2"></textarea>
                    <div className="col-span-1 md:col-span-2 text-right">
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                            {editingId ? 'Update Enquiry' : 'Add Enquiry'}
                        </button>
                    </div>
                </form>
            </PageContainer>
        );
    }

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

            {showFollowUpModal && (
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
            )}

            {showEnquiryModal && (
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
            )}
        </PageContainer>
    );
};

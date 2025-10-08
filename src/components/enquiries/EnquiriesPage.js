const EnquiriesPage = ({ showMessage }) => {
    const { useState } = React;
    const { courses, enquiries, setEnquiries } = useData();
    const { addNotification } = useNotifications();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'list'
    const [formData, setFormData] = useState({
        name: '', address: '', phone: '+91', courseEnquired: '',
        expectedJoiningDate: '', initialComments: '', status: 'New', reasonLost: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [followUpData, setFollowUpData] = useState({ date: new Date().toISOString().slice(0, 10), remark: '' });
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);

    const resetFormData = () => {
        setFormData({
            name: '', address: '', phone: '+91', courseEnquired: '',
            expectedJoiningDate: '', initialComments: '', status: 'New', reasonLost: ''
        });
        setEditingId(null);
    };

    // --- Handlers ---
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.courseEnquired) {
            showMessage('Please fill in all required fields.');
            return;
        }
        if (editingId) {
            setEnquiries(enquiries.map(enq => enq.id === editingId ? { ...enq, ...formData } : enq));
            showMessage('Enquiry updated successfully!');
        } else {
            const newEnquiry = { ...formData, id: crypto.randomUUID(), followUps: [] };
            setEnquiries([...enquiries, newEnquiry]);
            showMessage('Enquiry added successfully!');
            addNotification(`New enquiry from ${formData.name} for ${formData.courseEnquired}.`);
        }
        resetFormData();
        setView('list');
    };

    const handleEdit = (enquiry) => {
        setFormData({
            name: enquiry.name, address: enquiry.address, phone: enquiry.phone,
            courseEnquired: enquiry.courseEnquired, expectedJoiningDate: enquiry.expectedJoiningDate,
            initialComments: enquiry.initialComments, status: enquiry.status, reasonLost: enquiry.reasonLost
        });
        setEditingId(enquiry.id);
        setView('form');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            setEnquiries(enquiries.filter(e => e.id !== id));
            showMessage('Enquiry deleted successfully!');
        }
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
        setEnquiries(enquiries.map(enq =>
            enq.id === selectedEnquiry.id
                ? { ...enq, followUps: [...enq.followUps, { ...followUpData }] }
                : enq
        ));
        showMessage('Follow-up added successfully!');
        setShowFollowUpModal(false);
        setFollowUpData({ date: new Date().toISOString().slice(0, 10), remark: '' });
    };

    const handleViewEnquiry = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowEnquiryModal(true);
    };

    // --- Render Logic ---
    const renderContent = () => {
        switch (view) {
            case 'form':
                return (
                    <EnquiryForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        setView={setView}
                        editingId={editingId}
                        courses={courses}
                    />
                );
            case 'list':
                return (
                    <EnquiryTable
                        enquiries={enquiries}
                        handleViewEnquiry={handleViewEnquiry}
                        handleOpenFollowUpModal={handleOpenFollowUpModal}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        setView={setView}
                    />
                );
            case 'cards':
            default:
                return (
                    <PageContainer title="Enquiry Management">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                onClick={() => { resetFormData(); setView('form'); }}
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
        }
    };

    return (
        <>
            {renderContent()}
            <EnquiryModals
                showFollowUpModal={showFollowUpModal}
                showEnquiryModal={showEnquiryModal}
                selectedEnquiry={selectedEnquiry}
                followUpData={followUpData}
                handleFollowUpChange={(e) => setFollowUpData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                handleAddFollowUp={handleAddFollowUp}
                handleCloseModal={() => {
                    setSelectedEnquiry(null);
                    setShowFollowUpModal(false);
                    setShowEnquiryModal(false);
                }}
            />
        </>
    );
};
const EnquiriesPage = ({ showMessage }) => {
    const { useState } = React;
    const { courses, enquiries, addEnquiry, updateEnquiry, deleteEnquiry, loading } = useData();
    const { addNotification } = useNotifications();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'list'
    const [editingEnquiry, setEditingEnquiry] = useState(null);
    const [followUpData, setFollowUpData] = useState({ date: new Date().toISOString().slice(0, 10), remark: '' });
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);

    // --- Handlers ---
    const handleFormSubmit = async (data) => {
        if (editingEnquiry) {
            await updateEnquiry({ ...editingEnquiry, ...data });
            showMessage('Enquiry updated successfully!');
        } else {
            await addEnquiry({ ...data, followUps: [] });
            showMessage('Enquiry added successfully!');
            addNotification(`New enquiry from ${data.name} for ${data.courseEnquired}.`);
        }
        setEditingEnquiry(null);
        setView('list');
    };

    const handleEdit = (enquiry) => {
        setEditingEnquiry(enquiry);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            await deleteEnquiry(id);
            showMessage('Enquiry deleted successfully!');
        }
    };

    const handleOpenFollowUpModal = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowFollowUpModal(true);
    };

    const handleAddFollowUp = async (e) => {
        e.preventDefault();
        if (!followUpData.date || !followUpData.remark) {
            showMessage('Please add both a date and a remark for the follow-up.');
            return;
        }

        const enquiryToUpdate = enquiries.find(enq => enq.id === selectedEnquiry.id);
        const updatedFollowUps = [...enquiryToUpdate.followUps, followUpData];

        await updateEnquiry({ ...enquiryToUpdate, followUps: updatedFollowUps });

        showMessage('Follow-up added successfully!');
        setShowFollowUpModal(false);
        setFollowUpData({ date: new Date().toISOString().slice(0, 10), remark: '' });
    };

    const handleViewEnquiry = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowEnquiryModal(true);
    };

    const handleCancelForm = () => {
        setEditingEnquiry(null);
        setView('cards');
    };

    // --- Render Logic ---
    if (loading) {
        return <PageContainer title="Loading Enquiries..."><p>Loading data from the database...</p></PageContainer>;
    }

    const renderContent = () => {
        switch (view) {
            case 'form':
                return (
                    <EnquiryForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                        editingEnquiry={editingEnquiry}
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
                                onClick={() => { setEditingEnquiry(null); setView('form'); }}
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
const EnquiriesPage = ({ showMessage }) => {
    const { useState } = React;
    const { courses, enquiries, addItem, updateItem, deleteItem, loading } = useData();
    const { addNotification } = useNotifications();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'list'
    const [formData, setFormData] = useState({
        name: '', address: '', phone: '+91', courseEnquired: '',
        expectedJoiningDate: '', initialComments: '', status: 'New', reasonLost: '', followUps: []
    });
    const [editingId, setEditingId] = useState(null);
    const [followUpData, setFollowUpData] = useState({ date: new Date().toISOString().slice(0, 10), remark: '' });
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);

    const resetFormData = () => {
        setFormData({
            name: '', address: '', phone: '+91', courseEnquired: '',
            expectedJoiningDate: '', initialComments: '', status: 'New', reasonLost: '', followUps: []
        });
        setEditingId(null);
    };

    // --- Handlers ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            enquirySchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        if (editingId) {
            await updateItem('enquiries', { ...formData, id: editingId });
            showMessage('Enquiry updated successfully!');
        } else {
            await addItem('enquiries', formData);
            showMessage('Enquiry added successfully!');
            addNotification(`New enquiry from ${formData.name} for ${formData.courseEnquired}.`);
        }
        resetFormData();
        setView('list');
    };

    const handleEdit = (enquiry) => {
        setFormData(enquiry);
        setEditingId(enquiry.id);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            await deleteItem('enquiries', id);
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

        await updateItem('enquiries', { ...enquiryToUpdate, followUps: updatedFollowUps });

        showMessage('Follow-up added successfully!');
        setShowFollowUpModal(false);
        setFollowUpData({ date: new Date().toISOString().slice(0, 10), remark: '' });
    };

    const handleViewEnquiry = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowEnquiryModal(true);
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
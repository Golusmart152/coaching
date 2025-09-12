const InstituteDetailsPage = ({ instituteDetails, setInstituteDetails, showMessage }) => {
    const { useState } = React;
    const [detailsForm, setDetailsForm] = useState(instituteDetails);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetailsForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setInstituteDetails(detailsForm);
        showMessage('Institute details saved!');
    };

    return (
        <PageContainer title="Institute Details">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={detailsForm.name} onChange={handleChange} placeholder="Institute Name" required className="form-input col-span-1 md:col-span-2" />
                <input type="text" name="address" value={detailsForm.address} onChange={handleChange} placeholder="Address" required className="form-input col-span-1 md:col-span-2" />
                <input type="tel" name="phone" value={detailsForm.phone} onChange={handleChange} placeholder="Phone Number" required className="form-input" />
                <input type="email" name="email" value={detailsForm.email} onChange={handleChange} placeholder="Email" required className="form-input" />
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Save Details</button>
                </div>
            </form>
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-xl font-semibold mb-2">Current Details</h3>
                <p><strong>Name:</strong> {instituteDetails.name}</p>
                <p><strong>Address:</strong> {instituteDetails.address}</p>
                <p><strong>Phone:</strong> {instituteDetails.phone}</p>
                <p><strong>Email:</strong> {instituteDetails.email}</p>
            </div>
        </PageContainer>
    );
};

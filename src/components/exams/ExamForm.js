const ExamForm = ({ formData, setFormData, handleSubmit, setView }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageContainer title="Create New Exam">
            <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Exam Home
            </button>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="subjectName" value={formData.subjectName} onChange={handleChange} placeholder="Subject Name" required className="form-input" />
                <input type="text" name="topic" value={formData.topic} onChange={handleChange} placeholder="Topic" required className="form-input" />
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (in hours)" required className="form-input" />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" />
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="form-input" />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="form-input" />
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">Create Exam</button>
                </div>
            </form>
        </PageContainer>
    );
};
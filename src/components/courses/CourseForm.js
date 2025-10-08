const CourseForm = ({ formData, setFormData, handleSubmit, setView, setEditingId, editingId }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <PageContainer title={editingId ? "Edit Course" : "New Course"}>
            <button onClick={() => { setView('cards'); setEditingId(null); setFormData({ name: '', description: '', durationValue: '', durationUnit: 'months', totalFee: '', numberOfLectures: '', numberOfHours: '' }); }} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Course Home
            </button>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Course Name" required className="form-input" />
                <input type="number" name="totalFee" value={formData.totalFee} onChange={handleChange} placeholder="Total Fee (₹)" required className="form-input" />
                <div className="flex space-x-2">
                    <input type="number" name="durationValue" value={formData.durationValue} onChange={handleChange} placeholder="Duration" required className="form-input w-2/3" />
                    <select name="durationUnit" value={formData.durationUnit} onChange={handleChange} required className="form-select w-1/3">
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                        <option value="weeks">Weeks</option>
                        <option value="days">Days</option>
                    </select>
                </div>
                <input type="number" name="numberOfLectures" value={formData.numberOfLectures} onChange={handleChange} placeholder="No. of Lectures" required className="form-input" />
                <input type="number" name="numberOfHours" value={formData.numberOfHours} onChange={handleChange} placeholder="No. of Hours" required className="form-input" />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="form-textarea col-span-1 md:col-span-2"></textarea>
                <div className="col-span-1 md:col-span-2 text-right">
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        {editingId ? 'Update Course' : 'Add Course'}
                    </button>
                </div>
            </form>
        </PageContainer>
    );
};
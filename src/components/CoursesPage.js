const CoursesPage = ({ courses, setCourses, showMessage }) => {
    const { useState } = React;
    const [view, setView] = useState('cards');
    const [formData, setFormData] = useState({ name: '', description: '', durationValue: '', durationUnit: 'months', totalFee: '', numberOfLectures: '', numberOfHours: '' });
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.durationValue || !formData.durationUnit || !formData.totalFee || !formData.numberOfLectures || !formData.numberOfHours) {
            showMessage('Please fill in all required fields.');
            return;
        }
        const newDuration = `${formData.durationValue} ${formData.durationUnit}`;
        if (editingId) {
            setCourses(courses.map(c => c.id === editingId ? { ...c, ...formData, duration: newDuration } : c));
            showMessage('Course updated successfully!');
        } else {
            const newCourse = { id: crypto.randomUUID(), ...formData, duration: newDuration };
            setCourses([...courses, newCourse]);
            showMessage('Course added successfully!');
        }
        setFormData({ name: '', description: '', durationValue: '', durationUnit: 'months', totalFee: '', numberOfLectures: '', numberOfHours: '' });
        setEditingId(null);
        setView('list');
    };

    const handleEdit = (course) => {
        const [durationValue, durationUnit] = course.duration.split(' ');
        setFormData({ name: course.name, description: course.description, durationValue, durationUnit, totalFee: course.totalFee, numberOfLectures: course.numberOfLectures, numberOfHours: course.numberOfHours });
        setEditingId(course.id);
        setView('form');
    };

    const handleDelete = (id) => {
        setCourses(courses.filter(c => c.id !== id));
        showMessage('Course deleted successfully!');
    };

    const courseColumns = [{
        header: 'Name',
        accessor: 'name'
    }, {
        header: 'Description',
        accessor: 'description'
    }, {
        header: 'Duration',
        accessor: 'duration'
    }, {
        header: 'Lectures',
        accessor: 'numberOfLectures'
    }, {
        header: 'Hours',
        accessor: 'numberOfHours'
    }, {
        header: 'Total Fee',
        accessor: 'totalFee',
        render: (item) => `₹${item.totalFee}`
    }, {
        header: 'Actions',
        accessor: 'actions',
        render: (item) => (
            <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-yellow-600 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md text-xs hover:bg-red-600 transition-colors">Delete</button>
            </div>
        )
    }];

    if (view === 'cards') {
        return (
            <PageContainer title="Course Management">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        onClick={() => setView('form')}
                        className="bg-green-100 p-6 rounded-lg shadow-md hover:bg-green-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-green-600 mb-2">New</p>
                        <p className="text-xl font-semibold text-green-800">Create New Course</p>
                    </div>
                    <div
                        onClick={() => setView('list')}
                        className="bg-blue-100 p-6 rounded-lg shadow-md hover:bg-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                        <p className="text-4xl font-bold text-blue-600 mb-2">{courses.length}</p>
                        <p className="text-xl font-semibold text-blue-800">All Courses</p>
                    </div>
                </div>
            </PageContainer>
        );
    } else if (view === 'form') {
        return (
            <PageContainer title="New Course">
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
    } else if (view === 'list') {
        return (
            <PageContainer title="All Courses">
                <button onClick={() => setView('cards')} className="mb-4 text-blue-600 hover:underline">
                    &larr; Back to Course Home
                </button>
                <h3 className="text-xl font-semibold mb-2">Available Courses</h3>
                <Table data={courses.sort((a,b) => a.name.localeCompare(b.name))} columns={courseColumns} />
            </PageContainer>
        );
    }
};

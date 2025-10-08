const CoursesPage = ({ showMessage }) => {
    const { useState } = React;
    const { courses, setCourses } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'list'
    const [formData, setFormData] = useState({
        name: '', description: '', durationValue: '', durationUnit: 'months',
        totalFee: '', numberOfLectures: '', numberOfHours: ''
    });
    const [editingId, setEditingId] = useState(null);

    const resetFormData = () => {
        setFormData({
            name: '', description: '', durationValue: '', durationUnit: 'months',
            totalFee: '', numberOfLectures: '', numberOfHours: ''
        });
        setEditingId(null);
    };

    // --- Handlers ---
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
        resetFormData();
        setView('list');
    };

    const handleEdit = (course) => {
        const [durationValue, durationUnit] = course.duration.split(' ');
        setFormData({
            name: course.name, description: course.description, durationValue,
            durationUnit, totalFee: course.totalFee, numberOfLectures: course.numberOfLectures,
            numberOfHours: course.numberOfHours
        });
        setEditingId(course.id);
        setView('form');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(c => c.id !== id));
            showMessage('Course deleted successfully!');
        }
    };

    // --- Render Logic ---
    const renderContent = () => {
        switch (view) {
            case 'form':
                return (
                    <CourseForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        setView={setView}
                        setEditingId={setEditingId}
                        editingId={editingId}
                    />
                );
            case 'list':
                return (
                    <CourseTable
                        courses={courses}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        setView={setView}
                    />
                );
            case 'cards':
            default:
                return (
                    <PageContainer title="Course Management">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                onClick={() => { resetFormData(); setView('form'); }}
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
        }
    };

    return <>{renderContent()}</>;
};
const CoursesPage = ({ showMessage }) => {
    const { useState } = React;
    const { courses, addItem, updateItem, deleteItem, loading } = useData();

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
        try {
            courseSchema.parse(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                showMessage(error.errors[0].message);
            }
            return;
        }

        const courseData = {
            name: formData.name,
            description: formData.description,
            duration: `${formData.durationValue} ${formData.durationUnit}`,
            totalFee: formData.totalFee,
            numberOfLectures: formData.numberOfLectures,
            numberOfHours: formData.numberOfHours
        };

        if (editingId) {
            await updateItem('courses', { ...courseData, id: editingId });
            showMessage('Course updated successfully!');
        } else {
            await addItem('courses', courseData);
            showMessage('Course added successfully!');
        }
        resetFormData();
        setView('list');
    };

    const handleEdit = (course) => {
        const [durationValue, durationUnit] = course.duration.split(' ');
        setFormData({
            name: course.name,
            description: course.description,
            durationValue,
            durationUnit,
            totalFee: course.totalFee,
            numberOfLectures: course.numberOfLectures,
            numberOfHours: course.numberOfHours
        });
        setEditingId(course.id);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await deleteItem('courses', id);
            showMessage('Course deleted successfully!');
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <PageContainer title="Loading Courses..."><p>Loading data from the database...</p></PageContainer>;
    }

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
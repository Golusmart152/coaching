const CoursesPage = ({ showMessage }) => {
    const { useState } = React;
    const { courses, addCourse, updateCourse, deleteCourse, loading } = useData();

    const [view, setView] = useState('cards'); // 'cards', 'form', 'list'
    const [editingCourse, setEditingCourse] = useState(null);

    // --- Handlers ---
    const handleFormSubmit = async (data) => {
        const courseData = {
            name: data.name,
            description: data.description,
            duration: `${data.durationValue} ${data.durationUnit}`,
            totalFee: data.totalFee,
            numberOfLectures: data.numberOfLectures,
            numberOfHours: data.numberOfHours,
        };

        if (editingCourse) {
            await updateCourse({ ...courseData, id: editingCourse.id });
            showMessage('Course updated successfully!');
        } else {
            await addCourse(courseData);
            showMessage('Course added successfully!');
        }
        setEditingCourse(null);
        setView('list');
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await deleteCourse(id);
            showMessage('Course deleted successfully!');
        }
    };

    const handleCancelForm = () => {
        setEditingCourse(null);
        setView('cards');
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
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                        editingCourse={editingCourse}
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
                                onClick={() => { setEditingCourse(null); setView('form'); }}
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
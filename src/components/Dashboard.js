const Dashboard = ({ setPage, students, courses, enquiries, employees, exams, fees }) => {
    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalEnquiries = enquiries.length;
    const totalEmployees = employees.length;
    const totalExams = exams.length;

    const DashboardCard = ({ title, metric, links, bgColor, targetPage }) => (
        <div
            onClick={() => setPage(targetPage)}
            className={`${bgColor} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col items-start text-left`}
        >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            {metric && <p className="text-4xl font-bold text-gray-900 mb-4">{metric}</p>}
            <div className="flex flex-col space-y-2">
                {links.map((link, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            setPage(link.target);
                        }}
                        className="text-blue-700 hover:text-blue-900 font-semibold text-left hover:underline transition-colors duration-200"
                    >
                        {link.text} &rarr;
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <PageContainer title="Institute Admin Dashboard">
            <p className="text-gray-600 mb-8 text-center md:text-left">Welcome to your central control panel. Click on any module below to get started.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Students"
                    metric={totalStudents}
                    bgColor="bg-blue-200"
                    targetPage="students"
                    links={[
                        { text: 'New Student Registration', target: 'students' },
                        { text: 'View Enrolled Students', target: 'students' }
                    ]}
                />
                <DashboardCard
                    title="Courses"
                    metric={totalCourses}
                    bgColor="bg-green-200"
                    targetPage="courses"
                    links={[
                        { text: 'Create New Course', target: 'courses' },
                        { text: 'View All Courses', target: 'courses' }
                    ]}
                />
                <DashboardCard
                    title="Employees"
                    metric={totalEmployees}
                    bgColor="bg-purple-200"
                    targetPage="employees"
                    links={[
                        { text: 'New Employee Registration', target: 'employees' },
                        { text: 'View Employee Directory', target: 'employees' }
                    ]}
                />
                <DashboardCard
                    title="Fees"
                    metric={fees.length}
                    bgColor="bg-yellow-200"
                    targetPage="fees"
                    links={[
                        { text: 'New Fee Record', target: 'fees' },
                        { text: 'View Fee Records', target: 'fees' },
                        { text: 'View Student Ledgers', target: 'fees' }
                    ]}
                />
                <DashboardCard
                    title="Exams & Results"
                    metric={totalExams}
                    bgColor="bg-red-200"
                    targetPage="exams"
                    links={[
                        { text: 'Create New Exam', target: 'exams' },
                        { text: 'View All Exams', target: 'exams' }
                    ]}
                />
                <DashboardCard
                    title="Enquiries"
                    metric={totalEnquiries}
                    bgColor="bg-teal-200"
                    targetPage="enquiries"
                    links={[
                        { text: 'New Enquiry', target: 'enquiries' },
                        { text: 'View Enquiry List', target: 'enquiries' }
                    ]}
                />
                <DashboardCard
                    title="Reports"
                    metric=""
                    bgColor="bg-gray-200"
                    targetPage="reports"
                    links={[
                        { text: 'Generate Reports', target: 'reports' }
                    ]}
                />
                <DashboardCard
                    title="Settings"
                    metric=""
                    bgColor="bg-indigo-200"
                    targetPage="instituteDetails"
                    links={[
                        { text: 'Institute Details', target: 'instituteDetails' },
                        { text: 'Certificate Management', target: 'certificates' }
                    ]}
                />
            </div>
        </PageContainer>
    );
};

const { createContext, useContext, useState, useEffect, useCallback } = React;
const DataContext = createContext();

const DataProvider = ({ children }) => {
    // Local state to hold data from Dexie
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [fees, setFees] = useState([]);
    const [results, setResults] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [exams, setExams] = useState([]);
    const [instituteDetails, setInstituteDetails] = useState({});
    const [loading, setLoading] = useState(true);

    // Function to ensure the default admin user exists
    const ensureAdminUser = async () => {
        const adminUser = await db.employees.where('email').equals('admin@institute.com').first();
        if (!adminUser) {
            console.log("Admin user not found, creating one...");
            await db.employees.add({
                employeeId: 100,
                email: 'admin@institute.com',
                password: 'password',
                role: 'Admin',
                firstName: 'Super',
                lastName: 'Admin'
            });
        }
    };

    // Function to fetch all data from the database using services
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            await ensureAdminUser();

            const [
                studentsData, coursesData, feesData, resultsData,
                enquiriesData, employeesData, salariesData, examsData,
                instituteDetailsData
            ] = await db.transaction('r', db.tables, () => Promise.all([
                studentService.getAll(),
                courseService.getAll(),
                feeService.getAll(),
                examService.getAllResults(),
                enquiryService.getAll(),
                employeeService.getAll(),
                salaryService.getAll(), // Use the salary service
                examService.getAllExams(),
                db.instituteDetails.get(1)
            ]));

            setStudents(studentsData);
            setCourses(coursesData);
            setFees(feesData);
            setResults(resultsData);
            setEnquiries(enquiriesData);
            setEmployees(employeesData);
            setSalaries(salariesData);
            setExams(examsData);
            setInstituteDetails(instituteDetailsData || {});
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on initial mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Data Modification Functions ---

    const getNextId = async (counterName) => {
        return db.transaction('rw', db.counters, async () => {
            let counter = await db.counters.get('counters');
            if (!counter) {
                await db.counters.add({ id: 'counters', nextStudentId: 1001, nextEmployeeId: 101, nextExamId: 1 });
                counter = await db.counters.get('counters');
            }
            const nextId = counter[counterName];
            await db.counters.update('counters', { [counterName]: nextId + 1 });
            return nextId;
        });
    };

    // --- Service-based Functions ---
    const addStudent = async (student) => { await studentService.add(student); await fetchData(); };
    const updateStudent = async (student) => { await studentService.update(student); await fetchData(); };
    const deleteStudent = async (id) => { await studentService.delete(id); await fetchData(); };

    const addCourse = async (course) => { await courseService.add(course); await fetchData(); };
    const updateCourse = async (course) => { await courseService.update(course); await fetchData(); };
    const deleteCourse = async (id) => { await courseService.delete(id); await fetchData(); };

    const addEmployee = async (employee) => { await employeeService.add(employee); await fetchData(); };
    const updateEmployee = async (employee) => { await employeeService.update(employee); await fetchData(); };
    const deleteEmployee = async (id) => { await employeeService.delete(id); await fetchData(); };

    const addFee = async (fee) => { await feeService.add(fee); await fetchData(); };
    const updateFee = async (fee) => { await feeService.update(fee); await fetchData(); };
    const deleteFee = async (id) => { await feeService.delete(id); await fetchData(); };

    const addExam = async (exam) => { await examService.addExam(exam); await fetchData(); };
    const addResult = async (result) => { await examService.addResult(result); await fetchData(); };
    const deleteExamAndResults = async (examId) => { await examService.deleteExamAndResults(examId); await fetchData(); };

    const addEnquiry = async (enquiry) => { await enquiryService.add(enquiry); await fetchData(); };
    const updateEnquiry = async (enquiry) => { await enquiryService.update(enquiry); await fetchData(); };
    const deleteEnquiry = async (id) => { await enquiryService.delete(id); await fetchData(); };

    const addSalary = async (salary) => { await salaryService.add(salary); await fetchData(); };
    const deleteSalary = async (id) => { await salaryService.delete(id); await fetchData(); };

    const value = {
        students, courses, fees, results, enquiries, employees, salaries, exams,
        instituteDetails, loading,
        getNextId,
        // Service-based functions
        addStudent, updateStudent, deleteStudent,
        addCourse, updateCourse, deleteCourse,
        addEmployee, updateEmployee, deleteEmployee,
        addFee, updateFee, deleteFee,
        addExam, addResult, deleteExamAndResults,
        addEnquiry, updateEnquiry, deleteEnquiry,
        addSalary, deleteSalary,
        setInstituteDetails: async (details) => {
            await db.instituteDetails.put({ id: 1, ...details });
            await fetchData();
        },
    };

    return (
        <DataContext.Provider value={value}>
            {!loading ? children : <PageContainer title="Loading..."><p>Loading database, please wait...</p></PageContainer>}
        </DataContext.Provider>
    );
};

const useData = () => useContext(DataContext);
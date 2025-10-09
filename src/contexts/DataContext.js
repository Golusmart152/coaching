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

    // Function to fetch all data from the database
    const fetchData = useCallback(async () => {
        try {
            // Ensure admin user exists before fetching all data
            await ensureAdminUser();

            const [
                studentsData, coursesData, feesData, resultsData,
                enquiriesData, employeesData, salariesData, examsData,
                instituteDetailsData
            ] = await db.transaction('r', db.tables, () => Promise.all([
                db.students.toArray(),
                db.courses.toArray(),
                db.fees.toArray(),
                db.results.toArray(),
                db.enquiries.toArray(),
                db.employees.toArray(),
                db.salaries.toArray(),
                db.exams.toArray(),
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
            console.error("Failed to fetch data from Dexie:", error);
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
                // If counters object doesn't exist, create it
                await db.counters.add({
                    id: 'counters',
                    nextStudentId: 1001,
                    nextEmployeeId: 101,
                    nextExamId: 1
                });
                counter = await db.counters.get('counters');
            }
            const nextId = counter[counterName];
            await db.counters.update('counters', { [counterName]: nextId + 1 });
            return nextId;
        });
    };

    // Generic CRUD functions
    const addItem = async (tableName, item) => {
        await db[tableName].add(item);
        await fetchData();
    };

    const updateItem = async (tableName, item) => {
        await db[tableName].put(item);
        await fetchData();
    };

    const deleteItem = async (tableName, id) => {
        await db[tableName].delete(id);
        await fetchData();
    };

    const value = {
        students, courses, fees, results, enquiries, employees, salaries, exams,
        instituteDetails, loading,
        getNextId,
        addItem,
        updateItem,
        deleteItem,
        setInstituteDetails: async (details) => {
            await db.instituteDetails.put({ id: 1, ...details });
            await fetchData();
        },
        deleteExamAndResults: async (examId) => {
            await db.transaction('rw', db.exams, db.results, async () => {
                await db.exams.delete(examId);
                const resultsToDelete = await db.results.where({ examId: parseInt(examId, 10) }).primaryKeys();
                await db.results.bulkDelete(resultsToDelete);
            });
            await fetchData();
        }
    };

    return (
        <DataContext.Provider value={value}>
            {!loading ? children : <PageContainer title="Loading..."><p>Loading database, please wait...</p></PageContainer>}
        </DataContext.Provider>
    );
};

const useData = () => useContext(DataContext);
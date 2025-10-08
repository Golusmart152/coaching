const { createContext, useContext } = React;
const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [students, setStudents] = useLocalStorage('students', []);
    const [courses, setCourses] = useLocalStorage('courses', []);
    const [fees, setFees] = useLocalStorage('fees', []);
    const [results, setResults] = useLocalStorage('results', []);
    const [enquiries, setEnquiries] = useLocalStorage('enquiries', []);
    const [employees, setEmployees] = useLocalStorage('employees', []);
    const [salaries, setSalaries] = useLocalStorage('salaries', []);
    const [exams, setExams] = useLocalStorage('exams', []);
    const [nextStudentId, setNextStudentId] = useLocalStorage('nextStudentId', 1001);
    const [nextEmployeeId, setNextEmployeeId] = useLocalStorage('nextEmployeeId', 101);
    const [nextExamId, setNextExamId] = useLocalStorage('nextExamId', 1);
    const [instituteDetails, setInstituteDetails] = useLocalStorage('instituteDetails', {
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    const value = {
        students, setStudents,
        courses, setCourses,
        fees, setFees,
        results, setResults,
        enquiries, setEnquiries,
        employees, setEmployees,
        salaries, setSalaries,
        exams, setExams,
        nextStudentId, setNextStudentId,
        nextEmployeeId, setNextEmployeeId,
        nextExamId, setNextExamId,
        instituteDetails, setInstituteDetails
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

const useData = () => useContext(DataContext);
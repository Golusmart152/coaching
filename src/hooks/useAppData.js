// Custom hooks for data access - ready for future cloud DB sync
const useStudents = () => {
    return useLocalStorage('students', []);
};

const useEmployees = () => {
    return useLocalStorage('employees', []);
};

const useCourses = () => {
    return useLocalStorage('courses', []);
};

const useEnquiries = () => {
    return useLocalStorage('enquiries', []);
};

const useFees = () => {
    return useLocalStorage('fees', []);
};

const useSalaries = () => {
    return useLocalStorage('salaries', []);
};

const useExams = () => {
    return useLocalStorage('exams', []);
};

const useResults = () => {
    return useLocalStorage('results', []);
};

const useInstituteDetails = () => {
    return useLocalStorage('instituteDetails', {
        name: '',
        address: '',
        phone: '',
        email: ''
    });
};

// Hook for unified search across all data types
const useSearchData = () => {
    const [students] = useStudents();
    const [employees] = useEmployees();
    const [enquiries] = useEnquiries();
    const [fees] = useFees();
    const [salaries] = useSalaries();
    const [courses] = useCourses();
    const [exams] = useExams();
    const [results] = useResults();

    const searchAllData = (query, filters = []) => {
        if (!query || query.trim() === '') return { students: [], employees: [], enquiries: [], fees: [], salaries: [], courses: [], exams: [], results: [] };
        
        const normalizedQuery = query.toLowerCase().trim();
        const searchResults = {};

        // Helper function to search in object values
        const searchInObject = (obj, searchFields = []) => {
            if (searchFields.length === 0) {
                // Search in all string/number fields
                return Object.values(obj).some(value => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        return String(value).toLowerCase().includes(normalizedQuery);
                    }
                    return false;
                });
            } else {
                // Search in specific fields
                return searchFields.some(field => {
                    const value = obj[field];
                    if (typeof value === 'string' || typeof value === 'number') {
                        return String(value).toLowerCase().includes(normalizedQuery);
                    }
                    return false;
                });
            }
        };

        // Search students
        if (filters.length === 0 || filters.includes('students')) {
            searchResults.students = students.filter(student => 
                searchInObject(student, ['firstName', 'lastName', 'studentId', 'email', 'phone', 'course'])
            );
        }

        // Search employees
        if (filters.length === 0 || filters.includes('employees')) {
            searchResults.employees = employees.filter(employee => 
                searchInObject(employee, ['firstName', 'lastName', 'email', 'phone', 'role', 'id'])
            );
        }

        // Search enquiries
        if (filters.length === 0 || filters.includes('enquiries')) {
            searchResults.enquiries = enquiries.filter(enquiry => 
                searchInObject(enquiry, ['name', 'phone', 'courseEnquired', 'status', 'id'])
            );
        }

        // Search fee transactions
        if (filters.length === 0 || filters.includes('fees')) {
            searchResults.fees = fees.filter(fee => {
                // Also search by student name in fee records
                const student = students.find(s => s.id === fee.studentId);
                const studentName = student ? `${student.firstName} ${student.lastName}` : '';
                return searchInObject(fee, ['studentId', 'paymentMethod', 'id']) ||
                       studentName.toLowerCase().includes(normalizedQuery);
            });
        }

        // Search salary transactions
        if (filters.length === 0 || filters.includes('salaries')) {
            searchResults.salaries = salaries.filter(salary => {
                // Also search by employee name in salary records
                const employee = employees.find(e => e.id === salary.employeeId);
                const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
                return searchInObject(salary, ['employeeId', 'paymentMethod', 'transactionId', 'id']) ||
                       employeeName.toLowerCase().includes(normalizedQuery);
            });
        }

        // Search courses
        if (filters.length === 0 || filters.includes('courses')) {
            searchResults.courses = courses.filter(course => 
                searchInObject(course, ['name', 'description', 'duration', 'instructor'])
            );
        }

        // Search exams
        if (filters.length === 0 || filters.includes('exams')) {
            searchResults.exams = exams.filter(exam => 
                searchInObject(exam, ['subjectName', 'topic', 'location', 'id'])
            );
        }

        // Search results
        if (filters.length === 0 || filters.includes('results')) {
            searchResults.results = results.filter(result => {
                const student = students.find(s => s.id === result.studentId);
                const exam = exams.find(e => e.id === result.examId);
                const studentName = student ? `${student.firstName} ${student.lastName}` : '';
                const examName = exam ? exam.subjectName : '';
                return searchInObject(result, ['studentId', 'examId', 'score', 'id']) ||
                       studentName.toLowerCase().includes(normalizedQuery) ||
                       examName.toLowerCase().includes(normalizedQuery);
            });
        }

        return searchResults;
    };

    return { searchAllData };
};
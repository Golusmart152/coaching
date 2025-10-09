const db = new Dexie('InstituteDB');

db.version(2).stores({
    students: '++id, studentId, email',
    courses: '++id, name',
    employees: '++id, employeeId, email, role',
    fees: '++id, studentId, date',
    results: '++id, studentId, examId',
    enquiries: '++id, phone, status',
    salaries: '++id, employeeId, date',
    exams: '++id, subjectName, date',
    instituteDetails: 'id',
    notifications: '++id, date',
    users: '++id, email, role',
    counters: 'id' // For custom auto-incrementing IDs
});

// Pre-populate tables with default data on creation
db.on('populate', (tx) => {
    tx.instituteDetails.add({
        id: 1,
        name: 'My Awesome Institute',
        address: '123 Education Lane, Knowledge City',
        phone: '+91 9876543210',
        email: 'contact@awesomeinstitute.com'
    });
    tx.counters.add({
        id: 'counters',
        nextStudentId: 1001,
        nextEmployeeId: 101,
        nextExamId: 1
    });
    // Add a default admin user for login
    tx.employees.add({
        employeeId: 100,
        email: 'admin@institute.com',
        password: 'password',
        role: 'Admin',
        firstName: 'Super',
        lastName: 'Admin'
    });
});

// Open the database
db.open().catch((err) => {
    console.error(`Failed to open db: ${err.stack || err}`);
});
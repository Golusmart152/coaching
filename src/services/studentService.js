const studentService = {
    getAll: async () => {
        return await db.students.toArray();
    },
    add: async (student) => {
        return await db.students.add(student);
    },
    update: async (student) => {
        return await db.students.put(student);
    },
    delete: async (id) => {
        return await db.students.delete(id);
    }
};
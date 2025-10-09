const courseService = {
    getAll: async () => {
        return await db.courses.toArray();
    },
    add: async (course) => {
        return await db.courses.add(course);
    },
    update: async (course) => {
        return await db.courses.put(course);
    },
    delete: async (id) => {
        return await db.courses.delete(id);
    }
};
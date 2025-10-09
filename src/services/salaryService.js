const salaryService = {
    getAll: async () => {
        return await db.salaries.toArray();
    },
    add: async (salary) => {
        return await db.salaries.add(salary);
    },
    delete: async (id) => {
        return await db.salaries.delete(id);
    }
};
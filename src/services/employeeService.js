const employeeService = {
    getAll: async () => {
        return await db.employees.toArray();
    },
    add: async (employee) => {
        return await db.employees.add(employee);
    },
    update: async (employee) => {
        return await db.employees.put(employee);
    },
    delete: async (id) => {
        return await db.employees.delete(id);
    }
};
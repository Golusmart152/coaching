const feeService = {
    getAll: async () => {
        return await db.fees.toArray();
    },
    add: async (fee) => {
        return await db.fees.add(fee);
    },
    update: async (fee) => {
        return await db.fees.put(fee);
    },
    delete: async (id) => {
        return await db.fees.delete(id);
    }
};
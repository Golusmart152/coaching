const enquiryService = {
    getAll: async () => {
        return await db.enquiries.toArray();
    },
    add: async (enquiry) => {
        return await db.enquiries.add(enquiry);
    },
    update: async (enquiry) => {
        return await db.enquiries.put(enquiry);
    },
    delete: async (id) => {
        return await db.enquiries.delete(id);
    }
};
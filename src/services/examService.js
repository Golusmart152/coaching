const examService = {
    // Exam functions
    getAllExams: async () => {
        return await db.exams.toArray();
    },
    addExam: async (exam) => {
        return await db.exams.add(exam);
    },
    updateExam: async (exam) => {
        return await db.exams.put(exam);
    },
    // Special delete function to also remove related results
    deleteExamAndResults: async (examId) => {
        return db.transaction('rw', db.exams, db.results, async () => {
            await db.exams.delete(examId);
            const resultsToDelete = await db.results.where({ examId: examId }).primaryKeys();
            await db.results.bulkDelete(resultsToDelete);
        });
    },

    // Result functions
    getAllResults: async () => {
        return await db.results.toArray();
    },
    addResult: async (result) => {
        return await db.results.add(result);
    }
};
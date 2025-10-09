const resultSchema = z.object({
    studentId: z.string().min(1, { message: "Student selection is required" }),
    examId: z.number().min(1, { message: "Exam selection is required" }),
    score: z.string().min(1, { message: "Score is required" }),
});
const examSchema = z.object({
    subjectName: z.string().min(1, { message: "Subject name is required" }),
    topic: z.string().min(1, { message: "Topic is required" }),
    duration: z.string().min(1, { message: "Duration is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    time: z.string().min(1, { message: "Time is required" }),
    location: z.string().min(1, { message: "Location is required" }),
});
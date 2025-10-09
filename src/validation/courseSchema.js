const courseSchema = z.object({
    name: z.string().min(1, { message: "Course name is required" }),
    description: z.string().optional(),
    durationValue: z.string().min(1, { message: "Duration is required" }),
    durationUnit: z.string().min(1, { message: "Duration unit is required" }),
    totalFee: z.string().min(1, { message: "Total fee is required" }),
    numberOfLectures: z.string().min(1, { message: "Number of lectures is required" }),
    numberOfHours: z.string().min(1, { message: "Number of hours is required" }),
});
const enquirySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().regex(/^\+91\d{10}$/, { message: "Must be a valid 10-digit phone number with +91 country code" }),
    courseEnquired: z.string().min(1, { message: "Course selection is required" }),
    address: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
    expectedJoiningDate: z.string().optional(),
    initialComments: z.string().optional(),
    status: z.string(),
    reasonLost: z.string().optional(),
    followUps: z.array(z.object({
        date: z.string(),
        remark: z.string(),
    })).optional(),
});
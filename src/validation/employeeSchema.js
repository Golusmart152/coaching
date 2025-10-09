const employeeSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.string().min(1, { message: "Role is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    salary: z.string().optional(),
    bankDetails: z.object({
        accountHolderName: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        ifscCode: z.string().optional(),
    }).optional(),
});
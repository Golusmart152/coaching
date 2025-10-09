const salarySchema = z.object({
    employeeId: z.string().min(1, { message: "Employee selection is required" }),
    amount: z.number().min(1, { message: "Amount must be greater than 0" }),
    date: z.string().min(1, { message: "Payment date is required" }),
    month: z.string().min(1, { message: "Salary month is required" }),
    year: z.string().min(1, { message: "Salary year is required" }),
});
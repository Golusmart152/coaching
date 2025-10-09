const feeSchema = z.object({
    studentId: z.string().min(1, { message: "Student selection is required" }),
    amountPaid: z.number().min(0.01, { message: "Amount paid must be greater than 0" }),
    date: z.string().min(1, { message: "Payment date is required" }),
    paymentType: z.string(),
    totalFee: z.number(),
    dueAmount: z.number(),
    paymentMethod: z.string().min(1, { message: "Payment method is required" }),
    dueDate: z.string().optional(),
});
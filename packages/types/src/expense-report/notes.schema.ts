import * as z from "zod/v4"

export const noteZodObject = z.object({
	id: z.uuid(),
	expense_id: z.uuid(),
	note: z.string(),
})

export const createNoteSchema = noteZodObject.omit({
	id: true,
	expense_id: true
})

export const updateNoteSchema = createNoteSchema.partial()

export type ExpenseReportNote = z.infer<typeof noteZodObject>
export type CreateExpenseReportNote = z.infer<typeof createNoteSchema>
export type UpdateExpenseReportNote = z.infer<typeof updateNoteSchema>

import { z } from "zod/v4";

export enum ExpenseCategory {
  Airfare = "Airfare",
  CarRental = "Car Rental",
  Fuel = "Fuel",
  Hotel = "Hotel",
  Meal = "Meal",
  Entertainment = "Entertainment",
  Telephone = "Telephone",
  Tickets = "Tickets",
  Transportation = "Transportation",
}

export enum ExpenseType {
  Client = "Client",
  Personal = "Personal",
  Prospect = "Prospect",
}

export enum Office {
  Houston = "Houston",
  Arkansas = "Arkansas",
  Louisiana = "Louisiana",
  Florida = "Florida",
  Sarasota = "Sarasota",
  SouthFlorida = "South Florida",
  CocoaBeach = "Cocoa Beach",
  Maitland = "Maitland",
  Merrimac = "Merrimac",
  Woodlands = "Woodlands",
}

export enum Department {
  Accounting = "Accounting",
  Admin = "Admin",
  Benefits = "Benefits",
  Bonds = "Bonds",
  Claims = "Claims",
  FinancialServices = "Financial Services",
  Life = "Life",
  Marketing = "Marketing",
  PEO = "PEO",
  PersonalLines = "Personal Lines",
  PropertyCasualty = "Property & Casualty",
}

export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const expenseZodObject = z.object({
  id: z.string(),
  expense_category: z.enum(ExpenseCategory),
  client_id: z.number().nullable().optional(),
  expense_type: z.enum(ExpenseType),
  expense_amount: z.number().or(z.string()),
  date_of_expense: z.date(),
  explanation: z.string().nullable().optional(),
  person_entertained: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  office: z.enum(Office),
  department: z.enum(Department).nullable().optional(),
  do_not_reimburse: z.boolean().nullable().optional(),
  mileage: z.number().or(z.string()).nullable().optional(),
  receipt: z.string().optional().nullable(),
  created_by: z.string(),
  status: z.string(),
  date_created: z.date(),
  expensed_for: z.string().nullable().optional(),
  expensed_for_staff_code: z.string().nullable().optional(),
  submitted_expense_report_filename: z.string().nullable().optional(),
  review_status: z.enum(ReviewStatus).nullable().optional(),
  review_reason: z.string().nullable().optional(),
});

export const createExpenseSchema = expenseZodObject.omit({
  id: true,
  receipt: true,
  date_created: true,
  status: true,
  review_status: true,
  review_reason: true,
  submitted_expense_report_filename: true,
  expensed_for_staff_code: true,
  expensed_for: true,
});

export const updateExpenseSchema = expenseZodObject.partial();

export const expenseReviewSchema = z.object({
  ids: z.array(z.string()),
  review_status: z.enum(ReviewStatus),
});

export const expenseReviewRejectionSchema = expenseReviewSchema.extend({
  review_reason: z.string().optional().nullable(),
});

export type Expense = z.infer<typeof expenseZodObject>;
export type CreateExpense = z.infer<typeof createExpenseSchema>;
export type UpdateExpense = z.infer<typeof updateExpenseSchema>;
export type ExpenseReview = z.infer<typeof expenseReviewSchema>;
export type ExpenseReviewRejection = z.infer<
  typeof expenseReviewRejectionSchema
>;

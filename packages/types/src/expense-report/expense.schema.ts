import { z } from "zod/v4";

export enum ExpenseCategory {
  Airfare = "Airfare",
  CarRental = "Car Rental",
  Fuel = "Fuel",
  Hotel = "Hotel",
  Meal = "Meal",
  Tickets = "Tickets",
  Telephone = "Telephone",
  Transportation = "Transportation",
  Golf = "Golf",
  OfficeSupplies = "Office Supplies",
  Hunting = "Hunting",
  Misc = "Misc",
}

export enum TicketsSubCategory {
  Golf = "Golf",
  Football = "Football",
  Baseball = "Baseball",
  Rodeo = "Rodeo",
  Cookoff = "Cookoff",
  Other = "Other",
}

export enum HuntingSubCategory {
  Groceries = "Groceries",
  Other = "Other",
}

export enum ExpenseDivisionGLCodes {
  Houston = 1,
  Louisiana = 8,
  Dormer = 20,
  Florida = 31,
  Merrimac = 34,
  TA = 50,
  MSurety = 51,
  Arkansas = 15,
}

export enum ExpenseCategoryGLCodes {
  Airfare = 6100,
  CarRental = 6100,
  ComputerSoftwareSupplies = 6187,
  Donations = 6155,
  DrinksOnly = 6110,
  DuesSubscriptions = 6250,
  Education = 6085,
  EmploymentFees = 6080,
  MileageReimbursement = 6100,
  GiftsFlowers = 6160,
  GiftsEEAnniversary = 6333,
  Golf = 6110,
  Hotel = 6100,
  HuntingAllOther = 6110,
  HuntingGroceriesForMealsCook = 6119,
  Internet = 6285,
  Licenses = 6240,
  MealClientProspectIncluded = 6119,
  MealEEOnly = 6099,
  MeetingsConferencesConventions = 6120,
  Miscellaneous = 6330,
  OfficeSupplies = 6185,
  PostageShippingDelivery = 6210,
  RepairsMaintenance = 6290,
  SocialCommittee = 6098,
  Sponsorship = 6150,
  Telephone = 6195,
  TicketCostOnlyBaseball = 6113,
  TicketCostOnlyFootball = 6114,
  TicketCostOnlyGolf = 6112,
  TicketCostOnlyRodeoCookoff = 6111,
  Transportation = 6100,
}

export enum ExpenseDepartmentGLCodes {
  PersonalLines = 20,
  PersonalLinesManager = 25,
  CommercialLines = 30,
  Marketing = 31,
  CommercialLinesManager = 35,
  ArkansasOffice = 39,
  Claims = 46,
  LossControl = 49,
  Surety = 50,
  SuretyManager = 55,
  Benefits = 60,
  Life = 61,
  PEO = 62,
  BenefitsManager = 65,
  Accounting = 70,
  IT = 75,
  EdBritt = 80,
  Administrative = 81,
  Operations = 85,
  Bonds = 50,
  BondsManager = 55,
  PropertyCasualty = 30,
  PropertyCasualtyManager = 35,
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
  INITIAL_REVIEW = "INITIAL_REVIEW",
  FINAL_REVIEW = "FINAL_REVIEW",
}

export const expenseZodObject = z.object({
  id: z.string(),
  expense_category: z.enum(ExpenseCategory),
  sub_category: z.string().nullable().optional(),
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
  gl_code: z.string().nullable().optional(),
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

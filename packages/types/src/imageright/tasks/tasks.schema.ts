import { z } from "zod/v4";

export const taskSchema = z.object({
  id: z.number(),
  description: z.string(),
  priority: z.number(),
  fileId: z.number(),
  fileName: z.string(),
  fileNumber: z.string(),
  fileNumber2: z.string(),
  fileNumber3: z.string(),
  flowId: z.number(),
  flowName: z.string(),
  stepId: z.number(),
  stepName: z.string(),
  senderStep: z.number(),
  superTaskId: z.number().nullable(),
  rendezvousStepId: z.number().nullable(),
  subTaskIsRequired: z.boolean(),
  noteId: z.number().nullable(),
  availableDate: z.date(),
  startDate: z.date(),
  lockExpiration: z.date(),
  undoExpires: z.date(),
  deadLine: z.date(),
  dateInitiated: z.date(),
  debug: z.boolean(),
  stackLevel: z.number().nullable(),
  errorCode: z.number(),
  errorMessage: z.string(),
  statusDetails: z.number(),
  status: z.number(),
  pageNumber: z.number().nullable(),
  objectId: z.number(),
  documentAttributes: z.unknown().nullable(),
  folderAttributes: z.unknown().nullable(),
  fileAttributes: z.unknown().nullable(),
  rowNum: z.number(),
  fileTypeId: z.number(),
  drawerId: z.number(),
  objectTypeId: z.number(),
  objectClass: z.number(),
  tasksRemainingCount: z.number(),
  hasNotes: z.boolean(),
});

export type ImagerightTask = z.infer<typeof taskSchema>;

export const imagerightTaskResponseSchema = z.object({
  items: z.array(taskSchema),
  nextPageLink: z.string().nullable(),
  count: z.number(),
});

export type ImagerightTaskResponse = z.infer<
  typeof imagerightTaskResponseSchema
>;

export const createImagerightTaskSchema = z.object({
  ObjectId: z.number(),
  StepId: z.number(),
  Priority: z.number(),
  Description: z.string(),
  PageNumber: z.number(),
  Debug: z.boolean(),
  NoteId: z.number(),
  Note: z.string(),
  UserId: z.number(),
  ExtUserId: z.string(),
  Attributes: z.array(z.object({ Id: z.number() })),
  AvailableDate: z.date(),
  DeadLine: z.date(),
});

export type CreateImagerightTask = z.infer<typeof createImagerightTaskSchema>;

export const updateImagerightTaskSchema = createImagerightTaskSchema.partial();

export type UpdateImagerightTask = z.infer<typeof updateImagerightTaskSchema>;

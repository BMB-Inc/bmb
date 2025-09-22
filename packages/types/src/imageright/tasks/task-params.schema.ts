import { z } from "zod/v4";

enum AgeCalculationAlgorithm {
  DateInitiated = "DateInitiated",
  StepDuration = "StepDuration",
  AvailableDate = "AvailableDate",
}

enum OrderBy {
  Priority = "Priority",
  AvailableDate = "AvailableDate",
  DateInitiated = "DateInitiated",
  FlowName = "FlowName",
  FileNumber = "FileNumber",
  TaskId = "TaskId",
}

const ageModelSetSchema = z.object({
  from: z.number(),
  to: z.number(),
  level: z.number(),
});

export const taskParamsSchema = z.object({
  tasks: z.number(),
  availableDateStart: z.date(),
  availableDateEnd: z.date(),
  flows: z.number(),
  excludeFlows: z.boolean(),
  steps: z.number(),
  excludeSteps: z.boolean(),
  assignedTo: z.number(),
  ageModelSet: ageModelSetSchema,
  ageCalculationAlgorithm: z.enum(AgeCalculationAlgorithm),
  excludeStatus: z.boolean(),
  lockable: z.boolean(),
  orderBy: z.enum(OrderBy),
  lockedBy: z.number(),
  debug: z.boolean(),
  fileTypes: z.number(),
  excludeFileTypes: z.boolean(),
  drawers: z.number(),
  excludeDrawers: z.boolean(),
  flowsStepsBuddies: z.object({}),
  skip: z.number(),
  top: z.number(),
});

export type TaskParams = z.infer<typeof taskParamsSchema>;
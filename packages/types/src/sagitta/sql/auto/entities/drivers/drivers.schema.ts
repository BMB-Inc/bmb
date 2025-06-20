import { z } from "zod/v4";

export const driversSchema = z
  .object({
    AGTDRIVERNO: z.string().optional(),
    ASSIGNEDRISK: z.string().optional(),
    ASSIGNEDRISKREASON: z.string().optional(),
    AWAYMILES: z.number().optional(),
    BIRTHDATE: z.coerce
      .date({ error: "Birth date is required." })
      .min(new Date("1900-01-01"), {
        message: "Birth date must be before 1900-01-01.",
      }),
    CLIENTDRIVERNO: z.coerce
      .number({ error: "Client driver number is required." })
      .transform((value) => value.toString())
      .optional(),
    DATEHIRED: z.date().optional(),
    DEFDRIVERCERTDATE: z.date().optional(),
    DEFENSIVEDRIVER: z.string().optional(),
    DISCOUNTSTUDENT: z.string().optional(),
    DRIREC: z.string().optional(),
    DRISEQ: z.string().optional(),
    DRIVERADDRESS: z.string().optional(),
    DRIVERCITY: z.string().optional(),
    DRIVERDISCOUNT: z.string().optional(),
    DRIVERIMPAIRMENTREMARKS: z.string().optional(),
    DRIVERLICENSE: z.string().optional(),
    DRIVERLICENSENUMBER: z.coerce
      .number()
      .min(1, { error: "Driver's license number is required." })
      .transform((value) => value.toString()),
    DRIVERNAME: z.string().min(1, { error: "Driver name is required." }),
    DRIVERRECORD: z.string().optional(),
    DRIVERS_ID: z.number().optional(),
    DRIVERTRAINING: z.string().optional(),
    DRIVERTYPE: z.string().optional(),
    DRVOCCUPATION: z.string().optional(),
    FINANCIALRESPONSIBILITY: z.string().optional(),
    FINANCIALSRESPREMARKS1: z.string().optional(),
    FINANCIALSRESPREMARKS2: z.string().optional(),
    FRFILINGDATE: z.date().optional(),
    FRFILINGSTATE: z.string().optional(),
    FRFILINGTERM: z.string().optional(),
    FRFILINGTYPE: z.string().optional(),
    FRINCIDENTDATE: z.date().optional(),
    FRINCIDENTVEHICLE: z.string().optional(),
    GENDER: z.string().optional(),
    GOODSTUDENT: z.string().optional(),
    IMPAIREDMEDICATED: z.string().optional(),
    LICENSEDATE: z.date().optional(),
    LICENSERESTRICTIONS: z.string().optional(),
    LICENSESTATE: z.string().min(1, { error: "License state is required." }),
    LICENSESUSPENDED: z.string().optional(),
    LICSUSPROVOKEDREMARKS: z.string().optional(),
    MARITALSTATUS: z.string().optional(),
    MATUREDRIVER: z.string().optional(),
    MATUREDRIVERCERTDATE: z.date().optional(),
    OCCUPATIONCLASS: z.string().optional(),
    POLICIES_ID: z.number().optional(),
    PRIMARYVEHICLE: z.number().optional(),
    REINSTATEMENTDATE: z.date().optional(),
    RELATIONSHIP: z.string().optional(),
    RESIDENTUNDER18: z.string().optional(),
    RESTRICTEDLICENSEREMARKS: z.string().optional(),
    SOCSECNO: z.string().optional(),
    STATE: z.string().optional(),
    STUDENTAWAYSCHOOLNAME: z.string().optional(),
    SUSPENSIONREASON: z.string().optional(),
    ZIPCODE: z.string().optional(),
  })
  .meta({
    description: "Auto drivers from Sagitta table 'BA_DRIVERS'",
    sagittaTable: "DRIVERS",
  });

export type DriversSchema = z.infer<typeof driversSchema>;

import { LossesSchema } from "./losses/losses.schema";
import {
  BACoveragesSchema,
  BAUnderwritingSchema,
  DriversSchema,
  VehiclesSchema,
} from "./auto";
import { ClientsSchema } from "./clients";
import { CPCoveragesSchema } from "./commercial";
import { ContactsSchema } from "./contacts";
import { CoveragesSchema } from "./coverages";
import { GlCoveragesSchema, GlUnderwritingSchema } from "./general-liability";
import { LocationsSchema } from "./locations";
import { PoliciesSchema } from "./policies";
import { Staff } from "./staff";
import { UMCoveragesSchema, UMUnderwritingSchema } from "./umbrella";
import { UsersDB } from "@bmb-inc/types/users";
import { WcCoveragesSchema, WCUnderwritingSchema } from "./workers-comp";

export interface SagittaDB {
  BACoverages: BACoveragesSchema;
  BAUnderwriting: BAUnderwritingSchema;
  Clients: ClientsSchema;
  Contacts: ContactsSchema;
  COVERAGES: CoveragesSchema;
  CPCoverages: CPCoveragesSchema;
  Drivers: DriversSchema;
  GLCoverages: GlCoveragesSchema;
  GLUnderwriting: GlUnderwritingSchema;
  Locations: LocationsSchema;
  Losses: LossesSchema;
  Policies: PoliciesSchema;
  Staff: Staff;
  UMCoverages: UMCoveragesSchema;
  UMUnderwriting: UMUnderwritingSchema;
  Users: UsersDB;
  Vehicles: VehiclesSchema;
  WCCoverages: WcCoveragesSchema;
  WCUnderwriting: WCUnderwritingSchema;
}

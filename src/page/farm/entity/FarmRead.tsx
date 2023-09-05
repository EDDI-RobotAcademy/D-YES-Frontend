import { Business } from "./Business";
import { FarmModify } from "./FarmModify";

export interface FarmRead {
  farmOperationInfoResponseForm: Business;
  farmInfoResponseForm: FarmModify;
}

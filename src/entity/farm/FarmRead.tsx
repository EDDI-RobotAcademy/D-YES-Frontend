import { Business } from "./Business";
import { FarmInfoRead } from "./FarmInfoRead";

export interface FarmRead {
  farmOperationInfoResponseForAdmin: Business;
  farmInfoResponseForAdmin: FarmInfoRead;
}

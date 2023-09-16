import { Business } from "./Business";
import { Farm } from "./Farm";

export interface FarmRead {
  farmOperationInfoResponseForAdmin: Business;
  farmInfoResponseForAdmin: Farm;
}

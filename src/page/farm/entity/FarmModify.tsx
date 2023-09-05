import { FarmAddress } from "./FarmAddress";

export interface FarmModify {
  farmId: string;
  farmName: string;
  csContactNumber: string;
  farmAddress: FarmAddress;
  mainImage: string;
  introduction: string;
  produceTypes: string;
}

import { FarmAddress } from "./FarmAddress";

export interface FarmInfoRead {
  farmId: string;
  farmName: string;
  csContactNumber: string;
  farmAddress: FarmAddress;
  mainImage: string;
  introduction: string;
  produceTypes: string[];
  userToken: string;
}

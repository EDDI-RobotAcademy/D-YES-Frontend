import { FarmAddress } from "./FarmAddress";

export interface FarmInfoRead {
  farmId: number;
  farmName: string;
  farmAddress: FarmAddress;
  csContactNumber: string;
  mainImage: string;
  introduction: string;
  produceTypes: string[];
}

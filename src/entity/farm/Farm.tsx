import { FarmAddress } from "./FarmAddress";

export interface Farm {
  farmId: number;
  farmName: string;
  farmAddress: FarmAddress;
  csContactNumber: string;
  mainImages: string;
  introduction: string;
  produceTypes: string[];
}

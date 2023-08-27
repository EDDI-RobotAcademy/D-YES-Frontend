import { FarmAddress } from "./FarmAddress";

export interface Farm {
  id: number;
  farmName: string;
  address: FarmAddress[];
  csContactNumber: string;
}
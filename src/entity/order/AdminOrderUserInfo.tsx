import { UserAddress } from "./UserAddress";

export interface AdminOrderUserInfo {
  userId: string;
  email: string;
  contactNumber: string;
  address: UserAddress;
}

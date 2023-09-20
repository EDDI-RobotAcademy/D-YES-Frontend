import { UserAddress } from "page/order/entity/UserAddress";

export interface AddressLists {
  addressId: number;
  addressBookOption: string;
  receiver: string;
  contactNumber: string;
  address: UserAddress;
}

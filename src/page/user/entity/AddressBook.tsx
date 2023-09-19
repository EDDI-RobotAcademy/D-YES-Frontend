import { UserAddress } from "page/order/entity/UserAddress";

export interface AddressBook {
  userToken: string;
  addressBookOption: string;
  receiver: string;
  contactNumber: string;
  address: UserAddress;
}

import React, { useEffect, useState } from "react";
import { addressDelete, defaultChange, getAddressList } from "page/user/api/UserApi";
import { AddressLists } from "page/user/entity/AddressLists";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Checkbox, IconButton, TableCell, TableHead, TableRow } from "@mui/material";
import { toast } from "react-toastify";
import { useQuery } from "react-query";

const AddressList = () => {
  const [addressList, setAddressList] = useState([] as AddressLists[]);
  const { data: addressListFromQuery } = useQuery("addressList", getAddressList, {
    refetchOnWindowFocus: false,
  });
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const hasFetchedRef = React.useRef(false);

  const fetchAddressList = async () => {
    try {
      hasFetchedRef.current = true;
      const fetchedAddressList: AddressLists[] = await getAddressList();

      if (fetchedAddressList.length === 0) {
        return;
      }
      setAddressList(fetchedAddressList);
      const defaultOptionAddress = fetchedAddressList.find(
        (address) => address.addressBookOption === "DEFAULT_OPTION"
      );
      if (defaultOptionAddress) {
        setSelectedAddressId(defaultOptionAddress.addressId.toString());
      }
    } catch (error) {
      console.error("배송지 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchAddressList();
    }
  }, []);

  useEffect(() => {
    if (addressListFromQuery) {
      setAddressList(addressListFromQuery);
    }
  }, [addressListFromQuery]);

  const handleDeleteClick = async (addressBookId: string) => {
    try {
      await addressDelete(addressBookId);
      const updatedAddressList = addressList.filter(
        (address) => address.addressId !== Number(addressBookId)
      );
      setAddressList(updatedAddressList);

      if (updatedAddressList.length === 0) {
        const firstAddress = addressListFromQuery[0];
        if (firstAddress) {
          const updateData = {
            userToken: localStorage.getItem("userToken") || "",
            addressBookOption: "DEFAULT_OPTION",
            addressBookId: Number(firstAddress.addressId),
          };
          await defaultChange(updateData);
          setSelectedAddressId(firstAddress.addressId.toString());
          toast.success("프로필에 있는 배송지가 기본 배송지로 설정됩니다");
        }
      }
    } catch (error) {
      console.error("배송지 삭제 실패:", error);
    }
  };

  const handleCheckboxToggle = async (addressId: string) => {
    try {
      const updateData = {
        userToken: localStorage.getItem("userToken") || "",
        addressBookOption: "DEFAULT_OPTION",
        addressBookId: Number(addressId),
      };

      await defaultChange(updateData);
      console.log("업데이트 주소", updateData)
      setSelectedAddressId(addressId);
      toast.success("기본 배송지가 변경되었습니다.");
    } catch (error) {
      console.error("주소 업데이트 실패:", error);
    }
  };

  return (
    <div style={{ paddingBottom: "16px" }}>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        // minHeight="25vh"
        // paddingTop="32px"
        // paddingBottom="20px"
        bgcolor="white"
        overflow="hidden" // 가로 스크롤 숨김
        border="solid 1px lightgray"
        maxWidth="600px" // 가로 길이 제한
        margin="0 auto" // 수평 가운데 정렬
      >
        <div></div>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "center",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  width: "10px",
                  // padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              ></TableCell>
              <TableCell
                style={{
                  width: "100px",
                  // padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                수령인
              </TableCell>
              <TableCell
                style={{
                  width: "100px",
                  // padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                연락처
              </TableCell>
              <TableCell
                style={{
                  width: "100px",
                  // padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                배송지
              </TableCell>
              <TableCell
                style={{
                  width: "20px",
                  // padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {addressList.map((address, index) => (
              <TableRow key={address.addressId}>
                <TableCell>
                  <Checkbox
                    checked={selectedAddressId === address.addressId.toString()}
                    onChange={() => handleCheckboxToggle(address.addressId.toString())}
                  />
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {address.receiver}
                </TableCell>
                {address.address ? (
                  <TableCell
                    style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                  >
                    {address.address.address} {address.address.zipCode} (
                    {address.address.addressDetail})
                  </TableCell>
                ) : (
                  <TableCell
                    style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                  >
                    등록된 주소가 없습니다.
                  </TableCell>
                )}
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {address.contactNumber}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  <IconButton
                    onClick={() => handleDeleteClick(address.addressId.toString())}
                    color="default"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AddressList;

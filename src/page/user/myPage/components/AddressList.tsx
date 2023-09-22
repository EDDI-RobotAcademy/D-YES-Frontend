import React, { useEffect, useState } from "react";
import { addressDelete, getAddressList } from "page/user/api/UserApi";
import { AddressLists } from "page/user/entity/AddressLists";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, TableCell, TableHead, TableRow } from "@mui/material";

const AddressList = () => {
  const [addressList, setAddressList] = useState([] as AddressLists[]);
  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchAddressList();
    }
  }, []);

  const fetchAddressList = async () => {
    try {
      hasFetchedRef.current = true;
      const fetchedAddressList = await getAddressList();

      if (fetchedAddressList.length === 0) {
        return;
      }

      setAddressList(fetchedAddressList);
    } catch (error) {
      console.error("배송지 목록 불러오기 실패:", error);
    }
  };

  const handleDeleteClick = async (addressBookId: string) => {
    try {
      await addressDelete(addressBookId);
      const updatedAddressList = addressList.filter(
        (address) => address.addressId !== Number(addressBookId)
      );
      setAddressList(updatedAddressList);
    } catch (error) {
      console.error("배송지 삭제 실패:", error);
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
                  width: "50px",
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

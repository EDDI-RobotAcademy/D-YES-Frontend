import React from "react";
import { useOrderOptionDataStore } from "../store/OrderOptionStore";
import { Box, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const AdminOrderOptionList = () => {
  const { orderOptionData } = useOrderOptionDataStore();

  return (
    <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        // minHeight="130vh"
        paddingTop="32px"
        // paddingBottom="20px"
        bgcolor="white"
        overflow="hidden" // 가로 스크롤 숨김
        border="solid 1px lightgray"
        maxWidth="1600px" // 가로 길이 제한
        margin="0 auto" // 수평 가운데 정렬
      >
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              gutterBottom
              style={{
                fontSize: "20px",
                fontFamily: "SUIT-Medium",
                color: "#252525",
                marginTop: "20px",
              }}
            >
              상품 정보
            </Typography>
          </div>
        </div>
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
                  width: "300px",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                PRODUCTID
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                상품명
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                OPTIONID
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                옵션명
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                옵션구매갯수
              </TableCell>
              <TableCell
                style={{
                  width: "200px",
                  padding: "8px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Medium",
                }}
              >
                옵션가격
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {orderOptionData.map((productData, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {productData.productId}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {productData.productName}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {productData.productOptionId}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {productData.productOptionName}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {productData.productOptionCount}
                </TableCell>
                <TableCell
                  style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                >
                  {productData.productOptionPrice}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AdminOrderOptionList;

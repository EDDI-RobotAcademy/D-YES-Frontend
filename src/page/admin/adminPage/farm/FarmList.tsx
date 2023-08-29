import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { getFarmList } from "page/admin/api/AdminApi";
import { Farm } from "page/farm/entity/Farm";

const FarmList = () => {
  const [farmList, setFarmList] = useState([] as Farm[]);

  useEffect(() => {
    fetchFarmList();
  }, []);

  const fetchFarmList = async () => {
    try {
      const fetchedFarmList = await getFarmList();
      setFarmList(fetchedFarmList);
    } catch (error) {
      console.error("농가 리스트 불러오기 실패:", error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      paddingTop="50px"
      paddingBottom="50px"
      bgcolor="white"
      marginLeft="40px" // 좌측 여백
      marginRight="90px" // 우측 여백
      overflow="hidden" // 가로 스크롤 숨김
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography gutterBottom style={{ fontSize: "20px" }}>
          농가 목록
        </Typography>
        <button
          onClick={fetchFarmList}
          style={{
            backgroundColor: "#252525",
            color: "rgb(250, 250, 250)",
            border: "none",
            padding: "4px 12px", // 버튼 크기 조정
            borderRadius: "0px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          농가 목록 불러오기
        </button>
      </Box>
      <TableContainer component={Paper} style={{ width: "900px", borderRadius: "0px" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
          <TableHead style={{ backgroundColor: "#D0D0D0" }}>
            <TableRow>
              <TableCell style={{ width: "50px", padding: "8px 16px", textAlign: "center" }}>
                id
              </TableCell>
              <TableCell style={{ width: "350px", padding: "8px 16px", textAlign: "center" }}>
                농가 이름
              </TableCell>
              <TableCell style={{ width: "500px", padding: "8px 16px", textAlign: "center" }}>
                농가 주소
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {farmList.map((farm) => (
              <TableRow key={farm.farmId}>
                <TableCell style={{ padding: "8px 16px", textAlign: "center" }}>
                  {farm.farmId}
                </TableCell>
                <TableCell style={{ padding: "8px 16px", textAlign: "center" }}>
                  {farm.farmName}
                </TableCell>
                <TableCell style={{ padding: "8px 16px", textAlign: "center" }}>
                  {farm.farmAddress.address} {farm.farmAddress.addressDetail} (
                  {farm.farmAddress.zipCode})
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </TableContainer>
    </Box>
  );
};

export default FarmList;

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
    >
      <Typography gutterBottom style={{ fontSize: "20px" }}>
        농가 목록
      </Typography>
      <button onClick={fetchFarmList}>농가 목록 불러오기</button>
      <TableContainer component={Paper} style={{ width: "900px" }}>
        <table>
          <TableHead style={{ backgroundColor: "#D0D0D0" }}>
            <TableRow>
              <TableCell style={{ width: "50px" }}>id</TableCell>
              <TableCell style={{ width: "350px" }}>농가 이름</TableCell>
              <TableCell style={{ width: "500px" }}>농가 주소</TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {farmList.map((farm) => (
              <TableRow key={farm.farmId}>
                <TableCell>{farm.farmId}</TableCell>
                <TableCell>{farm.farmName}</TableCell>
                <TableCell>
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

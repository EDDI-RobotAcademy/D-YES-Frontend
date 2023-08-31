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
    <div>
      <div className="list-menu">
        <img
          className="farm-list-icon"
          alt="농가 목록"
          src="img/farm-list-icon.png"
        />
        <Typography
            gutterBottom
            style={{
              fontSize: "16px",
              fontFamily: "SUIT-Medium",
              color: "#252525",
              marginBottom: "0px",
            }}
          >
            등록된 농가 목록
            <Typography
            gutterBottom
            sx={{
              fontSize: "12px",
              fontFamily: "SUIT-Regular",
              color: "#252525",
            }}
          >
            * 등록되어 있는 농가 목록을 확인해주세요
          </Typography>
          </Typography>
        </div>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          minHeight="158.8vh"
          paddingTop="32px"
          paddingBottom="20px"
          bgcolor="white"
          overflow="hidden" // 가로 스크롤 숨김
          border="solid 1px lightgray"
        >
          <Box
            flex="0"
          >
          </Box>
          <Box
            bgcolor="white"
            flex="10"
            flexDirection="column"
            alignItems="center"
          >
            <button
              onClick={fetchFarmList}
              style={{
                backgroundColor: "#4F72CA",
                border: "none",
                color: "white",
                padding: "6px 398px",
                cursor: "pointer",
                fontSize: "14px",
                marginBottom: "2px",
                fontFamily: "SUIT-Light",
              }}
            >
              농가 목록 불러오기
            </button>
            <TableContainer
              component={Paper}
              style={{ width: "900px", borderRadius: "0px", fontFamily: "SUIT-ExtraBold" }}
            >
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
                        width: "50px",
                        padding: "18px 16px",
                        textAlign: "center",
                        color: "#252525",
                        fontFamily: "SUIT-Medium"
                      }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      style={{
                        width: "350px",
                        padding: "8px 16px",
                        textAlign: "center",
                        color: "#252525",
                        fontFamily: "SUIT-Medium"
                      }}
                    >
                      농가 이름
                    </TableCell>
                    <TableCell
                      style={{
                        width: "500px",
                        padding: "8px 16px",
                        textAlign: "center",
                        color: "#252525",
                        fontFamily: "SUIT-Medium"
                      }}
                    >
                      농가 주소
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {farmList.map((farm) => (
                    <TableRow key={farm.farmId}>
                      <TableCell style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}>
                        {farm.farmId}
                      </TableCell>
                      <TableCell style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}>
                        {farm.farmName}
                      </TableCell>
                      <TableCell style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}>
                        {farm.farmAddress.address} {farm.farmAddress.addressDetail} (
                        {farm.farmAddress.zipCode})
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </TableContainer>
          </Box>
        </Box>
      
    </div>
  );
};

export default FarmList;
import React from "react";
import { Box, Typography } from "@mui/material";
import "./css/AdminStatisticsList.css";
import AdminOrderStatisticsData from "page/order/components/AdminOrderStatisticsData";

const AdminStatisticsList = () => {
  return (
    <div className="statistics-info-container">
      <div className="box-container">
        <Box
          sx={{
            width: 300,
            height: 150,
            bgcolor: "white",
            border: "1px solid rgb(240, 240, 240);",
          }}
        >
          <Typography>농산물 가격 변동율(8개)</Typography>
        </Box>
        {/* <Box
          sx={{
            width: 300,
            height: 150,
            bgcolor: "white",
            border: "1px solid rgb(240, 240, 240);",
          }}
        >
          <Typography>월간 판매량</Typography>
        </Box> */}
        <AdminOrderStatisticsData />
        <Box
          sx={{
            width: 300,
            height: 150,
            bgcolor: "white",
            border: "1px solid rgb(240, 240, 240);",
          }}
        >
          <Typography>월간 인기 상품(Top3~5)</Typography>
        </Box>
        <Box
          sx={{
            width: 300,
            height: 150,
            bgcolor: "white",
            border: "1px solid rgb(240, 240, 240);",
          }}
        >
          <Typography>회원 가입 수(누적)</Typography>
        </Box>
        <Box
          sx={{
            width: 300,
            height: 150,
            bgcolor: "white",
            border: "1px solid rgb(240, 240, 240);",
          }}
        >
          <Typography>실시간 문의</Typography>
        </Box>
      </div>
    </div>
  );
};

export default AdminStatisticsList;

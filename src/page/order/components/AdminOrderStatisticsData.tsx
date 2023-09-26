import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { monthlyOrderStatistics } from "../api/OrderApi";
import { OrderStatisticsResponse } from "../entity/OrderStatisticsResponse";
import "../css/AdminOrderStatisticsData.css";
import { won } from "utility/filters/wonFilter";
import { ResponsiveStream } from "@nivo/stream";

const AdminOrderStatisticsData = () => {
  const [loadedOrderStatisticsData, setOrderStatisticsData] = useState<OrderStatisticsResponse>();
  const currentMonth = new Date().getMonth();
  const rawData: number[] | undefined = loadedOrderStatisticsData?.orderCountListByDay || [];
  const transformedData = rawData?.map((count, index) => {
    return {
      orderCount: count,
    };
  });

  useEffect(() => {
    const loadOrdersInfo = async () => {
      try {
        const response = await monthlyOrderStatistics();
        setOrderStatisticsData(response);
      } catch (error) {
        console.error(error);
      }
    };
    loadOrdersInfo();
  }, []);

  return (
    <div style={{ paddingTop: "32px", paddingBottom: "32px" }}>
      <Box
        sx={{
          width: 300,
          height: 150,
          bgcolor: "white",
          border: "1px solid rgb(240, 240, 240);",
        }}
        className="order-statistics-container"
      >
        <div className="order-statistics-head">
          <img src="/img/order-icon-dash-board.png" alt="주문" className="order-dash-board-img" />
          <Typography className="monthly-statistics-text-head">
            주문 통계 / {currentMonth + 1}월
          </Typography>
        </div>
        <div className="order-statistics-body-1">
          <Typography
            style={{
              fontSize: "20px",
              paddingLeft: "26px",
              paddingRight: "26px",
              fontFamily: "SUIT-Bold",
            }}
          >
            {typeof loadedOrderStatisticsData?.totalOrdersAmount === "number"
              ? won(loadedOrderStatisticsData?.totalOrdersAmount)
              : null}
            <Typography
              style={{
                fontSize: "12px",
                color:
                  loadedOrderStatisticsData?.monthOverMonthGrowthRate !== undefined &&
                  parseFloat(loadedOrderStatisticsData?.monthOverMonthGrowthRate.toString()) > 0
                    ? "red"
                    : loadedOrderStatisticsData?.monthOverMonthGrowthRate !== undefined &&
                      parseFloat(loadedOrderStatisticsData?.monthOverMonthGrowthRate.toString()) ===
                        0
                    ? "black"
                    : "blue",
              }}
            >
              {loadedOrderStatisticsData?.monthOverMonthGrowthRate}%
            </Typography>
          </Typography>
          <div className="order-statistics-body-2">
            <ResponsiveStream
              data={transformedData}
              keys={["orderCount"]}
              margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
              axisTop={null}
              axisRight={null}
              axisBottom={null}
              axisLeft={null}
              enableGridX={false}
              enableGridY={false}
              offsetType="none"
              colors={{ scheme: "paired" }}
              fillOpacity={0.85}
              motionConfig="molasses"
            />
          </div>
        </div>
        <div className="order-statistics-body-3">
          <Typography style={{ fontSize: "14px", paddingLeft: "26px", fontFamily: "SUIT-Medium" }}>
            총 주문 : {loadedOrderStatisticsData?.totalOrdersCount}건
          </Typography>
          <Typography style={{ fontSize: "12px", paddingLeft: "8px", fontFamily: "SUIT-Regular" }}>
            (주문 완료 : {loadedOrderStatisticsData?.completedOrders}
          </Typography>
          <Typography style={{ fontSize: "12px", paddingLeft: "4px", fontFamily: "SUIT-Regular" }}>
            취소 : {loadedOrderStatisticsData?.cancelledOrders})
          </Typography>
        </div>
      </Box>
    </div>
  );
};

export default AdminOrderStatisticsData;

import React from "react";
import "../css/NewOrderListSummaryChart.css";
import { ResponsiveLine } from "@nivo/line";
import { NewOrderManagemantInfo } from "page/order/entity/NewOrderManagemantInfo";

interface ChartData {
  id: string;
  data: { x: Date; y: number }[];
}

interface ChartFormProps {
  orderDataList: NewOrderManagemantInfo[];
}

const transformData = (data: NewOrderManagemantInfo[]): ChartData[] => {
  data.sort((a, b) => new Date(a.orderedTime).getTime() - new Date(b.orderedTime).getTime());

  const chartData: ChartData[] = [
    {
      id: "registeredOrderCount",
      data: data.map((item) => ({
        x: item.orderedTime,
        y: item.createdOrderCount,
      })),
    },
  ];

  return chartData;
};

const NewOrderListSummaryChart: React.FC<ChartFormProps> = ({ orderDataList }) => {
  const chartData = transformData(orderDataList);
  console.log("그리기 전 데이터: " + JSON.stringify(chartData));

  return (
    <div className="order-managemant-info-container">
      <div className="new-order-chart">
        <h4>주문 건수</h4>
        <div className="orderChart">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 0, bottom: 50, left: 40 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 1,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 1,
              tickPadding: 5,
              tickRotation: 0,
            }}
            enablePoints={false}
            colors={{ scheme: "category10" }}
            enableGridX={false}
            pointSize={8}
            pointColor={{ from: "color", modifiers: [] }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
        </div>
      </div>
    </div>
  );
};

export default NewOrderListSummaryChart;

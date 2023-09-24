import React from "react";
import { NewProductManagemantInfo } from "page/product/entity/NewProductManagemantInfo";
import "../css/NewProductListSummaryChart.css";
import { ResponsiveLine } from "@nivo/line";

interface ChartData {
  id: string;
  data: { x: Date; y: number }[];
}

interface ChartFormProps {
  productDataList: NewProductManagemantInfo[];
}

const transformData2 = (data: NewProductManagemantInfo[]): ChartData[] => {
  data.sort(
    (a, b) =>
      new Date(a.registrationDate).getTime() -
      new Date(b.registrationDate).getTime()
  );

  const chartData: ChartData[] = [
    {
      id: "registeredProductCount",
      data: data.map((item) => ({
        x: item.registrationDate,
        y: item.registeredProductCount,
      })),
    },
  ];

  return chartData;
};

const NewProductListSummaryChart: React.FC<ChartFormProps> = ({
  productDataList,
}) => {
  const chartData = transformData2(productDataList);
  console.log("그리기 전 데이터: " + JSON.stringify(chartData));

  return (
    <div className="product-managemant-info-container">
      <div className="new-product-chart">
        <h3>Recent Products</h3>
        <div className="productChart">
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
            colors={{ scheme: "nivo" }}
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

export default NewProductListSummaryChart;

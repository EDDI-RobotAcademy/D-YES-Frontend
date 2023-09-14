import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { FarmProducePriceList } from "page/farm/entity/farmProduce/FarmProducePriceList";

import "./css/LineChart.css";

interface ChartFormProps {
  priceList: FarmProducePriceList[];
}

const translateKorean: { [key: string]: string } = {
  cabbage: "양배추",
  carrot: "당근",
  cucumber: "오이",
  kimchiCabbage: "배추",
  onion: "양파",
  potato: "감자",
  welshOnion: "대파",
  youngPumpkin: "애호박",
};

const LineChart: React.FC<ChartFormProps> = ({ priceList }) => {
  const formattedData = priceList.map((item) => ({
    id: translateKorean[item.farmProduceName],
    data: item.priceList.map((priceItem) => ({
      x: Object.keys(priceItem)[0].split("-").slice(1).join("/"),
      y: priceItem[Object.keys(priceItem)[0]],
    })),
  }));

  return (
    <div className="chart">
      <ResponsiveLine
        data={formattedData}
        margin={{ top: 50, right: 40, bottom: 50, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        // enablePoints={false}
        colors={{ scheme: "paired" }}
        pointSize={8}
        pointColor={{ from: "color", modifiers: [] }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "top",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: -40,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;

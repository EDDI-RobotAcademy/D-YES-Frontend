// import React from "react";
// import "@testing-library/jest-dom";
// import "matchmedia-polyfill";
// import "matchmedia-polyfill/matchMedia.addListener";
// import { render, waitFor } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import MainPage from "../page/MainPage";
// import * as FarmProduceApi from "page/farm/api/FarmProduceApi";

// jest.mock("../page/farm/api/FarmProduceApi", () => ({
//   getFarmProducePriceList: jest.fn(),
// }));

// it("메인페이지 테스트", async () => {
//   const farmProducePriceList = [
//     {
//       farmProduceName: "cabbage",
//       priceList: [
//         { "2023-09-11": 1366 },
//         { "2023-09-12": 1354 },
//         { "2023-09-13": 1253 },
//         { "2023-09-14": 1354 },
//         { "2023-09-15": 1254 },
//         { "2023-09-16": 1253 },
//         { "2023-09-17": 1264 },
//       ],
//     },
//   ];

//   (FarmProduceApi.getFarmProducePriceList as jest.Mock).mockResolvedValue(farmProducePriceList);
//   const { getByText } = render(
//     <BrowserRouter>
//       <MainPage />
//     </BrowserRouter>
//   );

//   await waitFor(() => {
//     expect(getByText("양배추")).toBeInTheDocument();
//   });
// });

import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import * as AdminApi from "page/admin/api/AdminApi"; 
import { act } from "react-dom/test-utils";
import FarmList from "page/admin/adminPage/farm/FarmList";

jest.mock("page/admin/api/AdminApi", () => ({
  getFarmList: jest.fn(),
}));

it("농가 목록", async () => {
  const farmList = [
    {
      farmId: "1",
      farmName: "농가1",
      farmAddress: {
        address: "주소1",
        zipCode: "12345",
        addressDetail: "1",
      },
    },
  ];
  
  (AdminApi.getFarmList as jest.Mock).mockResolvedValue(farmList);

  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
      <FarmList />
      </QueryClientProvider>
    </BrowserRouter>
  );

  await act(async () => {
    await waitFor(() => {
      const typographyElement = screen.getByText("등록된 농가 목록");
      expect(typographyElement).toBeInTheDocument();
    });
  });
});
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import FarmRegister from "page/admin/adminPage/farm/FarmRegister";

jest.mock("page/admin/api/AdminApi", () => ({
  farmRegister: jest.fn().mockResolvedValue({ success: true }),
}));

it("농가 등록 테스트", async () => {
  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <FarmRegister />
      </QueryClientProvider>
    </BrowserRouter>
  );

  await act(async () => {
    const businessName = screen.getByLabelText("상호명*");
    const businessNumber = screen.getByLabelText("사업자 등록 번호*");
    const representativeName = screen.getByLabelText("대표자명*");
    const representativeContactNumber = screen.getByLabelText("대표자 연락처*");
    const farmName = screen.getByLabelText("이름*");
    const csContactNumber = screen.getByLabelText("고객센터 연락처*");
    const address = screen.getByLabelText("주소*");
    const zipCode = screen.getByLabelText("우편번호*");
    const addressDetail = screen.getByLabelText("상세주소*");
    const produceTypes = screen.getByLabelText("농가 한 줄 소개*");
    const submitButton = screen.getByText("판매할 품목을 선택해주세요 (필수)");

    fireEvent.change(businessName, { target: "상호" });
    fireEvent.change(businessNumber, { target: "000-00-00000" });
    fireEvent.change(representativeName, { target: "010-0000-0000" });
    fireEvent.change(representativeContactNumber, { target: "이름" });
    fireEvent.change(farmName, { target: "농가1" });
    fireEvent.change(csContactNumber, { target: "010-1111-1111" });
    fireEvent.change(address, { target: "주소1" });
    fireEvent.change(zipCode, { target: "12345" });
    fireEvent.change(addressDetail, { target: "1" });
    fireEvent.change(produceTypes, { target: "오이" });

    await fireEvent.click(submitButton);
  });
});

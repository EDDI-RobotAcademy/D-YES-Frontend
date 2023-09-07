import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ProductRegisterPage from "page/product/productAdmin/ProductRegisterPage";

jest.mock("page/product/api/ProductApi", () => ({
  registerProduct: jest.fn().mockResolvedValue({ success: true }),
}));


beforeAll(() => {
  document.execCommand = jest.fn();
});

const originalExecCommand = document.execCommand;

afterAll(() => {
  document.execCommand = originalExecCommand;
});

it("상품 등록 정보 테스트", async () => {
  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <ProductRegisterPage />
      </QueryClientProvider>
    </BrowserRouter>
  );

  await act(async () => {
    const productName = screen.getByLabelText("상품명*");
    const productDescription = screen.getByLabelText("상세정보*");
    const cultivationMethod = screen.getByText("재배방식*");
    const sellerInfo = screen.getByText("농가 이름*");
    const mainImg = screen.getByText("메인 이미지*");
    const detailImgs = screen.getByText("상세 이미지*");
    const optionName = screen.getByText("옵션명");
    const optionPrice = screen.getByText("가격");
    const stock = screen.getByText("재고");
    const value = screen.getByText("단위");
    const unit = screen.getByText("단위");
    const submitButton = screen.getByText("등록");

    fireEvent.change(productName, { target: "상품" });
    fireEvent.change(productDescription, { target: "정보" });
    fireEvent.change(cultivationMethod, { target: "ENVIRONMENT_FRIENDLY" });
    fireEvent.change(sellerInfo, { target: "농가" });
    fireEvent.change(mainImg, { target: "이미지" });
    fireEvent.change(detailImgs, { target: "이미지" });
    fireEvent.change(optionName, { target: "옵션" });
    fireEvent.change(optionPrice, { target: "10000" });
    fireEvent.change(stock, { target: "10" });
    fireEvent.change(value, { target: "1" });
    fireEvent.change(unit, { target: "G" });

    await fireEvent.click(submitButton);
  });
});

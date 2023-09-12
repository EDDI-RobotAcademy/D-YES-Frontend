import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { useProductQuery } from "page/product/api/ProductApi";
import AdminProductModifyPage from "page/admin/adminPage/product/AdminProductModifyPage";

jest.mock("page/product/api/ProductApi", () => ({
  updateProduct: jest.fn().mockResolvedValue({ success: true }),
  fetchProduct: jest.fn(),
  useProductQuery: jest.fn(),
  useProductUpdateMutation: jest.fn(),
}));

beforeAll(() => {
  document.execCommand = jest.fn();
});

const originalExecCommand = document.execCommand;

afterAll(() => {
  document.execCommand = originalExecCommand;
});

it("상품 수정 테스트", async () => {
  const fakeUserData = {
    productName: "상품1",
    productDescription: "상세정보",
    cultivationMethod: "PESTICIDE_FREE",
    // farmName: "농가1",
    useOptions: {
      optionName: "옵션1",
      optionPrice: "100000",
      stock: "10",
      value: "1",
      unit: "G",
    },
    mainImg: "메인 이미지",
    detailImgs: "상세 이미지",
    optionResponseForAdmin: true,
  };

  (useProductQuery as jest.Mock).mockReturnValue({
    data: fakeUserData,
    isSuccess: true,
  });

  // render(
  //   <BrowserRouter>
  //     <QueryClientProvider client={new QueryClient()}>
  //       {/* <AdminProductModifyPage /> */}
  //     </QueryClientProvider>
  //   </BrowserRouter>
  // );

  await act(async () => {
    // const productName = screen.getByLabelText("상품명");
    // const productDescription = screen.getByLabelText("상세정보");
    // const cultivationMethod = screen.getByText("재배방식");
    // // const farmName = screen.getByText("농가 이름");
    // const mainImg = screen.getByText("메인 이미지");
    // const detailImgs = screen.getByText("상세 이미지");
    // const optionName = screen.getByText("옵션정보");
    // const optionPrice = screen.getByText("가격");
    // const stock = screen.getByText("재고");
    // const value = screen.getByText("단위");
    // const unit = screen.getByText("단위");
    // const submitButton = screen.getByText("수정 완료");

    // fireEvent.change(productName, { target: "새상품" });
    // fireEvent.change(productDescription, { target: "새정보" });
    // fireEvent.change(cultivationMethod, { target: "ENVIRONMENT_FRIENDLY" });
    // // fireEvent.change(farmName, { target: "농가" });
    // fireEvent.change(mainImg, { target: "새 메인 이미지" });
    // fireEvent.change(detailImgs, { target: "새 메인 이미지" });
    // fireEvent.change(optionName, { target: "옵션2" });
    // fireEvent.change(optionPrice, { target: "10000" });
    // fireEvent.change(stock, { target: "10" });
    // fireEvent.change(value, { target: "1" });
    // fireEvent.change(unit, { target: "G" });

    // await fireEvent.click(submitButton);
  });
});

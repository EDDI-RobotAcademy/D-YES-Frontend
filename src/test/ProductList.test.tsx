import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import ProductListPage from "page/product/productUser/ProductListPage";

jest.mock("page/product/api/ProductApi", () => ({
  getProductList: jest.fn().mockResolvedValue([
    {
      productName: "test1",
      cultivationMethod: "유기농",
      minOptionPrice: 100000,
      productMainImage: "mainImage 10",
    },
  ]),
}));

it("상품 리스트 페이지 랜더링 테스트", async () => {
  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <ProductListPage />
      </QueryClientProvider>
    </BrowserRouter>
  );

  const productName = screen.getByTestId("product-name");
  const cultivationMethod = screen.getByTestId("cultivation-method");
  const minOptionPrice = screen.getByTestId("option-price");
  const productMainImage = screen.getByAltText("product 10");

  fireEvent.change(productName, { target: { value: "test1" } });
  fireEvent.change(cultivationMethod, { target: { value: "유기농" } });
  fireEvent.change(minOptionPrice, { target: { value: 100000 } });
  fireEvent.change(productMainImage, { target: { value: "mainImage 10" } });
});

import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import CartList from "page/cart/Cart";
import * as CartApi from "page/cart/api/CartApi";
import { act } from "react-dom/test-utils";

jest.mock("page/cart/api/CartApi", () => ({
  getCartItemList: jest.fn(),
}));

it("장바구니 상품 목록", async () => {
  const cartList = [
    {
      optionId: 1,
      productMainImage: "sampleImg1.jpg",
      productName: "장바구니 테스트1",
      optionPrice: 1000000,
      optionCount: 5,
      value: "10",
      unit: "KG",
    },
    {
      optionId: 2,
      productMainImage: "sampleImg2.jpg",
      productName: "장바구니 테스트2",
      optionPrice: 1000000,
      optionCount: 5,
      value: "10",
      unit: "KG",
    },
    {
      optionId: 5,
      productMainImage: "sampleImg3.jpg",
      productName: "장바구니 테스트3",
      optionPrice: 1000000,
      optionCount: 5,
      value: "10",
      unit: "KG",
    },
    {
      optionId: 142,
      productMainImage: "sampleImg4.jpg",
      productName: "장바구니 테스트4",
      optionPrice: 1000000,
      optionCount: 5,
      value: "10",
      unit: "KG",
    },
    {
      optionId: 32,
      productMainImage: "sampleImg5.jpg",
      productName: "장바구니 테스트5",
      optionPrice: 1000000,
      optionCount: 5,
      value: "10",
      unit: "KG",
    },
  ];

  (CartApi.getCartItemList as jest.Mock).mockResolvedValue(cartList);

  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <CartList />
      </QueryClientProvider>
    </BrowserRouter>
  );

  await act(async () => {
    await waitFor(() => {
      const testElement = screen.getByText("장바구니");
      expect(testElement).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import CartList from "page/cart/Cart";
import * as CartApi from "page/cart/api/CartApi";
import { act } from "react-dom/test-utils";

jest.mock("page/cart/api/CartApi", () => ({
  getCartItemList: jest.fn(),
  changeCartItemCount: jest.fn(),
  deleteCartItems: jest.fn(),
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
      optionPrice: 2000000,
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

  (CartApi.changeCartItemCount as jest.Mock).mockResolvedValue(cartList);

  await act(async () => {
    await waitFor(() => {
      const increaseButton = screen.getByTestId(`cart-increase-test-id-${cartList[0].optionId}`);
      fireEvent.click(increaseButton);
      expect(CartApi.changeCartItemCount).toHaveBeenCalledWith(
        expect.objectContaining({
          productOptionId: 1,
          optionCount: 6,
        })
      );

      const decreaseButton = screen.getByTestId(`cart-decrease-test-id-${cartList[0].optionId}`);
      fireEvent.click(decreaseButton);
      expect(CartApi.changeCartItemCount).toHaveBeenCalledWith(
        expect.objectContaining({
          productOptionId: 1,
          optionCount: 4,
        })
      );
    });
  });

  (CartApi.deleteCartItems as jest.Mock).mockResolvedValue(true);

  await act(async () => {
    await waitFor(() => {
      const deleteButton = screen.getByTestId(`cart-delete-test-id-${cartList[0].optionId}`);
      fireEvent.click(deleteButton);
      expect(CartApi.deleteCartItems).toHaveBeenCalledWith(cartList[0].optionId);
    });
  });

  (CartApi.deleteCartItems as jest.Mock).mockResolvedValue(true);

  await act(async () => {
    await waitFor(() => {
      for (const item of cartList) {
        const selectItem = screen.getByTestId(`cart-select-test-id-${item.optionId}`);
        fireEvent.click(selectItem);
      }
      const deleteSelectedButton = screen.getByText("선택한 상품 삭제");
      fireEvent.click(deleteSelectedButton);
      expect(CartApi.deleteCartItems).toHaveBeenCalledTimes(cartList.length);
    });
  });
});

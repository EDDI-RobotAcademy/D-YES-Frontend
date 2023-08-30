import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import AdminProductList from "page/product/productAdmin/AdminProductList";
import { useProductListQuery } from "page/product/api/ProductApi";

jest.mock("page/product/api/ProductApi", () => ({
  useProductListQuery: jest.fn(),
}));

const mockSetShowProductSection = jest.fn();

it("관리자 상품 리스트 페이지 랜더링 테스트", async () => {
  const products = [
    {
      productId: "1",
    },
  ];

  (useProductListQuery as jest.Mock).mockReturnValue({
    data: [products],
    isSuccess: true,
  });

  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <AdminProductList setShowProductSection={mockSetShowProductSection} />
      </QueryClientProvider>
    </BrowserRouter>
  );

  await waitFor(() => {
    const typographyElement = screen.queryByTestId("product-id");
    expect(typographyElement).toBeInTheDocument();
  });
});

// import React from "react";
// import { render, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { BrowserRouter } from "react-router-dom";
// import { Typography } from "@mui/material";
// import ProductListPage from "page/product/ProductListPage";

// jest.mock("page/product/api/ProductApi", () => ({
//   getProductList: jest.fn().mockResolvedValue([
//     {
//       productName: "test1",
//       cultivationMethod: "유기농",
//       minOptionPrice: 100000,
//       productMainImage: "mainImage 10",
//     },
//   ]),
// }));

// it("상품 리스트 페이지 랜더링 테스트", async () => {
//   render(
//     <BrowserRouter>
//       <QueryClientProvider client={new QueryClient()}>
//         <ProductListPage />
//       </QueryClientProvider>
//     </BrowserRouter>
//   );

//   const { getByTestId } = render(<Typography data-testid="product-name"></Typography>);
//   await waitFor(() => {
//     const typographyElement = getByTestId("product-name");
//     expect(typographyElement).toBeInTheDocument();
//   });
// });

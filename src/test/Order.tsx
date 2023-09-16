import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import * as OrderApi from "page/order/api/OrderApi";
import Order from "page/order/Order";
import { OrderInfo } from "page/order/entity/OrderInfo";

jest.mock("page/order/api/OrderApi", () => ({
  getOrderInfo: jest.fn(),
  updateAddressInfo: jest.fn(),
}));

it("주문 상품 목록", async () => {
  const orderList: OrderInfo = {
    userResponse: {
      address: "테스트주소1",
      zipCode: "12345",
      addressDetail: "테스트주소2",
      contactNumber: "01012345678",
      email: "test@test.com",
    },
    productResponseList: [
      {
        optionId: 1,
        productMainImage: "sampleImg1.jpg",
        productName: "테스트상품1",
        optionPrice: 1000000,
        optionCount: 5,
        value: 10,
        unit: "KG",
      },
    ],
  };

  (OrderApi.getOrderInfo as jest.Mock).mockResolvedValue(orderList);

  render(
    <MemoryRouter initialEntries={["/your-route"]} initialIndex={0}>
      <QueryClientProvider client={new QueryClient()}>
        <Order />
      </QueryClientProvider>
    </MemoryRouter>
  );

  const checkbox = await screen.findByTestId("order-checkbox-testid");

  fireEvent.click(checkbox);

  await waitFor(() => {
    expect(checkbox).toBeInTheDocument();
  });
});

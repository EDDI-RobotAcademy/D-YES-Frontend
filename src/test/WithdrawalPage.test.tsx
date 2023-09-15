// import React from "react";
// import { render, fireEvent, screen, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { BrowserRouter } from "react-router-dom";
// import WithdrawalPage from "page/user/withdrawal/WithdrawalPage";
// import { act } from "react-dom/test-utils";
// import { AuthProvider } from "layout/navigation/AuthConText";

// jest.mock("page/user/api/UserApi", () => ({
//   deleteInfo: jest.fn().mockResolvedValue(true),
// }));

// it("회원 탈퇴 테스트", async () => {
//   render(
//     <AuthProvider>
//       <BrowserRouter>
//         <QueryClientProvider client={new QueryClient()}>
//           <WithdrawalPage />
//         </QueryClientProvider>
//       </BrowserRouter>
//     </AuthProvider>
//   );

//   const confirmText = screen.getByLabelText("회원 탈퇴 확인");
//   const submitButton = screen.getByText("탈퇴하기");

//   act(() => {
//     fireEvent.change(confirmText, { target: { value: "회원 탈퇴" } });
//   });

//   await act(async () => {
//     fireEvent.click(submitButton);
//   });
// });

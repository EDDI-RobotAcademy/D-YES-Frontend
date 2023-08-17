import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { useUserQuery } from 'page/user/api/UserApi';
import MyPageUpdate from 'page/user/myPage/MyPageUpdate';

jest.mock('page/user/api/UserApi', () => ({
  updateInfo: jest.fn().mockResolvedValue({ success: true }),
  useUserQuery: jest.fn(),
  useUserUpdateMutation: jest.fn()
}));

it('회원 정보 수정 테스트', async () => {
    const fakeUserData = {
      email: 'test@test.com',
      nickname: '아무개',
      contactNumber: '01000000000',
      userAddress: {
        address: '역삼',
        zipCode: '123456',
        addressDetail: '1',
      },
    };

  (useUserQuery as jest.Mock).mockReturnValue({
    data: fakeUserData,
    isSuccess: true,
  });


  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <MyPageUpdate />
      </QueryClientProvider>
    </BrowserRouter>);

  const email = screen.getByLabelText('이메일');
  const nickname = screen.getByLabelText('닉네임');
  const contactNumber = screen.getByLabelText('휴대폰 번호');
  const address = screen.getByLabelText('주소');
  const zipCode = screen.getByLabelText('우편번호');
  const addressDetail = screen.getByLabelText('상세주소');
  const button = screen.getByText('수정완료');

  fireEvent.change(email, { target: { value: 'test123@test.com' } });
  fireEvent.change(nickname, { target: { value: '닉네임' } });
  fireEvent.change(contactNumber, { target: { value: '01012345678' } });
  fireEvent.change(address, { target: { value: '강남' } });
  fireEvent.change(zipCode, { target: { value: '678945' } });
  fireEvent.change(addressDetail, { target: { value: '1' } });

  await waitFor(() => {
    fireEvent.click(button);
  })
})
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import MyPage from 'page/user/myPage/MyPage';
import { act } from 'react-dom/test-utils';

jest.mock('page/user/api/UserApi', () => ({
  updateInfo: jest.fn().mockResolvedValue({ success: true }),
}));

it('회원 정보 테스트', async () => {
  render(
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <MyPage />
      </QueryClientProvider>
    </BrowserRouter>);

  const email = screen.getByLabelText('이메일');
  const nickname = screen.getByLabelText('닉네임');
  const contactNumber = screen.getByLabelText('휴대폰 번호');
  const address = screen.getByLabelText('주소');
  const zipCode = screen.getByLabelText('우편번호');
  const addressDetail = screen.getByLabelText('상세주소');
  const button = screen.getByText('돌아가기');

  act(() => {
    fireEvent.change(email, { target: { value: 'test@test.com' } });
    fireEvent.change(nickname, { target: { value: '아무개' } });
    fireEvent.change(contactNumber, { target: { value: '01000000000' } });
    fireEvent.change(address, { target: { value: '역삼' } });
    fireEvent.change(zipCode, { target: { value: '123456' } });
    fireEvent.change(addressDetail, { target: { value: '1' } });
  });

  await act(async () => {
    fireEvent.click(button);
  });
});
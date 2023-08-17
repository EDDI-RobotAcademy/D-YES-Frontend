import { Box, Button, Container, InputLabel, TextField } from "@mui/material";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  useUserQuery,
  useUserUpdateMutation,
} from "../api/UserApi";
import { toast } from "react-toastify";

declare global {
  interface Window {
    daum: any;
  }
}

interface IAddr {
  address: string;
  zonecode: string;
}

interface RouterParams {
  userId: string;
  [key: string]: string;
}

const MyPageUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useParams<RouterParams>();
  const { data: user } = useUserQuery();
  const [email, setEmail] = useState(user?.email || "");
  const [nickName, setNickName] = useState(user?.nickName || "");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || "");
  const [profileImg, setProfileImg] = useState(user?.profileImg || "");
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isNickNameAvailable, setIsNickNameAvailable] = useState<boolean>(false);
  const [isNickNameChanged, setIsNickNameChanged] = useState(false);

  const [userAddress, setUserAddress] = useState({
    address: user?.address || "",
    zipCode: user?.zipCode || "",
    addressDetail: user?.addressDetail || "",
  });

  useEffect(() => {
    if (location.state && location.state.userAddress) {
      setUserAddress(location.state.userAddress);
    }
  }, [location.state]);

  const userToken = localStorage.getItem("userToken");

  const mutation = useUserUpdateMutation();

  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (data: IAddr) {
        setUserAddress((prev) => ({
          ...prev, // 이전 객체의 모든 속성을 복사
          // 주소, 우편번호 업데이트
          address: data.address,
          zipCode: data.zonecode,
        }));
        document.getElementById("addrDetail")?.focus();
      },
    }).open();
  };

  const handleDuplicateCheck = async () => {
    const isDuplicate = await checkEmailDuplicate(email);
    if (isDuplicate) {
      setIsEmailAvailable(true);
      toast.success("사용가능한 이메일입니다.");
    } else {
      setIsEmailAvailable(false);
      toast.error("중복된 이메일입니다.");
    }
  };

  const handleDuplicateNicknameCheck = async () => {
    const isDuplicate = await checkNicknameDuplicate(nickName);
    if (isDuplicate) {
      setIsNickNameAvailable(true);
      toast.success("사용가능한 닉네임입니다.");
    } else {
      setIsNickNameAvailable(false);
      toast.error("중복된 닉네임입니다.");
    }
  };

  // 이메일 상태가 변경될 때마다 isEmailChanged 상태를 true로 설정
  useEffect(() => {
    setIsEmailChanged(email !== user?.email); // 변경 여부 판단
    setIsNickNameChanged(nickName !== user?.nickName); // 변경 여부 판단
  }, [email, nickName, user]);

  const handleEditFinishClick = async () => {
    // 이미 중복된 이메일, 닉네임인 경우 수정 완료 버튼을 비활성화
    // 수정을 원하는 사용자의 기존 이메일, 닉네임과 동일하다면 수정 완료 버튼 활성화
    if (
      (!isEmailAvailable && email !== user?.email) ||
      (!isNickNameAvailable && nickName !== user?.nickName)
    ) {
      toast.error("중복된 이메일 또는 닉네임입니다. 수정할 수 없습니다.");
      return;
    }

    try {
      const updatedData: any = {
        userId,
        userToken,
        email,
        nickName,
        profileImg,
        contactNumber,
        ...userAddress,
      };

      await mutation.mutateAsync(updatedData);
      queryClient.invalidateQueries(["user", userId]);
      console.log("확인", updatedData);
      navigate("/myPage");
    } catch (error) {
      if ((error as AxiosError).response && (error as AxiosError).response?.status === 400) {
        toast.error("페이지를 찾을 수 없습니다.");
      } else {
        toast.error("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Container sx={{ marginTop: "1em", width: "500px", maxWidth: "500px" }}>
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <h1>회원정보 수정</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <InputLabel htmlFor="email" shrink>
            이메일
          </InputLabel>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TextField
              id="email"
              fullWidth
              variant="outlined"
              sx={{ width: "300px", marginBottom: "16px" }}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button
              variant="outlined"
              onClick={handleDuplicateCheck}
              style={{ fontSize: "14px", height: "56px", padding: "0 26px", marginBottom: "16px" }}
              disabled={!isEmailChanged && email === user?.email}
            >
              중복확인
            </Button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <InputLabel htmlFor="nickname" shrink>
            닉네임
          </InputLabel>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <TextField
              id="nickname"
              fullWidth
              variant="outlined"
              sx={{ width: "300px", marginBottom: "16px" }}
              value={nickName}
              onChange={(event) => setNickName(event.target.value)}
            />
            <Button
              variant="outlined"
              onClick={handleDuplicateNicknameCheck}
              style={{ fontSize: "14px", height: "56px", padding: "0 26px" }}
              disabled={!isNickNameChanged && nickName === user?.nickName}
            >
              중복확인
            </Button>
          </div>
        </div>
        <div>
          <InputLabel htmlFor="contactNumber" shrink style={{ position: "absolute" }}>
            휴대폰 번호
          </InputLabel>
          <TextField
            id="contactNumber"
            fullWidth
            variant="outlined"
            sx={{ paddingTop: "24px", marginBottom: "16px" }}
            value={contactNumber}
            onChange={(event) => setContactNumber(event.target.value)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <InputLabel htmlFor="addr" shrink>
            주소
          </InputLabel>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <TextField
              id="addr"
              fullWidth
              variant="outlined"
              sx={{ width: "300px", marginBottom: "16px" }}
              value={userAddress.address}
              InputProps={{ onClick: onClickAddr }}
            />
            <Button
              variant="outlined"
              onClick={onClickAddr}
              style={{ fontSize: "14px", height: "56px", padding: "0 40px" }}
            >
              검색
            </Button>
          </div>
        </div>
        <div>
          <InputLabel htmlFor="zipNo" shrink style={{ position: "absolute" }}>
            우편번호
          </InputLabel>
          <TextField
            id="zipNo"
            fullWidth
            variant="outlined"
            sx={{ paddingTop: "24px", marginBottom: "16px" }}
            value={userAddress.zipCode}
          />
        </div>
        <div>
          <InputLabel htmlFor="addressDetail" shrink style={{ position: "absolute" }}>
            상세주소
          </InputLabel>
          <TextField
            id="addressDetail"
            fullWidth
            variant="outlined"
            sx={{ paddingTop: "24px", marginBottom: "16px" }}
            value={userAddress.addressDetail}
            onChange={(event) =>
              setUserAddress((prev) => ({ ...prev, addressDetail: event.target.value }))
            }
          />
        </div>
        <Button variant="outlined" onClick={handleEditFinishClick}>
          수정완료
        </Button>
      </Box>
    </Container>
  );
};

export default MyPageUpdate;

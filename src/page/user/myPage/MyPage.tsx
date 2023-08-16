import React from "react";
import { Box, Button, Container, InputLabel, OutlinedInput } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserMyPage } from "../api/UserApi";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");

  const { data: user } = useQuery("user", UserMyPage, {
    enabled: !!userToken,
  });

  const handleEditClick = () => {
    navigate("/updateInfo");
  };

  const handleCancelClick = () => {
    queryClient.invalidateQueries("user");
    navigate("/");
  };

  const getImageUrl = (imagePath: string) => {
    return imagePath;
  };

  return (
    <Container sx={{ marginTop: "1em", width: "500px", maxWidth: "500px" }}>
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <h1>회원정보</h1>
        {user?.profileImg && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ marginBottom: "16px" }}
          >
            <img
              src={getImageUrl(user.profileImg)}
              alt="프로필 이미지"
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
            />
          </Box>
        )}
        <InputLabel htmlFor="email" sx={{ fontSize: "12px" }}>
          이메일
        </InputLabel>
        <OutlinedInput
          id="email"
          name="email"
          disabled
          value={user?.email || ""}
          sx={{ borderRadius: "4px", marginBottom: "16px" }}
        />
        <InputLabel htmlFor="nickName" sx={{ fontSize: "12px" }}>
          닉네임
        </InputLabel>
        <OutlinedInput
          id="nickName"
          name="nickName"
          disabled
          value={user?.nickName || ""}
          sx={{ borderRadius: "4px", marginBottom: "16px" }}
        />
        <InputLabel htmlFor="contactNumber" sx={{ fontSize: "12px" }}>
          휴대폰 번호
        </InputLabel>
        <OutlinedInput
          id="contactNumber"
          name="contactNumber"
          disabled
          value={user?.contactNumber || ""}
          sx={{ borderRadius: "4px", marginBottom: "16px" }}
        />
        <InputLabel htmlFor="address" sx={{ fontSize: "12px" }}>
          주소
        </InputLabel>
        <OutlinedInput
          id="address"
          name="address"
          disabled
          value={user?.address || ""}
          sx={{ borderRadius: "4px", marginBottom: "16px" }}
        />
        <InputLabel htmlFor="zipNo" sx={{ fontSize: "12px" }}>
          우편번호
        </InputLabel>
        <OutlinedInput
          id="zipNo"
          name="zipCode"
          disabled
          value={user?.zipCode || ""}
          sx={{ borderRadius: "4px", marginBottom: "16px" }}
        />
        <InputLabel htmlFor="addrDetail" sx={{ fontSize: "12px" }}>
          상세주소
        </InputLabel>
        <OutlinedInput
          id="addrDetail"
          name="addressDetail"
          disabled
          value={user?.addressDetail || ""}
          sx={{ borderRadius: "4px", marginBottom: "16px" }}
        />
        <Button variant="outlined" onClick={handleEditClick}>
          수정
        </Button>
        {/* <Button variant='outlined' onClick={ handleDeleteClick }>탈퇴</Button> */}
        <Button variant="outlined" onClick={handleCancelClick}>
          돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default MyPage;

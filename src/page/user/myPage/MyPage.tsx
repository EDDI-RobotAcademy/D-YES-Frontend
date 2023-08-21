import React, { useEffect, useState } from "react";
import { Box, Button, Container, InputLabel, OutlinedInput } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserMyPage } from "../api/UserApi";
import { User } from "../entity/User";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const hasFetchedRef = React.useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchUser = async () => {
    hasFetchedRef.current = true;
    const userData = await UserMyPage();
    return userData;
  };

  const { data: user } = useQuery("user", fetchUser, {
    enabled: !!userToken && !hasFetchedRef.current,
    initialData: queryClient.getQueryData("user") || undefined,
  });

  const userAddress: User =
    typeof user?.address === "string"
      ? JSON.parse(user.address)
      : user?.address || {
          address: "",
          zipCode: "",
          addressDetail: "",
        };

  const handleEditClick = () => {
    navigate("/updateInfo", {
      state: {
        userAddress,
        userEmail: user?.email,
        userNickName: user?.nickName,
        userContactNumber: user?.contactNumber,
        userProfileImg: user?.profileImg,
      },
    });
  };

  const handleWithdrawalClick = () => {
    navigate("/withdrawal");
  };

  const handleCancelClick = () => {
    queryClient.invalidateQueries("user");
    navigate("/");
  };

  const getImageUrl = (imagePath: string) => {
    return (
      "https://" +
      `${process.env.REACT_APP_AWS_BUCKET_NAME}` +
      ".s3." +
      `${process.env.REACT_APP_AWS_BUCKET_REGION}` +
      ".amazonaws.com/" +
      `${imagePath}`
    );
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setImageLoaded(true);
    }, 700);
  }, [user?.profileImg]);

  return (
    <Container className="mypage-container">
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <h1>회원정보</h1>
        <InputLabel className="input-font-size">프로필 이미지</InputLabel>
        <div className="content-align">
          <div className="profile-image-container">
            {imageLoaded && (
              <div className="profile-image">
                <img
                  onLoad={handleImageLoad}
                  src={
                    user?.profileImg && user?.profileImg.includes("://")
                      ? user?.profileImg
                      : getImageUrl(user?.profileImg || "")
                  }
                  key={user?.profileImg}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    display: imageLoaded ? "block" : "none",
                  }}
                  alt="프로필 이미지"
                />
              </div>
            )}
          </div>
        </div>
        <InputLabel className="input-font-size" htmlFor="email">
          이메일
        </InputLabel>
        <OutlinedInput
          className="output-style"
          id="email"
          name="email"
          disabled
          value={user?.email || ""}
        />
        <InputLabel className="input-font-size" htmlFor="nickName">
          닉네임
        </InputLabel>
        <OutlinedInput
          className="output-style"
          id="nickName"
          name="nickName"
          disabled
          value={user?.nickName || ""}
        />
        <InputLabel className="input-font-size" htmlFor="contactNumber">
          휴대폰 번호
        </InputLabel>
        <OutlinedInput
          className="output-style"
          id="contactNumber"
          name="contactNumber"
          disabled
          value={user?.contactNumber || ""}
        />
        <InputLabel className="input-font-size" htmlFor="address">
          주소
        </InputLabel>
        <OutlinedInput
          className="output-style"
          id="address"
          name="address"
          disabled
          value={userAddress?.address || ""}
        />
        <InputLabel className="input-font-size" htmlFor="zipNo">
          우편번호
        </InputLabel>
        <OutlinedInput
          className="output-style"
          id="zipNo"
          name="zipCode"
          disabled
          value={userAddress?.zipCode || ""}
        />
        <InputLabel className="input-font-size" htmlFor="addrDetail">
          상세주소
        </InputLabel>
        <OutlinedInput
          className="output-style"
          id="addrDetail"
          name="addressDetail"
          disabled
          value={userAddress?.addressDetail || ""}
        />
        <Button variant="outlined" onClick={handleEditClick}>
          회원정보 수정
        </Button>
        <Button variant="outlined" onClick={handleWithdrawalClick}>
          회원 탈퇴
        </Button>
        <Button variant="outlined" onClick={handleCancelClick}>
          돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default MyPage;

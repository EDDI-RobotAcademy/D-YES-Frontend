import React, { useEffect, useState } from "react";
import { Box, Button, Container, InputLabel, OutlinedInput } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserMyPage } from "../api/UserApi";
import { getImageUrl } from "utility/s3/awsS3";
import { User } from "page/user/entity/User";
import AddressPopup from "./AddressPopup";
import { toast } from "react-toastify";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken") || "";
  const hasFetchedRef = React.useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
    if (userToken.includes("admin")) {
      return toast.error("관리자는 회원 탈퇴할 수 없습니다.");
    } else {
      navigate("/withdrawal");
    }
  };

  // const handleCancelClick = () => {
  //   queryClient.invalidateQueries("user");
  //   navigate("/");
  // };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setImageLoaded(true);
    }, 700);
  }, [user?.profileImg]);

  const handleAddressClick = () => {
    // 주소 설정 버튼을 클릭하면 팝업을 엽니다.
    setIsPopupOpen(true);
  };

  return (
    <Container className="mypage-container">
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <h1 className="class-h1">회원정보</h1>
        <div className="content-align">
          <div className="profile-image-container">
            {imageLoaded && (
              <div className="profile-image">
                <img
                  onLoad={handleImageLoad}
                  src={
                    // 기본 이미지인 경우 그대로 사용(url 형식), 변경된 이미지인 경우 S3에서
                    user?.profileImg && user?.profileImg.includes("://")
                      ? user?.profileImg
                      : getImageUrl(user?.profileImg || "")
                  }
                  key={user?.profileImg}
                  style={{
                    width: "100%", // 이미지의 가로 크기를 100%로 설정하여 원 안에 꽉 차도록 표시
                    height: "100%", // 이미지의 세로 크기를 100%로 설정하여 원 안에 꽉 차도록 표시
                    objectFit: "cover", // 이미지가 원 안에 가득 차도록 표시
                    position: "absolute", // 이미지의 위치 조정을 위해 position 사용
                    top: 0, // 이미지를 원안의 상단에 배치
                    left: 0, // 이미지를 원안의 왼쪽에 배치
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
          className="output-style no-border"
          id="email"
          name="email"
          readOnly
          value={user?.email || ""}
        />
        <InputLabel className="input-font-size" htmlFor="nickName">
          닉네임
        </InputLabel>
        <OutlinedInput
          className="output-style no-border"
          id="nickName"
          name="nickName"
          readOnly
          value={user?.nickName || ""}
        />
        <InputLabel className="input-font-size" htmlFor="contactNumber">
          휴대폰 번호
        </InputLabel>
        <OutlinedInput
          className="output-style no-border"
          id="contactNumber"
          name="contactNumber"
          readOnly
          value={user?.contactNumber || ""}
        />
        <InputLabel className="input-font-size" htmlFor="address">
          주소
        </InputLabel>
        <OutlinedInput
          className="output-style no-border"
          id="address"
          name="address"
          readOnly
          value={userAddress?.address || ""}
        />
        <InputLabel className="input-font-size" htmlFor="zipNo">
          우편번호
        </InputLabel>
        <OutlinedInput
          className="output-style no-border"
          id="zipNo"
          name="zipCode"
          readOnly
          value={userAddress?.zipCode || ""}
        />
        <InputLabel className="input-font-size" htmlFor="addrDetail">
          상세주소
        </InputLabel>
        <OutlinedInput
          className="output-style no-border"
          id="addrDetail"
          name="addressDetail"
          readOnly
          value={userAddress?.addressDetail || ""}
        />
        <Button className="mypage-btn" onClick={handleEditClick}>
          수정하기
        </Button>
        <Button className="mypage-btn" onClick={handleAddressClick}>
          배송지 설정
        </Button>
        {/* <Button className="mypage-btn" onClick={handleCancelClick}>
          돌아가기
        </Button> */}
        <Button className="withdrawal-btn" onClick={handleWithdrawalClick}>
          회원탈퇴
        </Button>
      </Box>
      <AddressPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </Container>
  );
};

export default MyPage;

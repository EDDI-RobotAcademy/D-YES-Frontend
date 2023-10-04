import { Box, Button, Container, IconButton, InputLabel, TextField } from "@mui/material";
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
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { useDropzone } from "react-dropzone";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { compressImgForProfile } from "utility/s3/imageCompression";
import { useAuth } from "layout/navigation/AuthConText";

import "./css/MyPage.css";

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
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();
  const queryClient = useQueryClient();
  const { userId } = useParams<RouterParams>();
  const { data: user } = useUserQuery();
  const [email, setEmail] = useState(user?.email || "");
  const [nickName, setNickName] = useState(user?.nickName || "");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || "");
  const [profileImg, setProfileImg] = useState(user?.profileImg || "");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [checkedEmailDuplicated, setCheckedEmailDuplicated] = useState<boolean>(true);
  const [checkedNickNameDuplicated, setCheckedNickNameDuplicated] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

  const onDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length > 0) {
      try {
        const compressedImage = await compressImgForProfile(acceptedFile[0]);
        setSelectedImage(compressedImage);
        localStorage.setItem("encodedProfileImg", compressedImage.name);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const [userAddress, setUserAddress] = useState({
    address: user?.address || "",
    zipCode: user?.zipCode || "",
    addressDetail: user?.addressDetail || "",
  });

  useEffect(() => {
    if (location.state) {
      // 프로필 사진 업데이트
      if (location.state.userProfileImg) {
        setProfileImg(location.state.userProfileImg);
      }

      // 주소 정보 업데이트
      if (location.state.userAddress) {
        setUserAddress(location.state.userAddress);
      }

      // 이메일 정보 업데이트
      if (location.state.userEmail) {
        setEmail(location.state.userEmail);
      }

      // 닉네임 정보 업데이트
      if (location.state.userNickName) {
        setNickName(location.state.userNickName);
      }

      // 휴대폰 번호 정보 업데이트
      if (location.state.userContactNumber) {
        setContactNumber(location.state.userContactNumber);
      }
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

        localStorage.setItem("address", data.address);
        localStorage.setItem("zipCode", data.zonecode);
        localStorage.getItem("addressDetail");
        document.getElementById("addrDetail")?.focus();
      },
    }).open();
  };

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const handleDuplicateCheck = async () => {
    if (!email.match(emailRegex)) {
      setIsEmailValid(false);
      toast.error("유효한 이메일 형식이 아닙니다.");
      return;
    }

    // 이메일 중복 여부 확인
    const isDuplicate = await checkEmailDuplicate(email);
    if (isDuplicate) {
      setCheckedEmailDuplicated(true);
      toast.success("사용 가능한 이메일입니다.");
    } else {
      setCheckedEmailDuplicated(false);
      toast.error("중복된 이메일입니다.");
    }
  };

  // 닉네임 중복 여부 확인
  const handleDuplicateNicknameCheck = async () => {
    const isDuplicate = await checkNicknameDuplicate(nickName);
    if (isDuplicate) {
      setCheckedNickNameDuplicated(true);
      toast.success("사용 가능한 닉네임입니다.");
    } else {
      setCheckedNickNameDuplicated(false);
      toast.error("중복된 닉네임입니다.");
    }
  };

  const handleContactNumber = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    let formattedPhoneNumber = value.replace(/[^0-9]/g, ""); // 숫자 이외의 문자 제거
    formattedPhoneNumber = formattedPhoneNumber.slice(0, 11); // 11자리까지만 유지
    if (formattedPhoneNumber.length === 11) {
      formattedPhoneNumber = `${formattedPhoneNumber.slice(0, 3)}-${formattedPhoneNumber.slice(
        3,
        7
      )}-${formattedPhoneNumber.slice(7)}`;
    }
    setContactNumber(formattedPhoneNumber);
  };

  useEffect(() => {
    // 입력데이터 유지
    // localStorage에서 저장된 데이터 불러오기
    const savedImg = localStorage.getItem("encodedProfileImg");
    const savedEmail = localStorage.getItem("email");
    const savedNickName = localStorage.getItem("encodedNickName");
    const savedContactNumber = localStorage.getItem("contactNumber");
    const savedAddress = localStorage.getItem("address");
    const savedZipCode = localStorage.getItem("zipCode");
    const savedAddressDetail = localStorage.getItem("addressDetail");

    // 불러온 데이터가 있다면 해당 데이터를 상태에 적용
    if (savedImg) {
      setProfileImg(savedImg);
    }
    if (savedEmail) {
      setEmail(savedEmail);
    }
    if (savedNickName) {
      setNickName(savedNickName);
    }
    if (savedContactNumber) {
      setContactNumber(savedContactNumber);
    }
    if (savedAddress) {
      setUserAddress((prev) => ({
        ...prev,
        address: savedAddress,
      }));
    }
    if (savedZipCode) {
      setUserAddress((prev) => ({
        ...prev,
        zipCode: savedZipCode,
      }));
    }
    if (savedAddressDetail) {
      setUserAddress((prev) => ({
        ...prev,
        addressDetail: savedAddressDetail,
      }));
    }
  }, []);

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

  const removeLocalStorageItems = () => {
    localStorage.removeItem("profileImg");
    localStorage.removeItem("email");
    localStorage.removeItem("contactNumber");
    localStorage.removeItem("address");
    localStorage.removeItem("zipCode");
    localStorage.removeItem("addressDetail");
  };

  useEffect(() => {
    setCheckedEmailDuplicated(email === user?.email || email === "");
    setCheckedNickNameDuplicated(nickName === user?.nickName || nickName === "");
  }, [email, nickName, user]);

  const handleEditFinishClick = async () => {
    // console.log("이메일 중복 확인 됐니?: " + checkedEmailDuplicated);
    // console.log("닉네임 중복 확인 됐니?: " + checkedNickNameDuplicated);
    // console.log("@ . 포함하는 이메일이니?: " + isEmailValid);
    // console.log("이메일 공백이니: " + (email === ""));
    // console.log("닉네임 공백이니: " + (nickName === ""));

    if (
      checkedEmailDuplicated === false ||
      checkedNickNameDuplicated === false ||
      isEmailValid === false
    ) {
      toast.error("이메일 혹은 닉네임을 확인해주세요.");
      return;
    }
    // 선택한 이미지가 있다면 File을, 아니면 ""
    const fileToUpload = selectedImage ? new File([selectedImage], selectedImage.name) : "";

    // 선택한 이미지가 있으면 S3에 업로드.
    // 리턴받은 버전 정보를 s3ObjectVersion에 저장
    let s3ObjectVersion = "";

    if (fileToUpload) {
      s3ObjectVersion = (await uploadFileAwsS3(fileToUpload)) || "";
    }

    try {
      const updatedData: any = {
        userId,
        userToken,
        email,
        nickName,
        profileImg: selectedImage
          ? selectedImage.name + "?versionId=" + s3ObjectVersion
          : user?.profileImg || "",
        contactNumber,
        ...userAddress,
      };
      // console.log("변경된 이미지 타입 확인", typeof selectedImage);
      // console.log("변경된 이미지 확인", selectedImage?.name);

      await mutation.mutateAsync(updatedData);

      queryClient.invalidateQueries(["user", userId]);
      // console.log("확인", updatedData);
      navigate("/myPage");

      removeLocalStorageItems();
    } catch (error) {
      if ((error as AxiosError).response && (error as AxiosError).response?.status === 400) {
        toast.error("페이지를 찾을 수 없습니다.");
      } else {
        toast.error("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCancelClick = () => {
    removeLocalStorageItems();
    navigate("/myPage");
  };

  useEffect(() => {
    return () => {
      removeLocalStorageItems();
    };
  }, []);

  return (
    <Container className="mypage-container">
      <Box display="flex" flexDirection="column" gap={1} p={2}>
        <h1 className="class-h1">회원정보 수정</h1>
        {/* <p>프로필 이미지</p> */}
        <div className="content-align">
          <div
            className="profile-image-container"
            style={{ cursor: "pointer" }}
            {...getRootProps()}
          >
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                style={{
                  width: "100%", // 이미지의 가로 크기를 100%로 설정하여 원 안에 꽉 차도록 표시
                  height: "100%", // 이미지의 세로 크기를 100%로 설정하여 원 안에 꽉 차도록 표시
                  objectFit: "cover", // 이미지가 원 안에 가득 차도록 표시
                  position: "absolute", // 이미지의 위치 조정을 위해 position 사용
                  top: 0, // 이미지를 원안의 상단에 배치
                  left: 0, // 이미지를 원안의 왼쪽에 배치
                }}
              />
            ) : (
              <div className="profile-image">
                <img
                  src={
                    profileImg && profileImg.includes("://") ? profileImg : getImageUrl(profileImg)
                  }
                  style={{
                    width: "100%", // 이미지의 가로 크기를 100%로 설정하여 원 안에 꽉 차도록 표시
                    height: "100%", // 이미지의 세로 크기를 100%로 설정하여 원 안에 꽉 차도록 표시
                    objectFit: "cover", // 이미지가 원 안에 가득 차도록 표시
                    position: "absolute", // 이미지의 위치 조정을 위해 position 사용
                    top: 0, // 이미지를 원안의 상단에 배치
                    left: 0, // 이미지를 원안의 왼쪽에 배치
                  }}
                  alt=""
                />
              </div>
            )}
            <input {...getInputProps()} />
            <span style={{ position: "absolute" }}>
              <IconButton aria-label="Add" component="span">
                <AddAPhotoOutlinedIcon fontSize="large" />
              </IconButton>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <InputLabel htmlFor="email" shrink>
            이메일
          </InputLabel>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TextField
              className="mypage-text-field"
              id="email"
              fullWidth
              variant="outlined"
              sx={{ width: "300px", marginBottom: "16px" }}
              value={email}
              inputProps={{
                style: {
                  fontFamily: "SUIT-light",
                },
              }}
              onChange={(event) => {
                if (event.target.value === "") {
                  setCheckedEmailDuplicated(true);
                }
                setEmail(event.target.value);
                localStorage.setItem("email", event.target.value);
              }}
            />
            <Button
              className={`mapage-btn ${
                email === user?.email && checkedEmailDuplicated
                  ? "gray-border-btn"
                  : "orange-border-btn"
              }`}
              variant="outlined"
              onClick={handleDuplicateCheck}
              style={{
                fontSize: "14px",
                height: "56px",
                padding: "0 26px",
                marginBottom: "16px",
              }}
              disabled={email === user?.email && checkedEmailDuplicated}
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
              className="mypage-text-field"
              id="nickname"
              fullWidth
              variant="outlined"
              sx={{ width: "300px", marginBottom: "16px" }}
              value={nickName}
              inputProps={{
                style: {
                  fontFamily: "SUIT-light",
                },
              }}
              onChange={(event) => {
                if (event.target.value === "") {
                  setCheckedNickNameDuplicated(true);
                }
                setNickName(event.target.value);
                localStorage.setItem("encodedNickName", event.target.value);
              }}
            />
            <Button
              className={`mapage-btn ${
                nickName === user?.nickName && checkedNickNameDuplicated
                  ? "gray-border-btn"
                  : "orange-border-btn"
              }`}
              variant="outlined"
              onClick={handleDuplicateNicknameCheck}
              style={{ fontSize: "14px", height: "56px", padding: "0 26px" }}
              disabled={nickName === user?.nickName && checkedNickNameDuplicated}
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
            className="zip-text-field"
            id="contactNumber"
            fullWidth
            variant="outlined"
            sx={{ paddingTop: "24px", marginBottom: "16px" }}
            value={contactNumber}
            InputProps={{
              style: {
                backgroundColor: "rgb(250, 250, 250)",
                fontFamily: "SUIT-light",
              },
            }}
            onChange={(event) => {
              setContactNumber(event.target.value);
              handleContactNumber(event);
              localStorage.setItem("contactNumber", event.target.value);
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <InputLabel htmlFor="addr" shrink>
            주소
          </InputLabel>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <TextField
              className="mypage-text-field"
              id="addr"
              fullWidth
              variant="outlined"
              sx={{ width: "300px", marginBottom: "16px" }}
              value={userAddress.address}
              InputProps={{
                onClick: onClickAddr,
                style: {
                  fontFamily: "SUIT-light",
                },
              }}
            />
            <Button
              className="mapage-btn"
              variant="outlined"
              onClick={onClickAddr}
              style={{
                fontSize: "14px",
                color: "orange",
                height: "56px",
                padding: "0 40px",
                borderColor: "orange",
              }}
            >
              검색
            </Button>
          </div>
        </div>
        <div>
          <InputLabel htmlFor="zipNo" shrink style={{ position: "absolute" }} className="zip-label">
            우편번호
          </InputLabel>
          <TextField
            className="zip-text-field"
            id="zipNo"
            fullWidth
            variant="outlined"
            sx={{ paddingTop: "24px", marginBottom: "16px" }}
            value={userAddress.zipCode}
            InputProps={{
              style: {
                backgroundColor: "rgb(250, 250, 250)",
                fontFamily: "SUIT-light",
              },
            }}
          />
        </div>
        <div>
          <InputLabel htmlFor="addressDetail" shrink style={{ position: "absolute" }}>
            상세주소
          </InputLabel>
          <TextField
            className="zip-text-field"
            id="addressDetail"
            fullWidth
            variant="outlined"
            sx={{ paddingTop: "24px", marginBottom: "16px" }}
            value={userAddress.addressDetail}
            InputProps={{
              style: {
                backgroundColor: "rgb(250, 250, 250)",
                fontFamily: "SUIT-light",
              },
            }}
            onChange={(event) => {
              setUserAddress((prev) => ({ ...prev, addressDetail: event.target.value }));
              localStorage.setItem("addressDetail", event.target.value);
            }}
          />
        </div>
        <Button className="mypage-btn" onClick={handleEditFinishClick}>
          수정완료
        </Button>
        <Button className="mypage-btn" onClick={handleCancelClick}>
          취소
        </Button>
      </Box>
    </Container>
  );
};

export default MyPageUpdate;

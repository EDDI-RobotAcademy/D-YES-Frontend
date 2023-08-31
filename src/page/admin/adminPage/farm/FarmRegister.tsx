import {
  Container,
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  SelectChangeEvent,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { farmRegister } from "page/admin/api/AdminApi";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "./css/FarmRegister.css";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { uploadFileAwsS3 } from "utility/s3/awsS3";

declare global {
  interface Window {
    daum: any;
  }
}

interface IAddr {
  address: string;
  zonecode: string;
}

const FarmRegister = () => {
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [addressInfo, setAddressInfo] = useState({ address: "", zipCode: "" });
  const initialAddressInfo = { address: "", zipCode: "" };
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessNumber: "",
    representativeName: "",
    representativeContactNumber: "",
    farmName: "",
    csContactNumber: "",
    addressDetail: "",
    introduction: "",
  });

  const handleRegistrationComplete = () => {
    setBusinessInfo({
      businessName: "",
      businessNumber: "",
      representativeName: "",
      representativeContactNumber: "",
      farmName: "",
      csContactNumber: "",
      addressDetail: "",
      introduction: "",
    });
    setSelectedOptions([]);
    setSelectedMainImage(null);
    setAddressInfo(initialAddressInfo);
  };

  // 사업자 번호
  const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    if (cleanedValue.length <= 10) {
      const formattedValue = cleanedValue.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
      setBusinessInfo((prev) => ({
        ...prev,
        businessNumber: formattedValue,
      }));
    }
  };

  // 연락처
  const handleContactNumberChange =
    (fieldName: "representativeContactNumber" | "csContactNumber") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const cleanedValue = value.replace(/[^0-9]/g, "");
      if (cleanedValue.length <= 11) {
        const formattedValue = cleanedValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        setBusinessInfo((prev) => ({
          ...prev,
          [fieldName]: formattedValue,
        }));
      }
    };

  const mutation = useMutation(farmRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("farm", data);
      console.log("확인", data);
      toast.success("등록되었습니다.");
    },
  });

  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (data: IAddr) {
        setAddressInfo({
          address: data.address,
          zipCode: data.zonecode,
        });

        document.getElementById("addrDetail")?.focus();
      },
    }).open();
  };

  const options = [
    { value: "POTATO", label: "감자" },
    { value: "SWEET_POTATO", label: "고구마" },
    { value: "CABBAGE", label: "양배추" },
    { value: "KIMCHI_CABBAGE", label: "배추" },
    { value: "LEAF_LETTUCE", label: "상추" },
    { value: "ROMAINE_LETTUCE", label: "로메인 상추" },
    { value: "PEPPER", label: "고추" },
    { value: "GARLIC", label: "마늘" },
    { value: "TOMATO", label: "토마토" },
    { value: "CUCUMBER", label: "오이" },
    { value: "CARROT", label: "당근" },
    { value: "EGGPLANT", label: "가지" },
  ];

  const handleSelectChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
    const selectedValue = event.target.value as string[];
    setSelectedOptions(selectedValue);
    setIsSelectOpen(selectedValue.length === 0);
  };

  const handleSelectOpen = () => {
    setIsSelectOpen(true);
  };

  const handleSelectClose = () => {
    setIsSelectOpen(false);
  };

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setSelectedMainImage(compressedImage);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps, getInputProps: mainImageInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const mainFileToUpload = selectedMainImage
      ? new File([selectedMainImage], selectedMainImage.name)
      : "";
    if (!mainFileToUpload) {
      toast.error("농가 이미지를 등록해주세요");
      return;
    }

    const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

    const mainImageNameWithVersion = mainFileToUpload
      ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
      : "undefined main image";

    const target = event.target as typeof event.target & {
      elements: {
        businessName: { value: string };
        businessNumber: { value: string };
        representativeName: { value: string };
        representativeContactNumber: { value: string };
        farmName: { value: string };
        csContactNumber: { value: string };
        address: { value: string };
        zipCode: { value: string };
        addressDetail: { value: string };
        mainImage: { value: string };
        introduction: { value: string };
        produceTypes: { value: string[] };
      };
    };

    const selectedOptionsValues = selectedOptions.map((option) => option);

    const {
      businessName,
      businessNumber,
      representativeName,
      representativeContactNumber,
      farmName,
      csContactNumber,
      address,
      zipCode,
      addressDetail,
      introduction,
    } = target.elements;

    const data = {
      businessName: businessName.value,
      businessNumber: businessNumber.value,
      representativeName: representativeName.value,
      representativeContactNumber: representativeContactNumber.value,
      farmName: farmName.value,
      csContactNumber: csContactNumber.value,
      address: address.value,
      zipCode: zipCode.value,
      addressDetail: addressDetail.value,
      mainImage: mainImageNameWithVersion,
      introduction: introduction.value,
      produceTypes: selectedOptionsValues,
      userToken: userToken || "",
    };
    const { produceTypes } = target.elements;

    if (
      !businessName.value ||
      !businessNumber.value ||
      !representativeName.value ||
      !representativeContactNumber.value ||
      !farmName.value ||
      !csContactNumber.value ||
      !address.value ||
      !zipCode.value ||
      !addressDetail.value ||
      !introduction.value ||
      produceTypes.value.length === 0
    ) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    await mutation.mutateAsync(data);

    handleRegistrationComplete();
  };

  return (
    <div>
      <div className="register-menu">
        <img className="farm-register-icon" alt="농가 등록" src="img/farm-register-icon.png" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            gutterBottom
            style={{
              fontSize: "16px",
              fontFamily: "SUIT-Medium",
              color: "#252525",
              marginBottom: "0px",
            }}
          >
            농가(사업자) 등록
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontSize: "12px",
              fontFamily: "SUIT-Regular",
              color: "#252525",
            }}
          >
            * 사업자 등록증에 있는 정보를 작성해주세요
          </Typography>
        </div>
      </div>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        paddingTop="20px" // 위쪽 패딩 값
        paddingBottom="50px" // 아래쪽 패딩 값
        bgcolor="white" // 하얀색 백그라운드 컬러
        border="solid 1px lightgray"
        paddingLeft="10px"
        paddingRight="10px"
      >
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <Typography
                gutterBottom
                style={{
                  color: "black",
                  padding: "10px 10px 0px 0px",
                  marginBottom: "-6px",
                  fontSize: "15px",
                  fontFamily: "SUIT-Medium",
                  height: "32px",
                  alignItems: "center",
                }}
              >
                | 사업자 정보
              </Typography>
              <Typography
                gutterBottom
                sx={{
                  color: "black",
                  padding: "0px 10px 0px 0px",
                  fontSize: "13px",
                  fontFamily: "SUIT-Light",
                }}
              >
                법인 사업자 정보를 입력하세요
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="상호명*"
                  name="businessName"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.businessName}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="사업자 등록 번호*"
                  name="businessNumber"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.businessNumber}
                  onChange={handleBusinessNumberChange}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="대표자명*"
                  name="representativeName"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.representativeName}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      representativeName: e.target.value,
                    }))
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative", marginBottom: "28px" }}>
                <TextField
                  label="대표자 연락처*"
                  name="representativeContactNumber"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.representativeContactNumber}
                  onChange={handleContactNumberChange("representativeContactNumber")}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography
                gutterBottom
                style={{
                  color: "black",
                  padding: "10px 10px 0px 0px",
                  marginBottom: "-6px",
                  fontSize: "15px",
                  fontFamily: "SUIT-Medium",
                  height: "32px",
                  alignItems: "center",
                }}
              >
                | 농가 정보
              </Typography>
              <Typography
                gutterBottom
                sx={{
                  color: "black",
                  padding: "0px 10px 0px 0px",
                  fontSize: "13px",
                  fontFamily: "SUIT-Light",
                }}
              >
                상품 판매에 사용할 농가 정보를 입력하세요
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="이름*"
                  name="farmName"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.farmName}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      farmName: e.target.value,
                    }))
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="고객센터 연락처*"
                  name="csContactNumber"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.csContactNumber}
                  onChange={handleContactNumberChange("csContactNumber")}
                />
              </div>
            </Grid>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="주소*"
                id="addr"
                name="address"
                fullWidth
                variant="outlined"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
                value={addressInfo.address}
              />
              <Button
                className="mapage-btn"
                variant="outlined"
                onClick={onClickAddr}
                style={{
                  marginLeft: "8px",
                  marginTop: "8px",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  fontFamily: "SUIT-Light",
                  backgroundColor: "#4F72CA",
                  color: "white",
                }}
              >
                검색
              </Button>
            </div>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="우편번호*"
                  id="zipNo"
                  name="zipCode"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={addressInfo.zipCode}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="상세주소*"
                  name="addressDetail"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.addressDetail}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      addressDetail: e.target.value,
                    }))
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "400px",
                    backgroundColor: "#e4e4e4",
                    cursor: "pointer",
                  }}
                  {...mainImageRootProps()}
                >
                  {selectedMainImage ? (
                    <img
                      // 선택된 사진이 있으면 미리보기
                      src={URL.createObjectURL(selectedMainImage)}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        cursor: "pointer",
                      }}
                      alt="Selected"
                    />
                  ) : (
                    <div style={{ textAlign: "center", fontFamily: "SUIT-Light" }}>
                      <img
                        className="upload-icon"
                        alt="이미지 업로드"
                        src="img/upload-icon.png"
                        width={40}
                      />
                      <div>클릭하여 이미지를 추가해주세요</div>
                      <input {...mainImageInputProps()} />
                    </div>
                  )}
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="농가 한 줄 소개"
                  name="introduction"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  value={businessInfo.introduction}
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      introduction: e.target.value,
                    }))
                  }
                />
              </div>
            </Grid>
            <FormControl fullWidth>
              <Grid item xs={12}>
                <div style={{ position: "relative", paddingBottom: "8px" }}>
                  {selectedOptions.length === 0 && (
                    <InputLabel
                      id="demo-simple-select-label"
                      style={{ position: "absolute", fontFamily: "SUIT-Regular" }}
                    >
                      판매할 품목을 선택해주세요 (필수)
                    </InputLabel>
                  )}
                  <Select
                    labelId="demo-simple-select-label"
                    name="produceTypes"
                    fullWidth
                    multiple
                    value={selectedOptions}
                    open={isSelectOpen}
                    onClose={handleSelectClose}
                    onOpen={handleSelectOpen}
                    onChange={handleSelectChange}
                    style={{ fontFamily: "SUIT-Regular" }}
                  >
                    {options.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        style={{ fontFamily: "SUIT-Regular" }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </Grid>
            </FormControl>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#DF726D",
                  color: "white",
                  fontFamily: "SUIT-Regular",
                  fontSize: "14px",
                  marginTop: "12px",
                }}
                fullWidth
              >
                등록
              </Button>
            </Grid>
          </form>
        </Container>
      </Box>
    </div>
  );
};

export default FarmRegister;

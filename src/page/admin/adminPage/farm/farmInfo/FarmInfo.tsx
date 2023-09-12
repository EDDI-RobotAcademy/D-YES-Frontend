import React, { useState } from "react";
import {
  Select,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import useFarmStore from "store/farm/FarmStore";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { getImageUrl } from "utility/s3/awsS3";

declare global {
  interface Window {
    daum: any;
  }
}

interface IAddr {
  address: string;
  zonecode: string;
}

const FarmInfo = () => {
  const { farms, setFarms } = useFarmStore();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handlerFarmNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFarmName = event.target.value;
    setFarms({ ...farms, farmName: newFarmName });
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    if (cleanedValue.length <= 11) {
      const formattedValue = cleanedValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      setFarms({ ...farms, csContactNumber: formattedValue });
    }
  };

  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (data: IAddr) {
        setFarms({
          ...farms,
          farmAddress: {
            ...farms.farmAddress,
            address: data.address,
            zipCode: data.zonecode,
          },
        });

        document.getElementById("addrDetail")?.focus();
      },
    }).open();
  };

  const handlerAddressInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAddressDetail = event.target.value;
    setFarms({
      ...farms,
      farmAddress: {
        ...farms.farmAddress,
        addressDetail: newAddressDetail,
      },
    });
  };

  const handlerIntroductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIntroduction = event.target.value;
    setFarms({ ...farms, introduction: newIntroduction });
  };

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setSelectedMainImage(compressedImage);
        setFarms({ ...farms, mainImage: compressedImage.name });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps, getInputProps: mainImageInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
  });

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
    setFarms({ ...farms, produceTypes: selectedValue });
  };

  const handleSelectOpen = () => {
    setIsSelectOpen(true);
  };

  const handleSelectClose = () => {
    setIsSelectOpen(false);
  };

  return (
    <Container maxWidth="sm">
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
            value={farms.farmName}
            onChange={handlerFarmNameChange}
            // disabled={!!selectedFarm}
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
            value={farms.csContactNumber}
            onChange={handleContactNumberChange}
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
          value={farms?.farmAddress?.address || ""}
          onChange={handlerAddressInfoChange}
          //   disabled={!!selectedFarm}
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
          //   disabled={!!selectedFarm}
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
            value={farms?.farmAddress?.zipCode || ""}
            onChange={handlerAddressInfoChange}
            // disabled={!!selectedFarm}
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
            value={farms?.farmAddress?.addressDetail}
            onChange={handlerAddressInfoChange}
            // disabled={!!selectedFarm}
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
            ) : farms.mainImage ? (
              <div>
                <img
                  src={getImageUrl(farms.mainImage.replace(/\?versionId=.+$/, ''))}
                  style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                  alt="Selected"
                />
              </div>
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
            label="농가 한 줄 소개*"
            name="introduction"
            fullWidth
            variant="outlined"
            margin="normal"
            className="custom-input"
            InputLabelProps={{ shrink: true }}
            value={farms.introduction}
            onChange={handlerIntroductionChange}
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
              value={farms.produceTypes || []}
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
    </Container>
  );
};

export default FarmInfo;

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

  const [addressInfo, setAddressInfo] = useState({ address: "", zipCode: "" });

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      elements: {
        businessName: { value: string };
        businessNumber: { value: string };
        representativeName: { value: string };
        representativeContactNumber: { value: string };
        farmName: { value: string };
        CSContactNumber: { value: string };
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
      CSContactNumber,
      address,
      zipCode,
      addressDetail,
      mainImage,
      introduction,
    } = target.elements;

    const data = {
      businessName: businessName.value,
      businessNumber: businessNumber.value,
      representativeName: representativeName.value,
      representativeContactNumber: representativeContactNumber.value,
      farmName: farmName.value,
      CSContactNumber: CSContactNumber.value,
      address: address.value,
      zipCode: zipCode.value,
      addressDetail: addressDetail.value,
      mainImage: mainImage.value,
      introduction: introduction.value,
      produceTypes: selectedOptionsValues,
      userToken: userToken || "",
    };

    await mutation.mutateAsync(data);
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="xs">
        <Typography gutterBottom style={{ fontSize: "20px" }}>
          농가(사업자) 등록
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <Typography
              gutterBottom
              style={{ backgroundColor: "lightgray", padding: "10px", fontSize: "15px" }}
            >
              사업자 정보
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="상호명"
                name="businessName"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="사업자 등록 번호"
                name="businessNumber"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="대표자명"
                name="representativeName"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="대표자 연락처"
                name="representativeContactNumber"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography
              gutterBottom
              style={{ backgroundColor: "lightgray", padding: "10px", fontSize: "15px" }}
            >
              농가 정보
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="농가 이름"
                name="farmName"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="고객센터 연락처"
                name="CSContactNumber"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="농가 주소"
                id="addr"
                name="address"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
                value={addressInfo.address}
              />
            </div>
          </Grid>
          <Button
            className="mapage-btn"
            variant="outlined"
            onClick={onClickAddr}
            // style={{
            //   fontSize: "14px",
            //   color: "orange",
            //   height: "56px",
            //   padding: "0 40px",
            //   borderColor: "orange",
            // }}
          >
            검색
          </Button>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="농가 우편번호"
                id="zipNo"
                name="zipCode"
                fullWidth
                variant="filled"
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
                label="농가 상세주소"
                name="addressDetail"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="농가 사진"
                name="mainImage"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <TextField
                label="농가 소개"
                name="introduction"
                fullWidth
                variant="filled"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </Grid>
          <FormControl fullWidth>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                {selectedOptions.length === 0 && (
                  <InputLabel id="demo-simple-select-label" style={{ position: "absolute" }}>
                    판매할 상품을 선택해주세요
                  </InputLabel>
                )}{" "}
                <Select
                  labelId="demo-simple-select-label"
                  name="produceTypes"
                  fullWidth
                  variant="filled"
                  value={selectedOptions}
                  open={isSelectOpen}
                  onClose={handleSelectClose}
                  onOpen={handleSelectOpen}
                  multiple
                  onChange={handleSelectChange}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
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
              style={{ backgroundColor: "green", color: "white" }}
              fullWidth
            >
              등록
            </Button>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default FarmRegister;

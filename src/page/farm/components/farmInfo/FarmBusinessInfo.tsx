import { Container, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import useFarmBusinessReadStore from "page/farm/store/FarmBusinessReadWtore";
import useFarmBusinessStore from "page/farm/store/FarmBusinessStore";

const FarmBusinessInfo = () => {
  const { business, setBusiness } = useFarmBusinessStore();
  const { businessRead } = useFarmBusinessReadStore();

  const handlerBusinessNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBusinessNameChange = event.target.value;
    setBusiness({ ...business, businessName: newBusinessNameChange });
  };

  const handlerRepresentativeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRepresentativeName = event.target.value;
    setBusiness({ ...business, representativeName: newRepresentativeName });
  };

  const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    if (cleanedValue.length <= 10) {
      const formattedValue = cleanedValue.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
      setBusiness({ ...business, businessNumber: formattedValue });
    }
  };
  // 연락처
  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    if (cleanedValue.length <= 11) {
      const formattedValue = cleanedValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      setBusiness({ ...business, representativeContactNumber: formattedValue });
    }
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
            value={businessRead.businessName ? businessRead.businessName : business.businessName}
            onChange={handlerBusinessNameChange}
            disabled={!!businessRead.businessName}
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
            value={
              businessRead.businessNumber ? businessRead.businessNumber : business.businessNumber
            }
            onChange={handleBusinessNumberChange}
            disabled={!!businessRead.businessNumber}
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
            value={
              businessRead.representativeName
                ? businessRead.representativeName
                : business.representativeName
            }
            onChange={handlerRepresentativeNameChange}
            disabled={!!businessRead.representativeName}
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
            value={
              businessRead.representativeContactNumber
                ? businessRead.representativeContactNumber
                : business.representativeContactNumber
            }
            onChange={handleContactNumberChange}
            disabled={!!businessRead.representativeContactNumber}
          />
        </div>
      </Grid>
    </Container>
  );
};

export default FarmBusinessInfo;

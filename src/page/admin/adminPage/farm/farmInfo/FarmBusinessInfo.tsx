import { Container, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import useFarmBusinessStore from "store/farm/FarmBusinessStore";

const FarmBusinessInfo = () => {
  const { business, setBusiness } = useFarmBusinessStore();

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
            value={business.businessName}
            onChange={handlerBusinessNameChange}
            //   disabled={!!selectedFarm}
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
            value={business.businessNumber}
            onChange={handleBusinessNumberChange}
            //   disabled={!!selectedFarm}
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
            value={business.representativeName}
            onChange={handlerRepresentativeNameChange}
            //   disabled={!!selectedFarm}
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
            value={business.representativeContactNumber}
            onChange={handleContactNumberChange}
            //   disabled={!!selectedFarm}
          />
        </div>
      </Grid>
    </Container>
  );
};

export default FarmBusinessInfo;

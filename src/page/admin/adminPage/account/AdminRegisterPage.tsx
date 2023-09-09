import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { adminRegister } from "../../api/AdminApi";
import { Container, Box, Grid, TextField, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";

import "./css/AdminRegisterPage.css";

const NormalAdminRegister = () => {
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");

  const mutation = useMutation(adminRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("admin", data);
      console.log("확인", data);
      toast.success("등록에 성공했습니다.");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      elements: {
        id: { value: string };
        name: { value: string };
      };
    };

    const { id, name } = target.elements;
    const data = {
      id: id.value,
      name: name.value,
      userToken: userToken || "",
    };

    await mutation.mutateAsync(data);
  };

  return (
    <div className="normal-admin-register-container">
      <div className="normal-admin-register-box">
        <Box
          display="flex"
          flexDirection="column"
          alignItems={"center"}
          justifyContent="center"
          height="100vh"
          width="100%"
        >
          <div className="normal-admin-register-form">
            <Container maxWidth="xs">
              <Typography
                gutterBottom
                sx={{ fontSize: "28px", fontFamily: "SUIT-ExtraBold", marginBottom: "0px" }}
              >
                관리자 등록
              </Typography>
              <Typography
                gutterBottom
                sx={{ fontSize: "14px", fontFamily: "SUIT-Light", paddingBottom: "20px" }}
              >
                관리자의 이름과 가입된 ID를 입력하세요
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div style={{ position: "relative" }}>
                      <TextField
                        label="이름"
                        name="name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        className="custom-input"
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ position: "relative" }}>
                      <TextField
                        label="id"
                        name="id"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        className="custom-input"
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      style={{ backgroundColor: "#252525", color: "white", height: "60px" }}
                      fullWidth
                    >
                      <Typography
                        gutterBottom
                        sx={{ fontSize: "16px", fontFamily: "SUIT-Regular" }}
                      >
                        등록
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Container>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default NormalAdminRegister;

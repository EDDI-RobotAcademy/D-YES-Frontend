import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { adminRegister } from "../api/AdminApi";
import { Container, Box, Grid, TextField, Typography, Button } from "@mui/material";
import "./css/AdminPage.css";
import { toast } from "react-toastify";

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
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minHeight="100vh"
      marginLeft={16}
    >
      <Container maxWidth="xs">
        <Typography variant="h4" gutterBottom>
          관리자 등록
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="이름"
                  name="name"
                  fullWidth
                  variant="filled"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="id"
                  name="id"
                  fullWidth
                  variant="filled"
                  margin="normal"
                  className="custom-input"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ disableUnderline: true }}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "black", color: "white" }}
                fullWidth
              >
                등록
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      {/* <Snackbar open={showLoginFailureSnackbar} autoHideDuration={5000} onClose={() => setShowLoginFailureSnackbar(false)}
        message="이메일과 비밀번호를 확인해주세요."
      /> */}
    </Box>
  );
};

export default NormalAdminRegister;

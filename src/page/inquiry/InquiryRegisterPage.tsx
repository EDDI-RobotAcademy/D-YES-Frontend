import {
  Box,
  Button,
  Container,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { inquiryRegister } from "./api/InquiryApi";
import useInquiryStore from "./store/InquiryStore";
import { InquiryRegisterRequest } from "./entity/InquiryRegisterRequest";
import { toast } from "react-toastify";
import { useAuth } from "layout/navigation/AuthConText";

import "./css/InquiryRegisterPage.css";

const InquiryRegisterPage = () => {
  const inquiryTypesOptions = [
    { value: "PURCHASE", label: "구매" },
    { value: "ACCOUNT", label: "회원" },
    { value: "REVIEW", label: "리뷰" },
    { value: "RECIPE", label: "레시피" },
    { value: "PRODUCT", label: "상품" },
    { value: "FARM", label: "농가" },
    { value: "EVENT", label: "이벤트" },
    { value: "ORDER", label: "주문" },
    { value: "ETC", label: "기타" },
  ];
  const { inquiry, setInquiry } = useInquiryStore();
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();
  const queryClient = useQueryClient();
  const mutation = useMutation(inquiryRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("inquiry", data);
      navigate("/");
    },
  });

  const handleContentChange = (newContent: string) => {
    setInquiry({ ...inquiry, content: newContent });
  };

  const handleTitleChange = (newTitle: string) => {
    setInquiry({ ...inquiry, title: newTitle });
  };

  const handleEmailChange = (newEmail: string) => {
    setInquiry({ ...inquiry, email: newEmail });
  };

  const handleInquiryTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedInquiryType = event.target.value as string;
    setInquiry({ ...inquiry, inquiryType: selectedInquiryType });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inquiry.title) {
      toast.error("문의 제목을 입력해주세요!");
      return;
    }

    if (!inquiry.email) {
      toast.error("답변 받으실 이메일을 입력해주세요!");
      return;
    }

    if (!inquiry.content) {
      toast.error("문의 내용을 입력해주세요!");
      return;
    }

    if (!inquiry.inquiryType) {
      toast.error("문의 유형을 선택해주세요!");
      return;
    }

    const data: InquiryRegisterRequest = {
      inquiryRegisterRequest: {
        userToken: localStorage.getItem("userToken") || "",
        email: inquiry.email,
        title: inquiry.title,
        content: inquiry.content,
        inquiryType: inquiry.inquiryType,
      },
    };

    await mutation.mutateAsync(data);
  };

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

  return (
    <div>
      <Container maxWidth="md" sx={{ marginTop: "2em" }}>
        <Typography>1:1 문의</Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <div className="inquiry-reg-info-container">
              <div className="inquiry-reg-info-grid">
                <div>
                  <p className="inquiry-reg-product-name">{}</p>
                  <p className="inquiry-reg-option-info"></p>
                </div>
              </div>
            </div>
            <TextField
              label="제목"
              name="title"
              value={inquiry.title}
              multiline
              minRows={1}
              maxRows={1}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => handleTitleChange(event.target.value)}
            />
            <TextField
              label="이메일"
              name="email"
              value={inquiry.email}
              multiline
              minRows={1}
              maxRows={1}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => handleEmailChange(event.target.value)}
            />
            <TextField
              select
              label="문의 유형"
              name="inquiryType"
              value={inquiry.inquiryType || ""}
              onChange={handleInquiryTypeChange} // 문의 유형 변경 핸들러 사용
            >
              <MenuItem value="">문의 유형을 선택해주세요</MenuItem>
              {inquiryTypesOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="내용"
              name="content"
              value={inquiry.content}
              multiline
              minRows={10}
              maxRows={10}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => handleContentChange(event.target.value)}
            />
            <div className="inquiry-reg-submit-btn">
              <Button
                style={{
                  minWidth: "150px",
                  color: "#578b36",
                  borderColor: "#578b36",
                }}
                variant="outlined"
                type="submit"
              >
                작성 완료
              </Button>
            </div>
          </Box>
        </form>
      </Container>
    </div>
  );
};

export default InquiryRegisterPage;

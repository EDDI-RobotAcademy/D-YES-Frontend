import { Box, Button, Container, TextField, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "../../../inquiry/css/InquiryRegisterPage.css";
import { getInquiryDetail, inquiryReplyRegister } from "page/inquiry/api/InquiryApi";
import { InquiryDetail } from "page/inquiry/entity/InquiryDetail";
import { InquiryReplyRequest } from "page/inquiry/entity/InquiryReplyRequest";
import useInquiryReplyStore from "page/inquiry/store/InquiryReplyStore";
import { useAuth } from "layout/navigation/AuthConText";

const AdminInquiryReadPage = () => {
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();
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
  interface RouteParams {
    inquiryId: string;
    [key: string]: string;
  }

  const { inquiryReply, setInquiryReply } = useInquiryReplyStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { inquiryId } = useParams<RouteParams>();
  const [loadedItems, setLoadedItems] = useState<InquiryDetail>();

  const mutation = useMutation(inquiryReplyRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("inquiryReply", data);
      navigate("/adminInquiryListPage");
    },
  });

  const handleContentChange = (newContent: string) => {
    setInquiryReply({ ...inquiryReply, content: newContent });
  };

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchInquiryDetailData = async () => {
      try {
        const data = await getInquiryDetail(inquiryId!);
        setLoadedItems(data);
      } catch (error) {
        toast.error("문의 정보를 가져오는데 실패했습니다");
      }
    };
    fetchInquiryDetailData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const convertedInquiryId = inquiryId ? parseInt(inquiryId, 10) : 0;

    const data: InquiryReplyRequest = {
      inquiryReplyRequest: {
        userToken: localStorage.getItem("userToken") || "",
        inquiryId: convertedInquiryId,
        content: inquiryReply.content,
      },
    };
    if (data.inquiryReplyRequest.content != null) {
      await mutation.mutateAsync(data);
    } else {
      toast.error("답변을 작성해주세요");
    }
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ marginTop: "2em", justifyContent: "center" }}>
        <Box
          sx={{
            width: "96%",
            height: 50,
            margin: "auto",
            alignItems: "center",
            borderRadius: "15px",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#6DA082",
            "&:hover": {
              backgroundColor: "#6DA082",
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        >
          <Typography color="white">문의 내용</Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <TextField
            name="title"
            value={loadedItems?.inquiryReadInquiryInfoResponse.title}
            multiline
            minRows={1}
            maxRows={1}
            disabled={true}
          />
          <TextField
            name="email"
            value={loadedItems?.inquiryReadUserResponse.userEmail}
            multiline
            minRows={1}
            maxRows={1}
            disabled={true}
          />
          <TextField
            select
            name="inquiryType"
            value={loadedItems?.inquiryReadInquiryInfoResponse.inquiryType || ""}
            disabled={true}
          >
            <MenuItem value="">문의 유형을 선택해주세요</MenuItem>
            {inquiryTypesOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="content"
            value={loadedItems?.inquiryReadInquiryInfoResponse.content}
            multiline
            minRows={10}
            maxRows={10}
            disabled={true}
          />
        </Box>
        <Box
          sx={{
            width: "96%",
            margin: "auto",
            marginTop: "20px",
            height: 50,
            alignItems: "center",
            borderRadius: "15px",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#6DA082",
            "&:hover": {
              backgroundColor: "#6DA082",
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        >
          <Typography color="white">문의 답변</Typography>
        </Box>
        <Box>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
              {loadedItems?.replyResponse.replyContent ? (
                <TextField
                  name="reply"
                  value={loadedItems?.replyResponse.replyContent}
                  multiline
                  minRows={1}
                  maxRows={1}
                  disabled={true}
                />
              ) : (
                <TextField
                  name="reply-content"
                  label="답변을 등록해주세요"
                  value={inquiryReply.content}
                  multiline
                  minRows={10}
                  maxRows={10}
                  onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    handleContentChange(event.target.value)
                  }
                />
              )}
              <div className="inquiry-reg-submit-btn">
                <Button
                  style={{
                    minWidth: "150px",
                    color: loadedItems?.replyResponse.replyContent ? "#252525" : "#578b36",
                    backgroundColor: "white",
                    borderColor: loadedItems?.replyResponse.replyContent ? "#252525" : "#578b36",
                  }}
                  variant="outlined"
                  type="submit"
                  disabled={!!loadedItems?.replyResponse.replyContent}
                >
                  {loadedItems?.replyResponse.replyContent ? "답변 작성 완료" : "답변 등록"}
                </Button>
              </div>
            </Box>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default AdminInquiryReadPage;

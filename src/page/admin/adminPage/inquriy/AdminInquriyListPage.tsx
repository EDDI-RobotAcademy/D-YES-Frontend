import { useState, useEffect } from "react";
import { TableCell, TableHead, TableRow, Chip } from "@mui/material";
import { Box } from "@mui/system";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import "./css/InquiryListPage.css";
import { AdminInquiryList } from "page/inquiry/entity/AdminInquiryList";
import { getInquiryList } from "page/inquiry/api/InquiryApi";

const AdminInquriyListPage = () => {
  const navigate = useNavigate();
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();
  const [inquiryList, setInquriyList] = useState([] as AdminInquiryList[]);

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

  const inquiryStatusOptions = [
    { value: "WAITING", label: "답변 대기중" },
    { value: "DONE", label: "답변 완료" },
  ];

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const fetchInquiryList = async () => {
    try {
      const fetchInquiryList = await getInquiryList();
      setInquriyList(fetchInquiryList);
    } catch (error) {
      console.log("주문 목록 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchInquiryList();
  }, []);

  return (
    <div className="inquiry-list-container">
      <Box
        display="flex"
        alignItems="left"
        flexDirection="column"
        minHeight="40vh"
        bgcolor="white"
        overflow="hidden" // 가로 스크롤 숨김
        margin="0 auto" // 수평 가운데 정렬
      >
        <table
          style={{
            borderCollapse: "collapse",
            textAlign: "center",
            margin: "20px",
          }}
        >
          <TableHead>
            <TableRow style={{ backgroundColor: "#F8F9FA" }}>
              <TableCell
                style={{
                  width: "10%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                문의 번호
              </TableCell>
              <TableCell
                style={{
                  width: "40%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                제목
              </TableCell>
              <TableCell
                style={{
                  width: "15%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                유형
              </TableCell>
              <TableCell
                style={{
                  width: "15%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                답변 상태
              </TableCell>
              <TableCell
                style={{
                  width: "20%",
                  padding: "18px 16px",
                  textAlign: "center",
                  color: "#252525",
                  fontFamily: "SUIT-Bold",
                }}
              >
                등록 일자
              </TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {inquiryList?.map((inquiry) => (
              <TableRow key={inquiry.inquiryId} style={{ cursor: "pointer" }}>
                <TableCell
                  style={{
                    padding: "8px 16px",
                    textAlign: "center",
                    fontFamily: "SUIT-Light",
                  }}
                >
                  {inquiry.inquiryId}
                </TableCell>
                <TableCell
                  style={{
                    padding: "8px 16px",
                    textAlign: "center",
                    fontFamily: "SUIT-Light",
                  }}
                >
                  {inquiry.title}
                </TableCell>
                <TableCell
                  style={{
                    padding: "8px 16px",
                    textAlign: "center",
                    fontFamily: "SUIT-Light",
                  }}
                >
                  {
                    inquiryTypesOptions.find(
                      (option) => option.value === inquiry.inquiryType
                    )?.label
                  }
                </TableCell>
                <TableCell
                  style={{
                    padding: "8px 16px",
                    textAlign: "center",
                    fontFamily: "SUIT-Light",
                  }}
                >
                  {inquiry.inquiryStatus && (
                    <Chip
                      label={
                        inquiryStatusOptions.find(
                          (option) => option.value === inquiry.inquiryStatus
                        )?.label
                      }
                      color={
                        inquiry.inquiryStatus === "WAITING"
                          ? "error"
                          : "primary"
                      }
                    />
                  )}
                </TableCell>

                <TableCell
                  style={{
                    padding: "8px 16px",
                    textAlign: "center",
                    fontFamily: "SUIT-Light",
                  }}
                >
                  {inquiry.createDate.toString()}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AdminInquriyListPage;

import React from "react";
import { Box, TableCell, TableHead, TableRow, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { getInquiryDetail, getMyInquiryList } from "./api/InquiryApi";
import { AdminInquiryList } from "./entity/AdminInquiryList";
import { useNavigate } from "react-router-dom";

import "./css/MyInquiryPage.css";
import { InquiryDetail } from "./entity/InquiryDetail";
import { toast } from "react-toastify";
import { useAuth } from "layout/navigation/AuthConText";

const MyInquiryListPage = () => {
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();
  const [inquiryList, setInquriyList] = useState([] as AdminInquiryList[]);
  const [loadedItems, setLoadedItems] = useState<InquiryDetail | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

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
    { value: "WAITING", label: "답변 대기" },
    { value: "DONE", label: "답변 완료" },
  ];

  const fetchInquiryList = async () => {
    try {
      const fetchInquiryList = await getMyInquiryList();
      setInquriyList(fetchInquiryList);
    } catch (error) {
      console.log("문의 목록 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchInquiryList();
  }, []);

  const handleButtonClick = () => {
    navigate("/inquiry/register");
  };

  const handleRowClick = async (inquiryId: string) => {
    const expandedRowsCopy = new Set(expandedRows);

    if (expandedRowsCopy.has(inquiryId)) {
      expandedRowsCopy.delete(inquiryId);
      setLoadedItems(null);
    } else {
      expandedRowsCopy.add(inquiryId);

      try {
        const data = await getInquiryDetail(inquiryId);
        setLoadedItems(data);
      } catch (error) {
        toast.error("문의 답변 정보를 가져오는데 실패했습니다");
      }
    }

    setExpandedRows(expandedRowsCopy);
  };

  return (
    <div className="inquiry-container">
      <div className="inquiry-grid">
        <div className="inquiry-page-name">
          <p className="inquiry-component-name">나의 문의 내역</p>
        </div>
        <hr />
        <div className="inquiry-component">
          총&nbsp;
          {inquiryList.length ? inquiryList.length : null}건
          <div>
            <button
              className="inquiry-register-btn"
              onClick={handleButtonClick}
            >
              문의 등록
            </button>
          </div>
        </div>

        <div className="my-inquiry-list-container">
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
                {inquiryList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                      }}
                    >
                      문의 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  inquiryList?.map((inquiry) => (
                    <React.Fragment key={inquiry.inquiryId}>
                      <TableRow
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleRowClick(inquiry.inquiryId.toString())
                        }
                      >
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
                                  (option) =>
                                    option.value === inquiry.inquiryStatus
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
                      {expandedRows.has(inquiry.inquiryId.toString()) &&
                        ((loadedItems?.replyResponse.replyContent &&
                          inquiry.inquiryId.toString() ===
                            loadedItems?.inquiryReadInquiryInfoResponse.inquiryId.toString()) ||
                          (!loadedItems?.replyResponse.replyContent &&
                            inquiry.inquiryId.toString() ===
                              loadedItems?.inquiryReadInquiryInfoResponse.inquiryId.toString())) && (
                          <>
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                style={{
                                  padding: "8px 16px",
                                  textAlign: "left",
                                  verticalAlign: "top",
                                  fontFamily: "SUIT-Light",
                                  height: "200px",
                                  backgroundColor: "white",
                                }}
                              >
                                {
                                  loadedItems?.inquiryReadInquiryInfoResponse
                                    .content
                                }
                              </TableCell>
                            </TableRow>
                            {loadedItems?.replyResponse.replyContent && (
                              <>
                                <TableRow>
                                  <TableCell
                                    colSpan={1}
                                    style={{
                                      backgroundColor: "#f1f8ea",
                                      textAlign: "center",
                                    }}
                                  >
                                    답변 일자
                                  </TableCell>
                                  <TableCell
                                    colSpan={4}
                                    style={{
                                      backgroundColor: "#f1f8ea",
                                      textAlign: "left",
                                    }}
                                  >
                                    {loadedItems?.replyResponse.createDate.toString()}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    style={{
                                      padding: "8px 16px",
                                      textAlign: "left",
                                      verticalAlign: "top",
                                      fontFamily: "SUIT-Light",
                                      height: "200px",
                                      backgroundColor: "#f1f8ea",
                                    }}
                                  >
                                    {loadedItems?.replyResponse.replyContent}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                          </>
                        )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default MyInquiryListPage;

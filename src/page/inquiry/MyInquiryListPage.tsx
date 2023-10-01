import React from "react";
import { Box, TableCell, TableHead, TableRow, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { getMyInquiryList } from "./api/InquiryApi";
import { AdminInquiryList } from "./entity/AdminInquiryList";
import { useNavigate } from "react-router-dom";

import "./css/MyInquiryPage.css";

const MyInquiryListPage = () => {
  const navigate = useNavigate();
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
    { value: "WAITING", label: "답변 대기" },
    { value: "DONE", label: "답변 완료" },
  ];

  // const handleInquiryClick = (inquiryId: string) => {
  //   navigate(`/adminInquiryReadPage/${inquiryId}`);
  // };

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
                    <TableRow
                      key={inquiry.inquiryId}
                      style={{ cursor: "pointer" }}
                      // onClick={(e) =>
                      //   handleInquiryClick(inquiry.inquiryId.toString())
                      // }
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

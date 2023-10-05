import React, { useEffect, useState } from "react";
import { EventList } from "./entity/EventList";
import {
  deleteEventProduct,
  fetchEvent,
  getEventList,
  getEventProductDetail,
} from "./api/EventApi";
import {
  Button,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import { toast } from "react-toastify";
import useEventReadStore from "./store/EventReadStore";
import { EventRead } from "./entity/EventRead";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const AdminEventListPage = () => {
  const [eventList, setEventList] = useState<EventList>();
  const navigate = useNavigate();
  const hasFetchedRef = React.useRef(false);
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();
  const { setEventRead } = useEventReadStore();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const fetchEventList = async () => {
    try {
      hasFetchedRef.current = true;
      const fetchedFarmList = await getEventList();
      setEventList(fetchedFarmList);
    } catch (error) {
      console.error("이벤트 리스트 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchEventList();
  }, []);

  const handleEditClick = async (eventProductId: string, startLine: string) => {
    const now = new Date();
    const eventStartDate = new Date(startLine);

    if (now >= eventStartDate) {
      toast.warning("이벤트가 이미 시작되었습니다. 수정할 수 없습니다.");
      return;
    }

    try {
      const eventData = await fetchEvent(eventProductId);
      if (eventData !== null) {
        setEventRead(eventData as unknown as EventRead);
      }
      navigate(`/adminEventModifyPage/${eventProductId}`);
    } catch (error) {
      console.error("이벤트 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const handleProductDetail = async (eventProductId: string) => {
    try {
      const eventData = await getEventProductDetail(eventProductId);
      if (eventData !== null) {
        setEventRead(eventData as unknown as EventRead);
      }
      navigate(`/eventProductDetail/${eventProductId}`);
    } catch (error) {
      console.error("상세 페이지 이벤트 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const handleDeleteClick = async (eventProductId: number, eventStartLine: string) => {
    const currentTime = new Date();
    const eventStartDate = new Date(eventStartLine);

    if (currentTime >= eventStartDate) {
      Swal.fire(
        "이벤트가 이미 시작되었습니다.",
        "이벤트 시작 날짜가 지난 경우에는 상품을 삭제할 수 있습니다.",
        "warning"
      );
      return;
    }

    try {
      const result = await Swal.fire({
        title: "삭제하시겠습니까?",
        text: "삭제하면 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "예, 삭제합니다",
        customClass: {
          container: "custom-swal-container",
        },
      });

      if (result.isConfirmed) {
        await deleteEventProduct(eventProductId.toString());
        Swal.fire("삭제되었습니다!", "상품이 삭제되었습니다.", "success");
      }
    } catch (error) {
      console.error("이벤트 상품 삭제 실패:", error);
      Swal.fire("오류!", "상품 삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const sortedEventList = [...(eventList?.eventProductAdminListResponseList || [])].sort(
    (a, b) => b.eventProductId - a.eventProductId
  );

  return (
    <div className="admin-event-list-container">
      <div className="admin-event-list-box">
        <TableContainer component={Paper} style={{ boxShadow: "none", width: "100%" }}>
          <table
            style={{
              borderCollapse: "collapse",
              textAlign: "center",
              margin: "20px",
            }}
          >
            <TableHead style={{ fontFamily: "SUIT-Thin" }}>
              <TableRow style={{ backgroundColor: "#F8F9FA" }}>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "4%",
                    textAlign: "center",
                  }}
                >
                  수정
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "4%",
                    textAlign: "center",
                  }}
                >
                  상세페이지
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                  data-testid="product-id"
                >
                  ID
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "20%",
                    textAlign: "center",
                  }}
                >
                  상품명
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "8%",
                    textAlign: "center",
                  }}
                >
                  모인 인원수
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "8%",
                    textAlign: "center",
                  }}
                >
                  시작 기간
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  마감 기간
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  재고
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  삭제
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEventList.length ? (
                sortedEventList.map((event) => (
                  <TableRow key={event.eventProductId}>
                    <TableCell className="cellStyle">
                      <Button
                        className="modify-btn"
                        onClick={() =>
                          handleEditClick(
                            event.eventProductId.toString(),
                            event.startLine.toString()
                          )
                        }
                        variant="contained"
                        style={{
                          fontSize: "13px",
                          padding: "4px 8px",
                          fontFamily: "SUIT-Regular",
                          backgroundColor: "#4F72CA",
                        }}
                      >
                        수정
                      </Button>
                    </TableCell>
                    <TableCell className="cellStyle">
                      <Button
                        className="modify-btn"
                        onClick={() => handleProductDetail(event.eventProductId.toString())}
                        variant="contained"
                        style={{
                          fontSize: "13px",
                          padding: "4px 8px",
                          fontFamily: "SUIT-Regular",
                          backgroundColor: "#EABF79",
                        }}
                      >
                        읽기
                      </Button>
                    </TableCell>
                    <TableCell className="cellStyle">{event.eventProductId}</TableCell>
                    <TableCell className="cellStyle">{event.eventProductName}</TableCell>
                    <TableCell className="cellStyle">{event.eventPurchaseCount}</TableCell>
                    <TableCell className="cellStyle">
                      {format(new Date(event.startLine), "yyyy년 MM월 dd일")}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {format(new Date(event.deadLine), "yyyy년 MM월 dd일")}
                    </TableCell>
                    <TableCell className="cellStyle">{event.stock}</TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      <IconButton
                        onClick={() =>
                          handleDeleteClick(event.eventProductId, event.startLine.toString())
                        }
                        color="default"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>이벤트가 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AdminEventListPage;

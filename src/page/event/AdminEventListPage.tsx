import React, { useEffect, useState } from "react";
import { EventList } from "./entity/EventList";
import { getEventList } from "./api/EventApi";
import {
  Button,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const AdminEventListPage = () => {
  const [eventList, setEventList] = useState<EventList>();
  const navigate = useNavigate();
  const hasFetchedRef = React.useRef(false);

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

  const handleEditClick = (eventId: number) => {
    navigate(`/adminEventModifyPage/${eventId}`);
  };

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
                    width: "6%",
                    textAlign: "center",
                  }}
                  data-testid="product-id"
                >
                  EVENTID
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
              </TableRow>
            </TableHead>
            <TableBody>
              {eventList?.eventProductAdminListResponseList?.length ? (
                eventList.eventProductAdminListResponseList.map((event) => (
                  <TableRow key={event.eventProductId}>
                    <TableCell className="cellStyle">
                      <Button
                        className="modify-btn"
                        onClick={() => handleEditClick(event.eventProductId)}
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

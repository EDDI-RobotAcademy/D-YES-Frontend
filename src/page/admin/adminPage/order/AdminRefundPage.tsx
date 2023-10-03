import {
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAuth } from "layout/navigation/AuthConText";
import { getRefundList } from "page/order/api/OrderApi";
import AdminRefundPopup from "page/order/components/AdminRefundPopup";
import { AdminOrderRefund } from "page/order/entity/AdminOrderRefund";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminRefundPage = () => {
  const [refundList, setRefundList] = useState([] as AdminOrderRefund[]);
  const hasFetchedRef = React.useRef(false);
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<AdminOrderRefund | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const fetchRefundList = async () => {
    try {
      hasFetchedRef.current = true;
      const fetchedRefundList = await getRefundList();
      setRefundList(fetchedRefundList);
    } catch (error) {
      console.error("이벤트 리스트 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchRefundList();
  }, []);

  const handleRowClick = (refundItem: AdminOrderRefund) => {
    setSelectedRefund(refundItem);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedRefund(null);
    setIsPopupOpen(false);
  };

  const handleRefundProcessed = (productOrderId: number) => {
    setRefundList((prevRefundList) =>
      prevRefundList.map((refund) =>
        refund.orderRefundDetailInfoResponse?.productOrderId === productOrderId
          ? {
              ...refund,
              orderRefundDetailInfoResponse: {
                ...refund.orderRefundDetailInfoResponse,
                orderedProductStatus: "REFUNDED",
              },
            }
          : refund
      )
    );
  };

  return (
    <div className="admin-refund-list-container">
      <div className="admin-refund-list-box">
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
                    width: "3%",
                    textAlign: "center",
                  }}
                >
                  주문 번호
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "3%",
                    textAlign: "center",
                  }}
                >
                  USERID
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "4%",
                    textAlign: "center",
                  }}
                >
                  주문 날짜
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "3%",
                    textAlign: "center",
                  }}
                  data-testid="product-id"
                >
                  배송 상태
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "3%",
                    textAlign: "center",
                  }}
                >
                  환불 금액
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "3%",
                    textAlign: "center",
                  }}
                >
                  환불 상태
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "3%",
                    textAlign: "center",
                  }}
                >
                  주문 금액
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  배송지
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  연락처
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "4%",
                    textAlign: "center",
                  }}
                >
                  환불사유
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refundList?.length ? (
                refundList?.map((refund) => (
                  <TableRow
                    key={refund.orderRefundDetailInfoResponse?.productOrderId}
                    onClick={() => handleRowClick(refund)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="cellStyle">
                      {refund.orderRefundDetailInfoResponse?.productOrderId}
                    </TableCell>
                    <TableCell className="cellStyle">{refund.orderUserInfo?.userId}</TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderRefundDetailInfoResponse?.orderedTime}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderRefundDetailInfoResponse?.deliveryStatus}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderRefundDetailInfoResponse?.cancelPrice}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderRefundDetailInfoResponse?.orderedProductStatus ===
                      "WAITING_REFUND"
                        ? "환불 대기"
                        : refund.orderRefundDetailInfoResponse?.orderedProductStatus === "REFUNDED"
                        ? "환불 완료"
                        : ""}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderRefundDetailInfoResponse?.totalPrice}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderUserInfo?.address.address}{" "}
                      {refund.orderUserInfo?.address.zipCode}(
                      {refund.orderUserInfo?.address.addressDetail})
                    </TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderUserInfo?.contactNumber}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {refund.orderRefundDetailInfoResponse?.refundReason}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>환불 신청 목록이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </TableContainer>
        {isPopupOpen && selectedRefund && (
          <AdminRefundPopup
            open={isPopupOpen}
            refundItem={selectedRefund}
            onClose={closePopup}
            onRefundProcessed={handleRefundProcessed}
          />
        )}
      </div>
    </div>
  );
};
export default AdminRefundPage;

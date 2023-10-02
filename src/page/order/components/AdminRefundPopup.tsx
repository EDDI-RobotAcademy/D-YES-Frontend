import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AdminOrderRefund } from "../entity/AdminOrderRefund";
import { fetchPopupRefund } from "../api/OrderApi";
import { RefundPopup } from "../entity/RefundPopup";
import { toast } from "react-toastify";

interface ReadPopupProps {
  open: boolean;
  onClose: () => void;
  refundItem: AdminOrderRefund;
  onRefundProduct: (refundItem: AdminOrderRefund) => Promise<void>;
}
const AdminRefundPopup: React.FC<ReadPopupProps> = ({
  open,
  onClose,
  refundItem,
  onRefundProduct,
}) => {
  const [refundData, setRefundData] = useState<RefundPopup | null>(null);

  useEffect(() => {
    const fetchRefundData = async () => {
      if (refundItem) {
        try {
          const data = await fetchPopupRefund(
            refundItem.orderRefundDetailInfoResponse?.productOrderId.toString()
          );
          setRefundData(data);
          console.log(data);
        } catch (error) {
          console.error("환불 데이터 가져오기 실패:", error);
        }
      }
    };
    fetchRefundData();
  }, [refundItem]);

  const handleRefundClick = async () => {
    await onRefundProduct(refundItem);
    toast.success("환불이 완료되었습니다.");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h5">환불 정보</Typography>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="read-custom-cell">
                  상품 번호
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  상품명
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{refundData?.productId}</TableCell>
                <TableCell align="center">{refundData?.productName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="read-custom-cell">
                  옵션번호
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  옵션명
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  옵션가격
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  판매 상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refundData?.orderOptionList.map((option, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{option.optionId}</TableCell>
                  <TableCell align="center">{option.optionName}</TableCell>
                  <TableCell align="center">{option.optionCount}</TableCell>
                  <TableCell align="center">
                    {option.orderProductStatus === "REFUNDED" ? "환불완료" : "환불 대기"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRefundClick} color="error">
          환불
        </Button>
        <Button onClick={onClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminRefundPopup;

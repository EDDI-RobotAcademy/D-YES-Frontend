import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";
import { deleteProduct, fetchPopupProduct, usePopupProductQuery } from "page/product/api/ProductApi";
import { useQueryClient } from "react-query";
import Swal from "sweetalert2";
import "../../css/ReadPopup.css";

interface ReadPopupProps {
  open: boolean;
  onClose: () => void;
  onDeleteProduct: (productId: number) => void;
}

const ReadPopup: React.FC<ReadPopupProps & { productId: number | null }> = ({
  open,
  onClose,
  productId,
  onDeleteProduct,
}) => {
  const { data } = usePopupProductQuery(productId ? productId.toString() : "");
  const queryClient = useQueryClient();
  const options = data?.optionSummaryResponseForAdmin || [];

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await fetchPopupProduct(productId ? productId.toString() : "");
      console.log(data);
    };
    fetchProductData();
  }, []);

  const handleDeleteClick = async () => {
    if (productId !== null) {
      // 여기에서 상품 옵션 중 하나라도 "판매중" 상태인지 확인
      const isAnyOptionInSale = options.some((option) => option.optionSaleStatus === "AVAILABLE");

      if (isAnyOptionInSale) {
        // 하나라도 판매 중인 옵션이 있으면 삭제를 막는 경고창을 표시
        Swal.fire("삭제 불가", "하나 이상의 옵션이 판매 중인 상태입니다.", "error");
      } else {
        // "삭제하시겠습니까?" 라는 SweetAlert2 경고창을 표시
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

        // 확인 버튼이 클릭되면 삭제 작업을 수행
        if (result.isConfirmed) {
          try {
            // 여기에서 실제 삭제 작업을 수행
            await deleteProduct(productId.toString());
            onDeleteProduct(productId);
            queryClient.invalidateQueries("productList");

            // 삭제 성공 메시지를 표시
            Swal.fire("삭제되었습니다!", "항목이 삭제되었습니다.", "success");
          } catch (error) {
            Swal.fire("오류!", "삭제 작업을 수행하는 중 오류가 발생했습니다.", "error");
          }
        }
      }
    }
    // 모달을 닫습니다.
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>상품 상세 정보</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="read-custom-cell">
                  상품명
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  상품 판매 상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{data?.productSummaryResponseForAdmin?.productName}</TableCell>
                <TableCell align="center">
                  {data?.productSummaryResponseForAdmin.productSaleStatus === "AVAILABLE"
                    ? "판매중"
                    : "판매중지"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="read-custom-cell">
                  ID
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  농가 이름
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{data?.farmInfoSummaryResponseForAdmin?.farmId}</TableCell>
                <TableCell align="center">{data?.farmInfoSummaryResponseForAdmin?.farmName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="read-custom-cell">
                  옵션명
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  가격
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  재고
                </TableCell>
                <TableCell align="center" className="read-custom-cell">
                  판매 상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {options.map((option) => (
                <TableRow key={option.optionId}>
                  <TableCell align="center">{option.optionName}</TableCell>
                  <TableCell align="center">{option.optionPrice}</TableCell>
                  <TableCell align="center">{option.stock}</TableCell>
                  <TableCell align="center">
                    {option.optionSaleStatus === "AVAILABLE" ? "판매중" : "판매중지"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClick} color="error">
          삭제
        </Button>
        <Button onClick={onClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReadPopup;

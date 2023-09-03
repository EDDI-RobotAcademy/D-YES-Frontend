import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { deleteProduct, fetchProduct, useProductQuery } from "page/product/api/ProductApi";
import { useQueryClient } from "react-query";

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
  const { data } = useProductQuery(productId ? productId.toString() : "");
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await fetchProduct(productId ? productId.toString() : "");
      console.log(data);
    };
    fetchProductData();
  }, []);

  const handleDeleteClick = async () => {
    if (productId !== null) {
      await deleteProduct(productId.toString());
      onDeleteProduct(productId);
      queryClient.invalidateQueries("productList");
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>상품 상세 정보</DialogTitle>
      <DialogContent>
        <Typography>상품명: {data?.productResponseForAdmin?.productName}</Typography>
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

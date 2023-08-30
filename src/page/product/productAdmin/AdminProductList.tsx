import {
  Button,
  Checkbox,
  MenuItem,
  Paper,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteProducts, fetchProductList, useProductListQuery } from "../api/ProductApi";
import useProductStore from "../store/ProductStore";
import { useQueryClient } from "react-query";
import "./css/AdminProductList.css";

interface AdminProductListProps {
  setShowProductSection: React.Dispatch<React.SetStateAction<string>>;
}

const AdminProductList: React.FC<AdminProductListProps> = ({ setShowProductSection }) => {
  const setProducts = useProductStore((state) => state.setProducts);
  const [selectedOptions, setSelectedOptions] = useState<{ [productId: number]: string }>({});
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const { data: products } = useProductListQuery();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await fetchProductList();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      }
    };
    fetchAllProducts();
  }, [setProducts]);

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(productId)
        ? prevSelectedProducts.filter((id) => id !== productId)
        : [...prevSelectedProducts, productId]
    );
  };

  const handleDeleteClick = async () => {
    if (selectedProducts.length === 0) {
      return;
    }

    try {
      await deleteProducts(selectedProducts.map((id) => id.toString()));
      queryClient.invalidateQueries("productList");
    } catch (error) {
      console.error("상품 삭제 실패:", error);
    }
  };

  const handleEditClick = (productId: number) => {
    setShowProductSection(`productModify/${productId}`);
  };

  return (
    <div className="admin-product-list-container">
      <div className="admin-product-list-box">
        <TableContainer
          component={Paper}
          style={{ boxShadow: "none" }}
        >
          <div className="product-list-menu">
            <img
              className="farm-product-list-icon"
              alt="상품 목록"
              src="img/farm-product-list-icon.png"
            />
            <Typography
              gutterBottom
              style={{
                fontSize: "16px",
                fontFamily: "SUIT-Medium",
                color: "#252525",
                marginBottom: "0px",
              }}
            >
              상품 목록
                <Typography
                  gutterBottom
                  sx={{
                    fontSize: "12px",
                    fontFamily: "SUIT-Regular",
                    color: "#252525",
                  }}
                >
                * 등록된 상품 목록을 확인해주세요
              </Typography>
            </Typography>
          </div>
          <table style={{ width: "100%", borderTop: "solid 1px lightgray", padding: "10px 10px 10px 10px" }}>
            <TableHead style={{ fontFamily: "SUIT-Thin" }}>
              <TableRow>
                <TableCell className="cellStyle-header" style={{ width: "60px" }}>선택</TableCell>
                <TableCell className="cellStyle-header" style={{ width: "60px" }}>수정</TableCell>
                <TableCell className="cellStyle-header" style={{ width: "60px" }}>상품번호</TableCell>
                <TableCell className="cellStyle-header" style={{ width: "200px" }}>
                  상품명
                </TableCell>
                <TableCell className="cellStyle-header">상품 판매여부</TableCell>
                <TableCell className="cellStyle-header" style={{ width: "122px" }}>
                  농가 이름
                </TableCell>
                <TableCell className="cellStyle-header">옵션명</TableCell>
                <TableCell className="cellStyle-header">옵션가격</TableCell>
                <TableCell className="cellStyle-header">재고</TableCell>
                <TableCell className="cellStyle-header">옵션 판매여부</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    등록된 상품이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.productId} style={{ cursor: "pointer" }}>
                    <TableCell className="cellStyle">
                      <Checkbox
                        checked={selectedProducts.includes(product.productId)}
                        onChange={() => handleCheckboxChange(product.productId)}
                      />
                    </TableCell>
                    <TableCell className="cellStyle">
                      <Button
                        className="modify-btn"
                        onClick={() => handleEditClick(product.productId)}
                        variant="contained"
                        style={{
                          fontSize: "13px", // 수정 버튼의 크기를 조정할 값
                          padding: "4px 8px", // 버튼 내용과 여백의 크기 조정
                          fontFamily: "SUIT-Regular",
                          backgroundColor: "#4F72CA"
                        }}
                      >
                        수정
                      </Button>
                    </TableCell>
                    <TableCell className="cellStyle">{product.productId}</TableCell>
                    <TableCell className="cellStyle">{product.productName}</TableCell>
                    <TableCell className="cellStyle">
                      {product.productSaleStatus === "AVAILABLE" ? "판매중" : "판매중지"}
                    </TableCell>
                    <TableCell className="cellStyle">{product.farmName}</TableCell>
                    <TableCell className="cellStyle">
                      {product.productOptionListResponse &&
                      product.productOptionListResponse.length > 0 ? (
                        <Select
                          className="noOutline"
                          variant="outlined"
                          label="아아"
                          value={selectedOptions[product.productId] || ""}
                          onChange={(e) =>
                            setSelectedOptions((prevSelectedOptions) => ({
                              ...prevSelectedOptions,
                              [product.productId]: e.target.value as string,
                            }))
                          }
                          style={{ height: "30px", width: "200px", fontFamily: "SUIT-Regular", fontSize: "14px" }}
                        >
                          {product.productOptionListResponse.map((option, index) => (
                            <MenuItem key={index} value={option.optionName} style={{ fontFamily: "SUIT-Regular", fontSize: "14px" }}>
                              {option.optionName}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : null}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] && product.productOptionListResponse
                        ? product.productOptionListResponse.find(
                            (option) => option.optionName === selectedOptions[product.productId]
                          )?.optionPrice
                        : ""}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] && product.productOptionListResponse
                        ? product.productOptionListResponse.find(
                            (option) => option.optionName === selectedOptions[product.productId]
                          )?.stock
                        : ""}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] && product.productOptionListResponse
                        ? product.productOptionListResponse.find(
                            (option) => option.optionName === selectedOptions[product.productId]
                          )?.optionSaleStatus === "AVAILABLE"
                          ? "판매중"
                          : "판매중지"
                        : ""}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </table>
          <Button 
            onClick={handleDeleteClick} 
            variant="contained"
            color="primary"
            style={{
              fontSize: "13px",
              padding: "4px 8px 4px 8px",
              fontFamily: "SUIT-Regular",
              marginLeft: "32px",
              marginBottom: "10px",
              backgroundColor: "#DF726D"
            }}
          >
            삭제
          </Button>
        </TableContainer>
      </div>
    </div>
  );
};

export default AdminProductList;

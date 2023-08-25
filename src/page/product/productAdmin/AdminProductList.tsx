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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchProductList, useProductListQuery } from "../api/ProductApi";
import useProductStore from "../store/ProductStore";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const setProducts = useProductStore((state) => state.setProducts);
  const [selectedOptions, setSelectedOptions] = useState<{ [productId: number]: string }>({});
  const { data: products } = useProductListQuery();

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

  const handleEditClick = (productId: number) => {
    console.log(`상품 수정 번호: ${productId}`);
    navigate("/productModify");
  };

  return (
    <TableContainer component={Paper} style={{ width: "1300px" }}>
      <table>
        <TableHead style={{ backgroundColor: "#D0D0D0" }}>
          <TableRow>
            <TableCell>체크박스</TableCell>
            <TableCell>수정</TableCell>
            <TableCell>상품번호</TableCell>
            <TableCell>상품명</TableCell>
            <TableCell>상품 판매여부</TableCell>
            <TableCell>농가정보</TableCell>
            <TableCell>옵션명</TableCell>
            <TableCell>옵션가격</TableCell>
            <TableCell>재고</TableCell>
            <TableCell>옵션판매여부</TableCell>
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
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEditClick(product.productId)}>
                    수정
                  </Button>
                </TableCell>
                <TableCell className="content-cell">{product.productId}</TableCell>
                <TableCell className="content-cell">{product.productName}</TableCell>
                <TableCell className="content-cell">
                  {product.productSaleStatus === "AVAILABLE" ? "판매중" : "판매중지"}
                </TableCell>
                <TableCell className="content-cell">{product.cultivationMethod}</TableCell>
                <TableCell className="content-cell">농가정보</TableCell>
                <TableCell className="content-cell">
                  {product.productOptionListResponse &&
                  product.productOptionListResponse.length > 0 ? (
                    <Select
                      value={selectedOptions[product.productId] || ""}
                      onChange={(e) =>
                        setSelectedOptions((prevSelectedOptions) => ({
                          ...prevSelectedOptions,
                          [product.productId]: e.target.value as string,
                        }))
                      }
                    >
                      {product.productOptionListResponse.map((option, index) => (
                        <MenuItem key={index} value={option.optionName}>
                          {option.optionName}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : null}
                </TableCell>
                <TableCell>
                  {selectedOptions[product.productId] && product.productOptionListResponse
                    ? product.productOptionListResponse.find(
                        (option) => option.optionName === selectedOptions[product.productId]
                      )?.optionPrice
                    : ""}
                </TableCell>
                <TableCell>
                  {selectedOptions[product.productId] && product.productOptionListResponse
                    ? product.productOptionListResponse.find(
                        (option) => option.optionName === selectedOptions[product.productId]
                      )?.stock
                    : ""}
                </TableCell>
                <TableCell>
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
    </TableContainer>
  );
};

export default ProductList;

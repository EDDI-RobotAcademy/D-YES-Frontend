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
import { deleteProducts, fetchProductList, useProductListQuery } from "../api/ProductApi";
import useProductStore from "../store/ProductStore";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

const AdminProductList = () => {
  const navigate = useNavigate();
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
    navigate(`/adminPage/productModify/${productId}`);
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
            <TableCell>농가이름</TableCell>
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
                  <Checkbox
                    checked={selectedProducts.includes(product.productId)}
                    onChange={() => handleCheckboxChange(product.productId)}
                  />
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
                <TableCell className="content-cell">{product.farmName}</TableCell>
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
      <Button variant="outlined" onClick={handleDeleteClick}>
        상품 삭제
      </Button>
    </TableContainer>
  );
};

export default AdminProductList;

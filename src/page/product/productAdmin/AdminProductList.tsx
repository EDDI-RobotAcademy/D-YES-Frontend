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
    <div>
      <TableContainer
        component={Paper}
        style={{ width: "1300px", boxShadow: "none", marginTop: "100px", marginLeft: "200px" }}
      >
        <table>
          <TableHead style={{ backgroundColor: "#D0D0D0" }}>
            <TableRow>
              <TableCell className="cellStyle">체크박스</TableCell>
              <TableCell className="cellStyle">수정</TableCell>
              <TableCell className="cellStyle">상품번호</TableCell>
              <TableCell className="cellStyle" style={{ width: "200px" }}>
                상품명
              </TableCell>
              <TableCell className="cellStyle">상품 판매여부</TableCell>
              <TableCell className="cellStyle" style={{ width: "122px" }}>
                농가이름
              </TableCell>
              <TableCell className="cellStyle">옵션명</TableCell>
              <TableCell className="cellStyle">옵션가격</TableCell>
              <TableCell className="cellStyle">재고</TableCell>
              <TableCell className="cellStyle">옵션판매여부</TableCell>
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
                  <TableCell>
                    <Button
                      onClick={() => handleEditClick(product.productId)}
                      style={{
                        fontSize: "12px", // 수정 버튼의 크기를 조정할 값
                        padding: "4px 8px", // 버튼 내용과 여백의 크기 조정
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
                        value={selectedOptions[product.productId] || ""}
                        onChange={(e) =>
                          setSelectedOptions((prevSelectedOptions) => ({
                            ...prevSelectedOptions,
                            [product.productId]: e.target.value as string,
                          }))
                        }
                        style={{ height: "30px", width: "200px" }}
                      >
                        {product.productOptionListResponse.map((option, index) => (
                          <MenuItem key={index} value={option.optionName}>
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
      </TableContainer>
      <Button variant="outlined" onClick={handleDeleteClick} style={{ marginLeft: "200px" }}>
        상품 삭제
      </Button>
    </div>
  );
};

export default AdminProductList;

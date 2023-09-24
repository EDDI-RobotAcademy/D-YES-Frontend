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
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { v4 as uuidv4 } from "uuid";
import "./css/AdminProductList.css";
import ReadPopup from "../../../product/components/productOption/ReadPopup";
import useProductStore from "page/product/store/ProductStore";
import {
  deleteProducts,
  fetchProductList,
  useProductListQuery,
} from "../../../product/api/ProductApi";
import { useNavigate } from "react-router-dom";
import useProductModifyStore from "page/product/store/ProductModifyStore";
import { useAuth } from "layout/navigation/AuthConText";
import { toast } from "react-toastify";

const AdminProductList: React.FC = () => {
  const setProducts = useProductStore((state) => state.setProducts);
  const { setModifyProducts } = useProductModifyStore();
  const [selectedOptions, setSelectedOptions] = useState<{
    [productId: number]: string;
  }>({});
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const { data: products } = useProductListQuery();
  const queryClient = useQueryClient();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const navigate = useNavigate();
  const hasFetchedRef = React.useRef(false);
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        hasFetchedRef.current = true;
        const data = await fetchProductList();
        setProducts(data);
        return data;
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
    navigate(`../adminProductModifyPage/${productId}`);
    if (products) {
      const modifiedData = products.find(
        (product) => product.productId === productId
      );
      if (modifiedData) {
        setModifyProducts(modifiedData);
      }
      console.log("상품 수정 읽기 데이터 받아오는지 확인", modifiedData);
    }
  };

  const handleRowClick = (productId: number) => {
    setSelectedProduct(productId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setIsPopupOpen(false);
  };

  const handleDeleteProduct = (productId: number) => {
    if (products) {
      const updatedProducts = products.filter(
        (product) => product.productId !== productId
      );
      setProducts(updatedProducts);
    }
  };

  return (
    <div className="admin-product-list-container">
      <div className="admin-product-list-box">
        <TableContainer
          component={Paper}
          style={{ boxShadow: "none", width: "100%" }}
        >
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
                  선택
                </TableCell>
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
                  상품번호
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
                  상품 판매여부
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "8%",
                    textAlign: "center",
                  }}
                >
                  농가 이름
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  옵션명
                </TableCell>
                <TableCell
                  className="cellStyle-header"
                  style={{
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  옵션가격
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
                    width: "8%",
                    textAlign: "center",
                  }}
                >
                  옵션 판매여부
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.length === 0 ? (
                <TableRow key={uuidv4()}>
                  <TableCell colSpan={9} align="center">
                    등록된 상품이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product, index) => (
                  <TableRow
                    onClick={() => handleRowClick(product.productId)}
                    key={index}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="cellStyle">
                      <Checkbox
                        checked={selectedProducts.includes(product.productId)}
                        onChange={() => handleCheckboxChange(product.productId)}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
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
                          backgroundColor: "#4F72CA",
                        }}
                      >
                        수정
                      </Button>
                    </TableCell>
                    <TableCell className="cellStyle">
                      {product.productId}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {product.productName}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {product.productSaleStatus === "AVAILABLE" ? (
                        <Chip label="판매중" color="success" />
                      ) : (
                        <Chip label="판매중지" color="error" />
                      )}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {product.farmName}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {product.productOptionList &&
                      product.productOptionList.length > 0 ? (
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
                          style={{
                            height: "30px",
                            width: "200px",
                            fontFamily: "SUIT-Regular",
                            fontSize: "14px",
                          }}
                        >
                          {product.productOptionList.map((option, index) => (
                            <MenuItem
                              key={index}
                              value={option.optionName}
                              style={{
                                fontFamily: "SUIT-Regular",
                                fontSize: "14px",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {option.optionName}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : null}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] &&
                      product.productOptionList
                        ? product.productOptionList.find(
                            (option) =>
                              option.optionName ===
                              selectedOptions[product.productId]
                          )?.optionPrice
                        : ""}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] &&
                      product.productOptionList
                        ? product.productOptionList.find(
                            (option) =>
                              option.optionName ===
                              selectedOptions[product.productId]
                          )?.stock
                        : ""}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] &&
                        product.productOptionList &&
                        product.productOptionList.find(
                          (option) =>
                            option.optionName ===
                              selectedOptions[product.productId] &&
                            option.optionSaleStatus === "AVAILABLE"
                        ) && <Chip label="판매중" color="success" />}
                      {selectedOptions[product.productId] &&
                        product.productOptionList &&
                        !product.productOptionList.find(
                          (option) =>
                            option.optionName ===
                              selectedOptions[product.productId] &&
                            option.optionSaleStatus === "AVAILABLE"
                        ) && <Chip label="판매중지" color="error" />}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </table>
          <Button
            onClick={handleDeleteClick}
            variant="contained"
            style={{
              fontSize: "13px",
              padding: "4px 8px 4px 8px",
              fontFamily: "SUIT-Regular",
              marginLeft: "32px",
              marginBottom: "18px",
              backgroundColor: "#df726d",
            }}
          >
            삭제
          </Button>
        </TableContainer>
        {isPopupOpen && selectedProduct && (
          <ReadPopup
            open={isPopupOpen}
            productId={selectedProduct}
            onClose={closePopup}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductList;

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
  fetchProduct,
  fetchProductList,
  useProductListQuery,
} from "../../../product/api/ProductApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import { toast } from "react-toastify";
import { ProductRead } from "page/product/entity/ProductRead";
import useProductReadStore from "page/product/store/ProductReadStore";
import Swal from "sweetalert2";

const AdminProductList: React.FC = () => {
  const setProducts = useProductStore((state) => state.setProducts);
  const { setProductRead } = useProductReadStore();
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
  const [selectAll, setSelectAll] = useState(false);

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
      const isAllOptionsUnavailable = selectedProducts.every((productId) => {
        const product = products?.find((p) => p.productId === productId);
        if (product) {
          return product.productOptionList.every(
            (option) => option.optionSaleStatus === "UNAVAILABLE"
          );
        }
        return false;
      });

      if (isAllOptionsUnavailable) {
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

        if (result.isConfirmed) {
          await deleteProducts(selectedProducts.map((id) => id.toString()));
          queryClient.invalidateQueries("productList");

          Swal.fire("삭제되었습니다!", "상품이 삭제되었습니다.", "success");
        }
      } else {
        Swal.fire("삭제 불가", "판매중인 상품이 존재합니다.", "error");
      }
    } catch (error) {
      Swal.fire("오류!", "상품 삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const handleEditClick = async (event: React.MouseEvent, productId: string) => {
    event.stopPropagation();

    try {
      const productData = await fetchProduct(productId);
      if (productData !== null) {
        setProductRead(productData as unknown as ProductRead);
      }
      navigate(`../adminProductModifyPage/${productId}`);
    } catch (error) {
      console.log("오류 발생", error);
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
      const updatedProducts = products.filter((product) => product.productId !== productId);
      setProducts(updatedProducts);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      if (products) {
        setSelectedProducts(products.map((product) => product.productId));
      }
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className="admin-product-list-container">
      <div className="admin-product-list-box">
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
                    width: "6%",
                    textAlign: "center",
                  }}
                >
                  <Checkbox checked={selectAll} onChange={() => handleSelectAll()} />
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
                        onClick={(e) => handleEditClick(e, product.productId.toString())}
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
                    <TableCell className="cellStyle">{product.productId}</TableCell>
                    <TableCell className="cellStyle">{product.productName}</TableCell>
                    <TableCell className="cellStyle">
                      {product.productSaleStatus === "AVAILABLE" ? (
                        <Chip label="판매중" color="success" />
                      ) : (
                        <Chip label="판매중지" color="error" />
                      )}
                    </TableCell>
                    <TableCell className="cellStyle">{product.farmName}</TableCell>
                    <TableCell className="cellStyle">
                      {product.productOptionList && product.productOptionList.length > 0 ? (
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
                      {selectedOptions[product.productId] && product.productOptionList
                        ? product.productOptionList.find(
                            (option) => option.optionName === selectedOptions[product.productId]
                          )?.optionPrice
                        : ""}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] && product.productOptionList
                        ? product.productOptionList.find(
                            (option) => option.optionName === selectedOptions[product.productId]
                          )?.stock
                        : ""}
                    </TableCell>
                    <TableCell className="cellStyle">
                      {selectedOptions[product.productId] &&
                        product.productOptionList &&
                        product.productOptionList.find(
                          (option) =>
                            option.optionName === selectedOptions[product.productId] &&
                            option.optionSaleStatus === "AVAILABLE"
                        ) && <Chip label="판매중" color="success" />}
                      {selectedOptions[product.productId] &&
                        product.productOptionList &&
                        !product.productOptionList.find(
                          (option) =>
                            option.optionName === selectedOptions[product.productId] &&
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

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeCartItemCount, deleteCartItems, getCartItemList } from "./api/CartApi";
import { toast } from "react-toastify";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { won } from "utility/filters/wonFilter";
import { getImageUrl } from "utility/s3/awsS3";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { CartItems } from "./entity/CartItems";
import { Cart } from "./entity/Cart";

import "./css/Cart.css";

export default function CartList() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedItems, setLoadedItems] = useState<CartItems[]>([]);
  const [quantity, setQuantity] = useState<{ [key: number]: number }>(() => {
    const productCount: { [key: number]: number } = {};
    loadedItems.forEach((item) => {
      productCount[item.optionId] = item.optionCount;
    });
    return productCount;
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();

  const calculateTotalPrice = useCallback(() => {
    let totalPrice = 0;
    for (const item of loadedItems) {
      if (item.optionId !== 0 && selectedItems.includes(item.optionId)) {
        const itemQuantity = quantity[item.optionId] || item.optionCount;
        totalPrice += item.optionPrice * itemQuantity;
      }
    }
    return totalPrice;
  }, [loadedItems, quantity, selectedItems]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await getCartItemList();
        setLoadedItems(data);
        setIsLoading(true);

        const checkAllOptions = data.map((item) => item.optionId);
        setSelectedItems(checkAllOptions);
      } catch (error) {
        toast.error("장바구니 정보를 가져오는데 실패했습니다");
      }
    };
    fetchCartData();
  }, []);

  useEffect(() => {
    const calculatedTotalPrice = calculateTotalPrice();
    setTotalPrice(calculatedTotalPrice);
  }, [calculateTotalPrice]);

  let discount = 0;
  let deliveryFee = 0;

  const showProductDetail = (optionId: number, productId: number) => {
    if (optionId === 0) {
      alert("존재하지 않는 상품입니다.");
      navigate("/productList");
    } else {
      navigate(`/productDetail/${productId}`);
    }
  };

  const increaseQuantity = async (optionId: number) => {
    const item = loadedItems.find((item) => item.optionId === optionId);
    if (item) {
      const updatedQuantity = (quantity[optionId] || item.optionCount) + 1;
      updateQuantity(optionId, updatedQuantity);
    }
  };

  const decreaseQuantity = async (optionId: number) => {
    const item = loadedItems.find((item) => item.optionId === optionId);
    if (item) {
      const updatedQuantity = (quantity[optionId] || item.optionCount) - 1;
      if (updatedQuantity >= 1) {
        updateQuantity(optionId, updatedQuantity);
      }
    } else {
      const updatedQuantity = (quantity[optionId] || 0) - 1;
      if (updatedQuantity >= 1) {
        setQuantity((prevQuantity) => ({
          ...prevQuantity,
          [optionId]: updatedQuantity,
        }));
      }
    }
  };

  const updateQuantity = async (optionId: number, updatedQuantity: number) => {
    const requestData: Cart = {
      productOptionId: optionId,
      optionCount: updatedQuantity,
    };
    try {
      const updatedOptionCount = await changeCartItemCount(requestData);
      setQuantity((prevQuantity) => ({
        ...prevQuantity,
        [optionId]: updatedOptionCount.changeProductCount,
      }));
      const updatedItemPrice = loadedItems.map((item) => {
        if (item.optionId === optionId) {
          item.optionCount = updatedQuantity;
        }
        return item;
      });
      setLoadedItems(updatedItemPrice);
    } catch (error) {
      toast.error("수량 업데이트에 실패했습니다");
    }
  };

  const itemSelection = (optionId: number) => {
    // selectedItems 배열에 optionId가 있다면 제거
    if (selectedItems.includes(optionId)) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((itemId) => itemId !== optionId)
      );
      // 아니면 추가
    } else {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, optionId]);
    }
  };

  const selectAllItems = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    if (!selectAll) {
      const allOptionIds = loadedItems.map((item) => item.optionId);
      setSelectedItems(allOptionIds);
    } else {
      setSelectedItems([]);
    }
  };

  const deleteItem = async (optionId: number) => {
    try {
      await deleteCartItems([optionId]);

      const updatedCartItems = await getCartItemList();
      setLoadedItems(updatedCartItems);

      toast.success("상품이 장바구니에서 삭제되었습니다");
    } catch (error) {
      toast.error("상품 삭제에 실패했습니다");
    }
  };

  const deleteSelectedItems = async () => {
    try {
      const selectedOptionIds: number[] = selectedItems.map((optionId) => optionId);
      await deleteCartItems(selectedOptionIds);

      const updatedCartItems = await getCartItemList();
      setLoadedItems(updatedCartItems);
      setSelectedItems([]);

      toast.success("선택한 상품이 삭제되었습니다");
    } catch (error) {
      toast.error("상품 삭제에 실패했습니다");
    }
  };

  const deleteAllItems = async () => {
    try {
      const allOptionIds = loadedItems.map((item) => item.optionId);
      await deleteCartItems(allOptionIds);

      const updatedCartItems = await getCartItemList();
      setLoadedItems(updatedCartItems);
      setSelectedItems([]);

      toast.success("장바구니를 비웠습니다");
    } catch (error) {
      toast.error("상품 삭제에 실패했습니다");
    }
  };

  const orderSelectedProduct = () => {
    if (selectedItems.length === 0) {
      toast.error("옵션을 선택해주세요");
      return;
    }
    const selectedProductInfo = selectedItems.map((optionId) => {
      const item = loadedItems.find((item) => item.optionId === optionId);
      return {
        optionId: optionId,
        optionCount: quantity[optionId] || (item ? item.optionCount : 0),
      };
    });
    const selectedOptionId = selectedProductInfo.map((id) => id.optionId);
    const selectedOptionCount = selectedProductInfo.map((count) => count.optionCount);
    const orderTotalPrice = totalPrice;
    const orderDataFrom = "CART";
    navigate("/order", {
      state: {
        selectedOptionId: selectedOptionId,
        selectedOptionCount: selectedOptionCount,
        orderTotalPrice: orderTotalPrice,
        orderDataFrom: orderDataFrom,
      },
    });
  };

  const orderAllProduct = () => {
    const allOptionId: number[] = loadedItems.map((id) => id.optionId);
    const allOptionCount: number[] = loadedItems.map((count) => count.optionCount);
    const orderTotalPrice: number = totalPrice;
    const orderDataFrom: string = "CART";
    navigate("/order", {
      state: {
        selectedOptionId: allOptionId,
        selectedOptionCount: allOptionCount,
        orderTotalPrice: orderTotalPrice,
        orderDataFrom: orderDataFrom,
      },
    });
  };

  return (
    <div className="cart-container">
      <div className="cart-grid">
        <div className="cart-page-name">장바구니</div>
        <hr />
        {loadedItems.length != 0 && isLoading ? (
          <div className="cart-components">
            <div>
              <div className="cart-controll">
                <FormControlLabel
                  label="전체 선택"
                  control={<Checkbox checked={selectAll} onChange={selectAllItems} />}
                />
                <div className="cart-delete-buttons">
                  <Button
                    onClick={deleteSelectedItems}
                    variant="contained"
                    disabled={selectedItems.length === 0}
                  >
                    선택한 상품 삭제
                  </Button>
                  <Button onClick={deleteAllItems} variant="contained">
                    장바구니 비우기
                  </Button>
                </div>
              </div>
              <TableContainer>
                <Table>
                  <TableBody>
                    {loadedItems.map((item) => (
                      <TableRow key={item.optionId}>
                        <>
                          <TableCell>
                            <Checkbox
                              data-testid={`cart-select-test-id-${item.optionId}`}
                              checked={selectedItems.includes(item.optionId)}
                              onChange={() => itemSelection(item.optionId)}
                            />
                          </TableCell>
                          <TableCell
                            style={{ cursor: "pointer" }}
                            onClick={() => showProductDetail(item.optionId, item.productId)}
                          >
                            <img
                              src={getImageUrl(item.productMainImage)}
                              style={{ width: "100px", height: "100px" }}
                            />
                          </TableCell>
                          <TableCell
                            style={{ cursor: "pointer" }}
                            onClick={() => showProductDetail(item.optionId, item.productId)}
                          >
                            {item.productName}&nbsp;<br></br>
                            {item.optionName}
                          </TableCell>
                          <TableCell>
                            <div className="cart-counter-buttons">
                              <div
                                data-testid={`cart-decrease-test-id-${item.optionId}`}
                                className="cart-counter-button"
                                onClick={() => decreaseQuantity(item.optionId)}
                              >
                                <RemoveIcon />
                              </div>
                              {quantity[item.optionId] || item.optionCount}
                              <div
                                data-testid={`cart-increase-test-id-${item.optionId}`}
                                className="cart-counter-button"
                                onClick={() => increaseQuantity(item.optionId)}
                              >
                                <AddIcon />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{won(item.optionPrice * item.optionCount)}</TableCell>
                          <TableCell>
                            <Tooltip title="삭제">
                              <IconButton
                                data-testid={`cart-delete-test-id-${item.optionId}`}
                                onClick={() => deleteItem(item.optionId)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="cart-info">
              <div className="cart-price-info">
                <p>총 상품 금액</p>
                <p>{won(totalPrice)}</p>
              </div>
              <div className="cart-price-info">
                <p>할인 금액</p>
                <p>{won(discount)}</p>
              </div>
              <div className="cart-price-info">
                <p>배송비</p>
                <p>{won(deliveryFee)}</p>
              </div>
              <hr className="hr1" />
              <div className="cart-price-info cart-total-price">
                <p>총 결제 금액</p>
                <p>{won(totalPrice - discount + deliveryFee)}</p>
              </div>
              <br />
              <div className="cart-payment">
                <Button
                  className="cart-payment-button"
                  variant="outlined"
                  onClick={orderSelectedProduct}
                >
                  선택 상품 주문하기
                </Button>
              </div>
              <div className="cart-payment">
                <Button
                  className="cart-payment-button"
                  variant="outlined"
                  onClick={orderAllProduct}
                >
                  전체 상품 주문하기
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-empty-container">
            <div>
              <div className="cart-empty">장바구니가 비어있습니다</div>
              <div className="cart-empty-button">
                <Button size="large" onClick={() => navigate("/productList/all")}>
                  쇼핑하러 가기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

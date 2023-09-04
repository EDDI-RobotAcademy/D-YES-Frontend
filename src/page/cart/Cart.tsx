import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeCartItemCount, deleteCartItems, getCartItemList } from "./api/CartApi";
import { toast } from "react-toastify";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { CartItems } from "./entity/CartItems";
import { Cart } from "./entity/Cart";
import { won } from "utility/filters/wonFilter";
import { getImageUrl } from "utility/s3/awsS3";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

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
  const [selectAll, setSelectAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();

  const calculateTotalPrice = useCallback(() => {
    let totalPrice = 0;
    for (const item of loadedItems) {
      const itemQuantity = quantity[item.optionId] || item.optionCount;
      totalPrice += item.optionPrice * itemQuantity;
    }
    return totalPrice;
  }, [loadedItems, quantity]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await getCartItemList();
        setLoadedItems(data);
        setIsLoading(true);
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

  const showProductDetail = (optionId: number) => {
    navigate(`/productDetail/${optionId}`);
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
    if (item && quantity[optionId] != 1) {
      const updatedQuantity = (quantity[optionId] || item.optionCount) - 1;
      updateQuantity(optionId, updatedQuantity);
    }
  };

  const updateQuantity = async (optionId: number, updatedQuantity: number) => {
    const requestData: Cart = {
      productOptionId: optionId,
      optionCount: updatedQuantity,
    };
    try {
      await changeCartItemCount(requestData);
      const updatedCartItems = await getCartItemList();
      setLoadedItems(updatedCartItems);
      setQuantity((prevQuantity) => ({
        ...prevQuantity,
        [optionId]: updatedQuantity,
      }));
    } catch (error) {
      toast.error("수량 업데이트에 실패했습니다");
    }
  };

  const selectAllItems = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(loadedItems.map((item) => item.optionId));
    }
    setSelectAll(!selectAll);
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

  const deleteItem = async (optionId: number) => {
    try {
      await deleteCartItems(optionId);

      const updatedCartItems = await getCartItemList();
      setLoadedItems(updatedCartItems);

      toast.success("상품이 장바구니에서 삭제되었습니다");
    } catch (error) {
      toast.error("상품 삭제에 실패했습니다");
    }
  };

  const deleteSelectedItems = async () => {
    try {
      for (const optionId of selectedItems) {
        await deleteCartItems(optionId);
      }
      const updatedCartItems = await getCartItemList();
      setLoadedItems(updatedCartItems);
      setSelectedItems([]);

      toast.success("선택한 상품이 삭제되었습니다");
    } catch (error) {
      toast.error("상품 삭제에 실패했습니다");
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-grid">
        <div className="cart-page-name">장바구니</div>
        <hr />
        {loadedItems && isLoading ? (
          <div className="cart-components">
            <div>
              <div className="cart-controll">
                <div className="cart-select-all">
                  <input type="checkbox" onClick={selectAllItems} />
                  전체 선택
                </div>
                <div className="cart-delete-buttons">
                  <Button
                    onClick={deleteSelectedItems}
                    variant="contained"
                    disabled={selectedItems.length === 0}
                  >
                    선택한 상품 삭제
                  </Button>
                  <Button variant="contained">장바구니 비우기</Button>
                </div>
              </div>
              <TableContainer>
                <Table>
                  <TableBody>
                    {loadedItems.map((item) => (
                      <TableRow key={item.optionId}>
                        <TableCell>
                          <input
                            data-testid={`cart-select-test-id-${item.optionId}`}
                            type="checkbox"
                            // selectedItems 배열에 optionId 추가
                            checked={selectedItems.includes(item.optionId)}
                            onChange={() => itemSelection(item.optionId)}
                          />
                        </TableCell>
                        <TableCell
                          style={{ cursor: "pointer" }}
                          onClick={() => showProductDetail(item.optionId)}
                        >
                          <img
                            src={getImageUrl(item.productMainImage)}
                            style={{ width: "100px", height: "100px" }}
                          />
                        </TableCell>
                        <TableCell
                          style={{ cursor: "pointer" }}
                          onClick={() => showProductDetail(item.optionId)}
                        >
                          {item.productName}&nbsp;&nbsp;{item.value}
                          {item.unit}
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
                <Button className="cart-payment-button" variant="outlined">
                  결제하기
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-empty-container">
            <div>
              <div className="cart-empty">장바구니가 비어있습니다</div>
              <div className="cart-empty-button">
                <Button size="large" onClick={() => navigate("/productList")}>
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

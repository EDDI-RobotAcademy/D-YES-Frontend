import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItemList } from "./api/CartApi";
import { toast } from "react-toastify";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { CartItems } from "./entity/CartItems";
import { won } from "utility/filters/wonFilter";
import { getImageUrl } from "utility/s3/awsS3";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import "./css/Cart.css";

export default function CartList() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedItems, setLoadedItems] = useState<CartItems[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();

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

  let discount = 0;
  let deliveryFee = 0;

  const showProductDetail = (optionId: number) => {
    navigate(`/productDetail/${optionId}`);
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

  return (
    <div className="cart-container">
      <div className="cart-grid">
        <div className="cart-page-name">장바구니</div>
        <hr />
        {loadedItems.length && isLoading ? (
          <div className="cart-components">
            <div>
              <div className="cart-controll">
                <div className="cart-select-all">
                  <input type="checkbox" onClick={selectAllItems} />
                  전체 선택
                </div>
                <div className="cart-delete-buttons">
                  <Button variant="contained" disabled={selectedItems.length === 0}>
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
                          <Button>-</Button>
                          {item.optionCount}
                          <Button>+</Button>
                        </TableCell>
                        <TableCell>{won(item.optionPrice * item.optionCount)}</TableCell>
                        <TableCell>
                          <Tooltip title="삭제">
                            <IconButton>
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

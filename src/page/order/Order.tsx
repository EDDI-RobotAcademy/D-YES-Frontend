import React, { useCallback, useEffect, useState } from "react";
import { getImageUrl } from "utility/s3/awsS3";
import { won } from "utility/filters/wonFilter";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { getOrderInfo, updateAddressInfo } from "./api/OrderApi";
import { Grid, Button, Checkbox, Paper, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import "./css/Order.css";
import { UserAddress } from "entity/order/UserAddress";
import { OrderInfo } from "entity/order/OrderInfo";

interface IAddr {
  address: string;
  zonecode: string;
}

const Order = () => {
  const [addressInfo, setAddressInfo] = useState({ address: "", zipCode: "" });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedItems, setLoadedItems] = useState<OrderInfo>();
  const [defaultAddress, setDefaultAddress] = useState(false);

  let discount = 0;
  let deliveryFee = 0;

  const calculateTotalPrice = useCallback(() => {
    let totalPrice = 0;
    const loadedPrice = loadedItems?.productResponseList || undefined;
    if (loadedPrice)
      for (const item of loadedPrice) {
        const itemQuantity = item.optionCount;
        totalPrice += item.optionPrice * itemQuantity;
      }
    return totalPrice;
  }, [loadedItems]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await getOrderInfo();
        setLoadedItems(data);
        setIsLoading(true);
        localStorage.setItem("addressDetail", data?.userResponse.addressDetail);
      } catch (error) {
        toast.error("서버와의 통신에 실패했습니다");
      }
    };
    fetchCartData();
  }, []);

  useEffect(() => {
    const calculatedTotalPrice = calculateTotalPrice();
    setTotalPrice(calculatedTotalPrice);
  }, [calculateTotalPrice]);

  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (data: IAddr) {
        setAddressInfo({
          address: data.address,
          zipCode: data.zonecode,
        });
        // 주소 고르고 난 뒤 addressDetail이라는 이름을 가진 요소 focus
        document.getElementById("addressDetail")?.focus();
      },
    }).open();
  };

  const handlePayment = async () => {
    if (defaultAddress) {
      const userAddressInfo: UserAddress = {
        address:
          addressInfo.address === ""
            ? loadedItems?.userResponse.address
              ? loadedItems?.userResponse?.address
              : ""
            : addressInfo.address,

        zipCode:
          addressInfo.zipCode === ""
            ? loadedItems?.userResponse.zipCode
              ? loadedItems?.userResponse?.zipCode
              : ""
            : addressInfo.zipCode,

        addressDetail: localStorage.getItem("addressDetail") || "",
      };
      try {
        await updateAddressInfo(userAddressInfo);
        toast.success("배송지 정보가 업데이트되었습니다");
      } catch {
        toast.error("배송지 정보 업데이트에 실패했습니다");
      }
    }
  };

  const removeLocalStorageAddr = () => {
    localStorage.removeItem("addressDetail");
  };

  useEffect(() => {
    return () => {
      removeLocalStorageAddr();
    };
  }, []);

  return (
    <div className="order-container">
      <div className="order-grid">
        <div className="order-page-name">주문하기</div>
        <hr />
        {isLoading ? (
          <div className="order-components">
            <div className="order-list">
              <Paper style={{ padding: "10px 0", borderRadius: "0.1em" }}>
                <p className="order-info-title">주문 상품 정보</p>
                {loadedItems?.productResponseList.map((product) => (
                  <div key={product.optionId} className="order-product-info-container">
                    <div className="order-detail-container">
                      <div className="order-product-image">
                        <img
                          src={getImageUrl(product.productMainImage)}
                          style={{ width: "128px", height: "100px" }}
                        />
                      </div>
                      <div className="order-info-container">
                        <div className="order-product-name margin-1">
                          {product.productName}&nbsp;&nbsp;
                          {product.value}
                          {product.unit}
                        </div>
                        <div data-testid="order-test-id" className="order-product-count margin-1">
                          {product.optionCount}개
                        </div>
                        <div className="order-product-price margin-1">
                          {won(product.optionPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Paper>
              <br className="br-2" />
              <Paper style={{ padding: "10px 0", borderRadius: "0.1em" }}>
                <div className="order-info-title">주문자 정보</div>
                <div className="order-user-info-container">
                  <Grid item xs={12}>
                    <div>
                      받는 사람 <span className="asterisk">*</span>
                    </div>
                    <TextField
                      id="optionName"
                      name="optionName"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      className="custom-input"
                      placeholder="이름을 입력해주세요"
                    />
                    <div>
                      연락처 <span className="asterisk">*</span>
                    </div>
                    <TextField
                      id="optionPrice"
                      name="optionPrice"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      className="custom-input"
                      placeholder="연락처"
                      defaultValue={loadedItems?.userResponse?.contactNumber || ""}
                    />
                    <div>이메일</div>
                    <TextField
                      id="optionName"
                      name="optionName"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      className="custom-input"
                      placeholder="이메일"
                      defaultValue={loadedItems?.userResponse?.email || ""}
                    />
                    <div className="order-checkbox">
                      <span className="asterisk">*</span>&nbsp;표시는 필수입력 사항입니다.
                    </div>
                  </Grid>
                </div>
              </Paper>
              <br className="br-2" />
              <Paper style={{ padding: "10px 0", borderRadius: "0.1em" }}>
                <div className="order-info-title">배송지 정보</div>
                <div className="order-user-info-container">
                  <div>
                    주소 <span className="asterisk">*</span>
                  </div>
                  <TextField
                    id="address"
                    name="address"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    className="custom-input"
                    value={
                      addressInfo.address === ""
                        ? [
                            loadedItems?.userResponse.address
                              ? loadedItems?.userResponse?.address
                              : "",
                          ]
                        : addressInfo.address
                    }
                    aria-readonly
                    placeholder="주소 검색"
                    onClick={onClickAddr}
                  />
                  <Grid item xs={12}>
                    <div>
                      우편번호 <span className="asterisk">*</span>
                    </div>
                    <Tooltip title="자동으로 입력되는 값입니다" followCursor>
                      <TextField
                        id="zipCode"
                        name="zipCode"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        className="custom-input"
                        placeholder="우편번호"
                        value={
                          addressInfo.zipCode === ""
                            ? [
                                loadedItems?.userResponse.zipCode
                                  ? loadedItems?.userResponse?.zipCode
                                  : "",
                              ]
                            : addressInfo.zipCode
                        }
                        disabled
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      상세주소 <span className="asterisk">*</span>
                    </div>
                    <TextField
                      id="addressDetail"
                      name="addressDetail"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      className="custom-input"
                      placeholder="상세주소 입력"
                      defaultValue={localStorage.getItem("addressDetail")}
                      onChange={(event) => {
                        localStorage.setItem("addressDetail", event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className="order-checkbox">
                      <span className="asterisk">*</span>&nbsp;표시는 필수입력 사항입니다.
                    </div>
                    <div className="order-checkbox">
                      <br />
                      <Checkbox
                        data-testid="order-checkbox-testid"
                        onChange={() => setDefaultAddress(true)}
                      />
                      기본 배송지로 등록
                      <Tooltip title="입력한 정보가 사용자 프로필 정보에 저장됩니다">
                        <HelpOutlineIcon fontSize="small" />
                      </Tooltip>
                    </div>
                  </Grid>
                </div>
              </Paper>
            </div>

            <div className="order-info">
              <Paper
                style={{
                  padding: "10px 0",
                  borderRadius: "0.1em",
                  position: "sticky",
                  top: "0px",
                }}
              >
                <div className="order-price-info-container">
                  <div className="order-price-info">
                    <p>총 상품 금액</p>
                    <p>{won(totalPrice)}</p>
                  </div>
                  <div className="order-price-info">
                    <p>할인 금액</p>
                    <p>{won(discount)}</p>
                  </div>
                  <div className="order-price-info">
                    <p>배송비</p>
                    <p>{won(deliveryFee)}</p>
                  </div>
                  <hr className="hr1" />
                  <div className="order-price-info order-total-price">
                    <p>최종 결제 금액</p>
                    <p>{won(totalPrice - discount + deliveryFee)}</p>
                  </div>
                  <br />
                  <div className="order-payment">
                    <Button
                      className="order-payment-button"
                      variant="outlined"
                      onClick={handlePayment}
                    >
                      결제하기
                    </Button>
                  </div>
                </div>
              </Paper>
            </div>
          </div>
        ) : (
          <div>로딩중</div>
        )}
      </div>
    </div>
  );
};

export default Order;

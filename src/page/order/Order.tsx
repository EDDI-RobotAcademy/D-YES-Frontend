import React, { useCallback, useEffect, useState } from "react";
import { getImageUrl } from "utility/s3/awsS3";
import { won } from "utility/filters/wonFilter";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { getOrderInfo, orderRequestInCart } from "./api/OrderApi";
import { updateAddressInfo } from "page/user/api/UserApi";
import { Grid, Button, Checkbox, Paper, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import "./css/Order.css";
import { useOrderUserInfoStore } from "./store/OrderStore";
import { UserAddress } from "./entity/UserAddress";
import { OrderdProduct } from "./entity/OrderedProduct";
import { OrderRequset } from "./entity/OrderRequset";

interface IAddr {
  address: string;
  zonecode: string;
}

const Order = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { orderUserInfo, setOrderUserInfo } = useOrderUserInfoStore();
  const [userName, setUserName] = useState<string>("");
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [addressInfo, setAddressInfo] = useState({ address: "", zipCode: "" });

  let discount = 0;
  let deliveryFee = 0;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await getOrderInfo();
        if (data) {
          setOrderUserInfo(data);
          setIsLoading(true);
        } else {
          toast.warning("주문 정보가 없습니다");
          navigate("/productList/all");
          return;
        }
      } catch (error) {
        toast.error("서버와의 통신에 실패했습니다");
      }
    };
    fetchCartData();
  }, [setOrderUserInfo]);

  const calculateTotalPrice = useCallback(() => {
    let totalPrice = 0;
    const loadedPrice = orderUserInfo?.productResponseList || undefined;
    if (loadedPrice)
      for (const item of loadedPrice) {
        const itemQuantity = item.optionCount;
        totalPrice += item.optionPrice * itemQuantity;
      }
    return totalPrice;
  }, [orderUserInfo]);

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

  const handleContackNumberChange = (contactNumber: string) => {
    const updatedOrderUserInfo = { ...orderUserInfo };
    updatedOrderUserInfo.userResponse.contactNumber = contactNumber;
    setOrderUserInfo(updatedOrderUserInfo);
  };

  const handleEmailChange = (email: string) => {
    const updatedOrderUserInfo = { ...orderUserInfo };
    updatedOrderUserInfo.userResponse.email = email;
    setOrderUserInfo(updatedOrderUserInfo);
  };

  const handleAddressDetailChange = (addressDetail: string) => {
    const updatedOrderUserInfo = { ...orderUserInfo };
    updatedOrderUserInfo.userResponse.addressDetail = addressDetail;
    setOrderUserInfo(updatedOrderUserInfo);
  };

  const handlePayment = async () => {
    if (defaultAddress) {
      const userAddressInfo: UserAddress = {
        address:
          addressInfo.address === ""
            ? orderUserInfo?.userResponse.address || ""
            : addressInfo.address,

        zipCode:
          addressInfo.zipCode === ""
            ? orderUserInfo?.userResponse.zipCode || ""
            : addressInfo.zipCode,

        addressDetail: orderUserInfo.userResponse.addressDetail || "",
      };
      try {
        await updateAddressInfo(userAddressInfo);
        toast.success("배송지 정보가 업데이트되었습니다");
      } catch {
        toast.error("배송지 정보 업데이트에 실패했습니다");
      }
    }
    // 유효성검사 추가
    const extractedData: OrderdProduct[] = orderUserInfo!.productResponseList.map((item) => ({
      productOptionId: item.optionId,
      productOptionCount: item.optionCount.toString(),
    }));

    const orderedInfo: OrderRequset = {
      orderedUserInfo: {
        orderedPurchaserName: userName,
        orderedPurchaserEmail: orderUserInfo?.userResponse.email || "",
        orderedPurchaserContactNumber: orderUserInfo?.userResponse.contactNumber || "",
        orderedPurchaserAddress:
          addressInfo.address === ""
            ? orderUserInfo?.userResponse.address || ""
            : addressInfo.address,
        orderedPurchaserZipCode:
          addressInfo.zipCode === ""
            ? orderUserInfo?.userResponse.zipCode || ""
            : addressInfo.zipCode,
        orderedPurchaserAddressDetail: orderUserInfo?.userResponse.addressDetail || "",
      },
      orderedProductInfo: extractedData,
      totalAmount: totalPrice,
    };

    try {
      const orderRequest = await orderRequestInCart(orderedInfo);
      if (orderRequest) {
        toast.success("주문이 완료되었습니다");
        navigate("/myOrder");
      } else {
        toast.warning("주문 요청 중 오류가 발생했습니다");
      }
    } catch (error) {
      toast.error("주문 요청에 실패했습니다");
    }
  };

  return (
    <div className="order-container">
      <div className="order-grid">
        <div className="order-page-name">주문하기</div>
        <hr />
        {orderUserInfo ? (
          isLoading ? (
            <div className="order-components">
              <div className="order-list">
                <Paper style={{ padding: "10px 0", borderRadius: "0.1em" }}>
                  <p className="order-info-title">주문 상품 정보</p>
                  {orderUserInfo?.productResponseList.map((product) => (
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
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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
                        value={orderUserInfo.userResponse.contactNumber || ""}
                        onChange={(e) => handleContackNumberChange(e.target.value)}
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
                        value={orderUserInfo.userResponse.email || ""}
                        onChange={(e) => handleEmailChange(e.target.value)}
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
                              orderUserInfo?.userResponse.address
                                ? orderUserInfo?.userResponse?.address
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
                                  orderUserInfo?.userResponse.zipCode
                                    ? orderUserInfo?.userResponse?.zipCode
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
                        value={orderUserInfo?.userResponse.addressDetail || ""}
                        onChange={(e) => handleAddressDetailChange(e.target.value)}
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
          )
        ) : (
          <div>주문 정보가 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default Order;

import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderOptionListResponse } from "page/order/entity/UserOrderOption";
import { toast } from "react-toastify";
import { refundOrderedItems } from "./api/PaymentApi";
import { OrderRefund } from "page/order/entity/OrderRefund";
import { useAuth } from "layout/navigation/AuthConText";

import "./css/PaymentRefund.css";

const PaymentRefundPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();
  const location = useLocation();
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [selectedOption, setSelectedOption] = React.useState("상품이 마음에 들지 않음");
  const [isTextfieldOpen, setIsTextfieldOpen] = React.useState(false);
  const [customReason, setCustomReason] = React.useState("");

  const orderId: string = location.state.orderId;
  const productName: string = location.state.productName;
  const optionInfo: OrderOptionListResponse[] = location.state.optionInfo;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const optionLabel = event.target.value;
    if (checked) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, optionLabel]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item !== optionLabel)
      );
    }
  };

  const handleOptionChange = (event: { target: { value: any } }) => {
    const optionLabel = event.target.value;
    setSelectedOption(optionLabel);
    if (optionLabel === "직접 입력") {
      setIsTextfieldOpen(true);
    } else {
      setIsTextfieldOpen(false);
    }
  };

  const handleTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    setCustomReason(inputText);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedItems.length === 0) {
      toast.error("주문 취소할 옵션을 선택해주세요");
      return;
    }
    if (selectedOption === "직접 입력" && customReason === "") {
      toast.error("취소 사유를 입력해주세요");
      return;
    }
    const refundData: OrderRefund = {
      orderId: parseInt(orderId, 10),
      productOptionId: selectedItems.map((optionId) => parseInt(optionId, 10)),
      refundReason: selectedOption !== "직접 입력" ? selectedOption : customReason,
    };
    // console.log(refundData);
    try {
      const isRefund = await refundOrderedItems(refundData);
      if (isRefund) {
        toast.success("주문이 취소되었습니다");
        navigate("/", { replace: true });
      } else {
        toast.error("주문 취소 신청에 실패했습니다");
      }
    } catch (error) {
      toast.error("주문 취소 신청 중 오류가 발생했습니다");
    }
  };

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

  return (
    <div>
      <div className="refund-container">
        <div className="refund-grid">
          <div className="refund-page-name">
            <p className="refund-component-name">주문취소</p>
          </div>
          <hr />
        </div>
      </div>
      <Container maxWidth="md" sx={{ marginTop: "2em" }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <div className="refund-info-container">
              <div className="refund-grid-container">
                <p className="refund-product-info">주문취소 상품 정보</p>
                <div className="refund-product-name">상품명 : {productName}</div>
                <div className="refund-option-info">
                  <p>취소 옵션 선택</p>
                  <FormGroup className="refund-form-group">
                    <p className="refund-description">주문취소 옵션을 선택해주세요</p>
                    {optionInfo.map((option: OrderOptionListResponse, index: number) => (
                      <span key={index}>
                        <FormControlLabel
                          control={
                            <Checkbox size="small" onChange={(e) => handleCheckboxChange(e)} />
                          }
                          label={option.optionName}
                          value={option.optionId}
                        />
                      </span>
                    ))}
                  </FormGroup>
                  {selectedItems.length === 0 && (
                    <div className="refund-warning">옵션을 최소 1개 선택해주세요</div>
                  )}
                </div>
                <div className="refund-reason-container">
                  <p>주문취소 사유 선택</p>
                  <FormControl className="refund-form-group">
                    <RadioGroup
                      className="refund-form-group"
                      value={selectedOption}
                      name="radio-buttons-group"
                      onChange={handleOptionChange}
                    >
                      {[
                        "상품이 마음에 들지 않음",
                        "더 저렴한 상품을 발견함",
                        "단순 변심",
                        "직접 입력",
                      ].map((label, idx) => (
                        <FormControlLabel
                          key={`refund-option-${idx + 1}`}
                          control={<Radio size="small" />}
                          value={label}
                          label={label}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  {isTextfieldOpen && (
                    <div>
                      <p>취소 사유를 적어주세요</p>
                      <TextField
                        name="content"
                        style={{ paddingTop: "15px" }}
                        value={customReason}
                        onChange={handleTextfieldChange}
                        multiline
                        minRows={5}
                        maxRows={5}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="refund-submit-btn">
              <Button
                style={{ minWidth: "150px", color: "#578b36", borderColor: "#578b36" }}
                variant="outlined"
                type="submit"
                onClick={handleSubmit}
              >
                주문 취소
              </Button>
            </div>
          </Box>
        </form>
      </Container>
    </div>
  );
};

export default PaymentRefundPage;

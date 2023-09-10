import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import ToggleComponent from "../productOption/ToggleComponent";
import FarmSearch from "../productOption/FarmSearch";
import { Farm } from "entity/farm/Farm";
import "../css/ProductPage.css";

const ProductDetailRegister = ({
  onProductDetailInfoChange,
}: {
  onProductDetailInfoChange: (updatedInfo: any) => void;
}) => {
  const [selectedFarmName, setSelectedFarmName] = useState("");
  const [openFarmSearch, setOpenFarmSearch] = useState(false); // 팝업 오픈 상태
  const [productName, setProductName] = useState(""); // productName 상태 추가
  const [selectedFarm, setSelectedFarm] = useState<null | Farm>(null);
  const [selectedOption, setSelectedOption] = useState<
    "" | { value: string; label: string } | undefined
  >("");

  const handleOpenFarmSearch = () => {
    setOpenFarmSearch(true);
  };

  // 농가 선택 후 처리 함수
  const handleFarmSelect = (selectedFarm: Farm) => {
    setSelectedFarm(selectedFarm);
    setOpenFarmSearch(false); // 팝업 닫기
    onProductDetailInfoChange({ farmName: selectedFarm.farmName });
  };

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  // 설렉트 박스
  const handleOptionChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setSelectedOption(event.target.value as "" | { value: string; label: string });
    onProductDetailInfoChange({ cultivationMethod: event.target.value });
  };

  const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedProductName = event.target.value;
    setProductName(updatedProductName);
  };

  const handleProductNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const updatedProductName = event.target.value;
    onProductDetailInfoChange({ productName: updatedProductName }); 
  };
  
  return (
    <div className="product-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <div>
          <ToggleComponent label="기본정보" height={150}>
            <Box display="flex" flexDirection="column" gap={2}>
              <div className="text-field-container">
                <div className="text-field-label" aria-label="상품명*">
                  상품명*
                </div>
                <TextField
                  name="productName"
                  className="text-field-input"
                  size="small"
                  value={productName}
                  onChange={handleProductNameChange}
                  onBlur={handleProductNameBlur}
                />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">재배방식*</div>
                <FormControl
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Select
                    name="cultivationMethod"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="text-field"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <MenuItem value="">옵션을 선택해주세요</MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="text-field-container">
                <div className="text-field-label">농가 이름*</div>
                <TextField
                  name="farmName"
                  className="text-field-input"
                  size="small"
                  value={selectedFarmName}
                  onChange={(event) => {
                    setSelectedFarmName(event.target.value);
                    onProductDetailInfoChange({ farmName: event.target.value });
                  }}
                />
                <Button onClick={handleOpenFarmSearch}>조회</Button>
                <FarmSearch
                  open={openFarmSearch}
                  onClose={() => setOpenFarmSearch(false)}
                  onSelectFarmName={setSelectedFarmName}
                  onSelectFarm={(selectedFarm) => {
                    setSelectedFarmName(selectedFarm.farmName);
                    handleFarmSelect(selectedFarm);
                  }}
                />
              </div>
            </Box>
          </ToggleComponent>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailRegister;

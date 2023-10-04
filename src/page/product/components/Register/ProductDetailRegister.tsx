import React from "react";
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
import { Farm } from "page/farm/entity/farm/Farm";
import "../../css/ProductPage.css";
import useProductRegisterStore from "page/product/store/ProductRegisterStore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const ProductDetailRegister = () => {
  // Zustand 스토어로부터 필요한 상태와 함수를 가져옴
  const { products, setProducts } = useProductRegisterStore();
  const [selectedFarmName, setSelectedFarmName] = React.useState("");
  const [openFarmSearch, setOpenFarmSearch] = React.useState(false);

  const handleOpenFarmSearch = () => {
    setOpenFarmSearch(true);
  };

  const handleFarmSelect = (selectedFarm: Farm) => {
    const newFarmName = selectedFarm.farmName;
    setSelectedFarmName(newFarmName);
    setOpenFarmSearch(false);
    setProducts({ ...products, farmName: newFarmName });
  };

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  const produceTypesOptions = [
    { value: "POTATO", label: "감자" },
    { value: "SWEET_POTATO", label: "고구마" },
    { value: "CABBAGE", label: "양배추" },
    { value: "KIMCHI_CABBAGE", label: "배추" },
    { value: "LEAF_LETTUCE", label: "상추" },
    { value: "ROMAINE_LETTUCE", label: "로메인 상추" },
    { value: "PEPPER", label: "고추" },
    { value: "GARLIC", label: "마늘" },
    { value: "TOMATO", label: "토마토" },
    { value: "CUCUMBER", label: "오이" },
    { value: "CARROT", label: "당근" },
    { value: "EGGPLANT", label: "가지" },
    { value: "ONION", label: "양파" },
    { value: "YOUNG_PUMPKIN", label: "애호박" },
    { value: "WELSH_ONION", label: "대파" },
  ];

  const handleOptionChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setProducts({
      ...products,
      cultivationMethod: event.target.value.toString(),
    });
  };

  const handleProduceTypesChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setProducts({ ...products, produceType: event.target.value.toString() });
  };

  const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProductName = event.target.value;
    setProducts({ ...products, productName: newProductName });
  };

  return (
    <div className="product-register-detail-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="product-register-toggle-component">
          <ToggleComponent label="기본정보" height={200}>
            <Box display="flex" flexDirection="column" gap={2} width="100%">
              <div className="text-field-container">
                {/* <FiberManualRecordIcon
                  style={{
                    width: "10px",
                    color: "red",
                  }}
                ></FiberManualRecordIcon> */}
                <div className="text-field-label" aria-label="상품명*">
                  상품명*
                </div>
                <TextField
                  name="productName"
                  className="text-field-input"
                  size="small"
                  value={products.productName}
                  onChange={handleProductNameChange}
                />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">농가 이름*</div>
                <TextField
                  name="farmName"
                  className="text-field-input"
                  size="small"
                  value={products.farmName}
                  onChange={(event) => {
                    setSelectedFarmName(event.target.value);
                  }}
                  disabled
                />
                <Button
                  onClick={handleOpenFarmSearch}
                  variant="outlined"
                  style={{
                    marginLeft: "8px",
                    fontFamily: "SUIT-Light",
                    backgroundColor: "#4F72CA",
                    color: "white",
                  }}
                >
                  조회
                </Button>
                <FarmSearch
                  open={openFarmSearch}
                  onClose={() => setOpenFarmSearch(false)}
                  selectedFarmName={selectedFarmName}
                  onSelectFarm={handleFarmSelect}
                />
              </div>
              <div className="select-field-container">
                <div className="select-field">
                  <div className="text-field-label">재배 방식*</div>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Select
                      name="cultivationMethod"
                      value={
                        (products.cultivationMethod as "" | { value: string; label: string }) || ""
                      }
                      onChange={handleOptionChange}
                      className="text-field"
                      sx={{
                        width: "84%",
                      }}
                    >
                      <MenuItem value="">재배 방식을 선택해주세요</MenuItem>
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="select-field">
                  <div className="text-field-label">판매 품목*</div>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Select
                      name="produceType"
                      value={(products.produceType as "" | { value: string; label: string }) || ""}
                      onChange={handleProduceTypesChange}
                      className="text-field"
                      sx={{
                        width: "84%",
                      }}
                    >
                      <MenuItem value="">판매할 상품을 선택해주세요</MenuItem>
                      {produceTypesOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Box>
          </ToggleComponent>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailRegister;

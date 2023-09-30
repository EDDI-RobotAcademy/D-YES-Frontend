import {
  Box,
  Container,
  FormControl,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import ToggleComponent from "../productOption/ToggleComponent";
import useProductModifyRefactorStore from "page/product/store/ProductRefactorModifyStore";
import useProductReadStore from "page/product/store/ProductReadStore";

const ProductDetailModify = () => {
  const { modifyProducts, setModifyProducts } = useProductModifyRefactorStore();
  const { productReads, setProductRead } = useProductReadStore();

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  const saleStatus = [
    { value: "AVAILABLE", label: "판매중" },
    { value: "UNAVAILABLE", label: "판매중지" },
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

  const handleProduceTypesChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setProductRead({
      ...productReads,
      productResponseForAdmin: {
        ...productReads.productResponseForAdmin,
        produceType: event.target.value.toString(),
      },
    });
  };

  const handleProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModifyProducts({
      ...modifyProducts,
      productModifyRequest: {
        ...modifyProducts.productModifyRequest,
        productName: event.target.value,
      },
    });
    setProductRead({
      ...productReads,
      productResponseForAdmin: {
        ...productReads.productResponseForAdmin,
        productName: event.target.value,
      },
    });
  };

  const handleOptionChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setModifyProducts({
      ...modifyProducts,
      productModifyRequest: {
        ...modifyProducts.productModifyRequest,
        cultivationMethod: event.target.value.toString(),
      },
    });
    setProductRead({
      ...productReads,
      productResponseForAdmin: {
        ...productReads.productResponseForAdmin,
        cultivationMethod: event.target.value.toString(),
      },
    });
  };

  const handleSaleStatusChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setModifyProducts({
      ...modifyProducts,
      productModifyRequest: {
        ...modifyProducts.productModifyRequest,
        productSaleStatus: event.target.value.toString(),
      },
    });
    setProductRead({
      ...productReads,
      productResponseForAdmin: {
        ...productReads.productResponseForAdmin,
        productSaleStatus: event.target.value.toString(),
      },
    });
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <div>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <ToggleComponent label="기본정보" height={290}>
            <Box display="flex" flexDirection="column" gap={2}>
              <div className="text-field-container">
                <div className="text-field-label" aria-label="상품명">
                  상품명
                </div>
                <TextField
                  name="productName"
                  className="text-field-input"
                  size="small"
                  value={
                    productReads.productResponseForAdmin?.productName
                      ? productReads.productResponseForAdmin?.productName
                      : modifyProducts.productModifyRequest?.productName
                  }
                  onChange={handleProductNameChange}
                />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">재배방식</div>
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
                    value={
                      (productReads.productResponseForAdmin?.cultivationMethod as
                        | ""
                        | { value: string; label: string }) ||
                      (modifyProducts.productModifyRequest?.cultivationMethod as
                        | ""
                        | { value: string; label: string }) ||
                      ""
                    }
                    sx={{ width: "100%" }}
                    onChange={handleOptionChange}
                  >
                    <MenuItem value="" disabled>
                      옵션을 선택해주세요
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="text-field-container">
                <div className="text-field-label">농가 이름</div>
                <TextField
                  name="farmName"
                  className="text-field-input"
                  size="small"
                  value={productReads.farmInfoResponseForAdmin?.farmName}
                />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">판매 상태</div>
                <FormControl
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Select
                    name="saleStatus"
                    value={
                      (productReads.productResponseForAdmin?.productSaleStatus as
                        | ""
                        | { value: string; label: string }) ||
                      (modifyProducts.productModifyRequest?.productSaleStatus as
                        | ""
                        | { value: string; label: string }) ||
                      ""
                    }
                    sx={{ width: "100%" }}
                    onChange={handleSaleStatusChange}
                  >
                    <MenuItem value="" disabled>
                      판매 상태를 선택해주세요
                    </MenuItem>
                    {saleStatus.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="text-field-container">
                <div className="text-field-label">농산물*</div>
                <FormControl
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Select
                    name="produceTypes"
                    value={
                      (productReads.productResponseForAdmin?.produceType as "" | { value: string; label: string }) || ""
                    }
                    onChange={handleProduceTypesChange}
                    className="text-field"
                    sx={{
                      width: "100%",
                    }}
                    disabled
                  >
                    <MenuItem value="">판매상품을 선택해주세요</MenuItem>
                    {produceTypesOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Box>
          </ToggleComponent>
        </Box>
      </div>
    </Container>
  );
};

export default ProductDetailModify;

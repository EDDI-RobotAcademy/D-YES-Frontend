import { Box, Container, FormControl, MenuItem, Select, TextField } from "@mui/material";
import useProductModifyStore from "store/product/ProductModifyStore";
import ToggleComponent from "../productOption/ToggleComponent";
import { useProductQuery } from "page/product/api/ProductApi";
import { useParams } from "react-router-dom";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ProductDetailModify = () => {
  const { products, setProducts } = useProductModifyStore();
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  
  console.log("받아오는 데이터", data)
  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  const saleStatus = [
    { value: "AVAILABLE", label: "판매중" },
    { value: "UNAVAILABLE", label: "판매중지" },
  ];

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <div>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <ToggleComponent label="기본정보" height={220}>
            <Box display="flex" flexDirection="column" gap={2}>
              <div className="text-field-container">
                <div className="text-field-label" aria-label="상품명">
                  상품명
                </div>
                <TextField
                  name="productName"
                  className="text-field-input"
                  size="small"
                  value={data?.productResponseForAdmin.productName}
                  //   onChange={(e) => setProductName(e.target.value)}
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
                    value={data?.productResponseForAdmin.cultivationMethod || ""}
                    sx={{ width: "100%" }}
                    // onChange={(e) => setSelectedCultivationMethod(e.target.value)}
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
                  value={data?.farmInfoResponseForAdmin.farmName}
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
                    value={data?.productResponseForAdmin.productSaleStatus || ""}
                    sx={{ width: "100%" }}
                    // onChange={(e) => setSelectedSaleStatus(e.target.value)}
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
            </Box>
          </ToggleComponent>
        </Box>
      </div>
    </Container>
  );
};

export default ProductDetailModify;

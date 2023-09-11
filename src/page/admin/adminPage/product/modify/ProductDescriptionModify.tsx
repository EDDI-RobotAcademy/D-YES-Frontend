import { Box, Container } from "@mui/material";
import ToggleComponent from "../productOption/ToggleComponent";
import TextQuill from "utility/quill/TextQuill";
import useProductModifyStore from "store/product/ProductModifyStore";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProductQuery } from "page/product/api/ProductApi";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ProductDescriptionModify = () => {
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  const { products, setProducts } = useProductModifyStore();
  const [productDescription, setProductDescription] = useState("");

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <div>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <ToggleComponent label="상세정보" height={500}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={2}
              aria-label="상세정보"
            >
              <TextQuill
                name="productDescription"
                value={data?.productResponseForAdmin.productDescription || ""}
                setValue={setProductDescription}
                isDisable={false}
              />
            </Box>
          </ToggleComponent>
        </Box>
      </div>
    </Container>
  );
};

export default ProductDescriptionModify;

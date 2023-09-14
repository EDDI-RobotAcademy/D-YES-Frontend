import { Box, Container } from "@mui/material";
import ToggleComponent from "../productOption/ToggleComponent";
import TextQuill from "utility/quill/TextQuill";
import useProductModifyStore from "page/product/store/ProductModifyStore";

const ProductDescriptionModify = () => {
  const { products, setProducts } = useProductModifyStore();

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
                value={products.productDescription || ""}
                setValue={(newValue) => setProducts({ ...products, productDescription: newValue })}
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

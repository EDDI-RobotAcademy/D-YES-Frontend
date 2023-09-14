import ToggleComponent from "../productOption/ToggleComponent";
import TextQuill from "utility/quill/TextQuill";
import { Box, Container } from "@mui/material";
import useProductRegisterStore from "page/product/store/ProductRegisterStore";

const ProductDescription = () => {
  const { products, setProducts } = useProductRegisterStore();

  const handleProductDescriptionChange = (newDescription: string) => {
    setProducts({ ...products, productDescription: newDescription });
  };

  return (
    <div className="product-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <div>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <ToggleComponent label="상세정보" height={500}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={2}
                aria-label="상세정보*"
              >
                <TextQuill
                  name="productDescription"
                  value={products.productDescription}
                  setValue={handleProductDescriptionChange}
                  isDisable={false}
                />
              </Box>
            </ToggleComponent>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default ProductDescription;

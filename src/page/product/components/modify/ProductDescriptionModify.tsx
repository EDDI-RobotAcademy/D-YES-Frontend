import { Box, Container } from "@mui/material";
import ToggleComponent from "../productOption/ToggleComponent";
import TextQuill from "utility/quill/TextQuill";
import useProductModifyRefactorStore from "page/product/store/ProductRefactorModifyStore";
import useProductReadStore from "page/product/store/ProductReadStore";

const ProductDescriptionModify = () => {
  const { modifyProducts, setModifyProducts } = useProductModifyRefactorStore();
  const { productReads, setProductRead } = useProductReadStore();

  const handleProductDescriptionChange = (newDescription: string) => {
    setModifyProducts({
      ...modifyProducts,
      productModifyRequest: {
        ...modifyProducts.productModifyRequest,
        productDescription: newDescription,
      },
    });
    setProductRead({
      ...productReads,
      productResponseForAdmin: {
        ...productReads.productResponseForAdmin,
        productDescription: newDescription,
      },
    });
  };

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
                value={
                  productReads.productResponseForAdmin?.productDescription
                    ? productReads.productResponseForAdmin?.productDescription
                    : modifyProducts.productModifyRequest?.productDescription || ""
                }
                setValue={handleProductDescriptionChange}
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

import React, { useState } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import TextQuill from "utility/quill/TextQuill";
import { Box, Container } from "@mui/material";

const ProductDescription = ({
  onProductDescriptionChange,
}: {
  onProductDescriptionChange: (description: string) => void;
}) => {
  const [productDescription, setProductDescription] = useState("");

  // productDescription이 변경될 때 호출되는 함수
  const handleProductDescriptionChange = (description: string) => {
    setProductDescription(description);
  };

  // 입력 필드에서 포커스가 빠져나갈 때 정보를 전달
  const handleBlur = () => {
    onProductDescriptionChange(productDescription);
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
                  value={productDescription}
                  setValue={handleProductDescriptionChange}
                  onBlur={handleBlur}
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

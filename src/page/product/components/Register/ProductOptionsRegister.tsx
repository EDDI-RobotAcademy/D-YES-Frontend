import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import ToggleComponent from "../productOption/ToggleComponent";
import { useOptions } from "page/product/entity/useOptions";
import OptionTable from "../productOption/OptionTable";
import OptionInput from "../productOption/OptionInput";
import useProductRegisterStore from "page/product/store/ProductRegisterStore";

const ProductOptionsRegister = () => {
  const [optionToggleHeight, setOptionToggleHeight] = useState(220);
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const { products, setProducts } = useProductRegisterStore();

  // 옵션 추가
  const handleAddOption = (newOption: useOptions) => {
    setUseOptions((prevOptions) => [...prevOptions, newOption]);
    // 옵션정보에서 추가버튼을 누르면 토글 증가
    setOptionToggleHeight(optionToggleHeight + 78);
  };

  // 옵션 삭제
  const handleDeleteOption = (index: number) => {
    const newOptions = [...useOptions];
    newOptions.splice(index, 1);
    // 옵션정보에서 삭제버튼을 누르면 토글 감소
    setOptionToggleHeight(optionToggleHeight - 78);
    setUseOptions(newOptions);
  };

  const handleProductOptionChange = (newOption: useOptions[]) => {
    setProducts({ ...products, productOptionList: newOption });
  };

  return (
    <div className="product-register-option-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="product-register-toggle-component">
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <ToggleComponent label="옵션정보" height={optionToggleHeight}>
              <Box display="flex" flexDirection="column" gap={2}>
                <OptionTable
                  optionRows={useOptions}
                  onChangeOption={(index, updatedOption) => {
                    const newOptions = [...useOptions];
                    newOptions[index] = updatedOption;
                    setUseOptions(newOptions);
                    handleProductOptionChange(newOptions);
                  }}
                  onDeleteOption={handleDeleteOption}
                  isEditMode={false}
                />
                <OptionInput onAddOption={handleAddOption} />
              </Box>
            </ToggleComponent>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default ProductOptionsRegister;

import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import ToggleComponent from "../productOption/ToggleComponent";
import { useOptions } from "entity/product/useOptions";
import OptionTable from "../productOption/OptionTable";
import OptionInput from "../productOption/OptionInput";
import useProductRegisterStore from "store/product/ProductRegisterStore";

const ProductOptionsRegister = () => {
  const [optionToggleHeight, setOptionToggleHeight] = useState(200);
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
    <div className="product-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <div>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <ToggleComponent label="옵션정보*" height={optionToggleHeight}>
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

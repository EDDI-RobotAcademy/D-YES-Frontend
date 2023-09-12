import { Container, Box } from "@mui/material";
import { useState } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import OptionTable from "../productOption/OptionTable";
import OptionInput from "../productOption/OptionInput";
import useProductModifyStore from "store/product/ProductModifyStore";
import { useOptions } from "entity/product/useOptions";

const ProductOptionModify = () => {
  const { products, setProducts } = useProductModifyStore();
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);

  function calculateToggleHeight() {
    const minHeight = 100;
    const optionHeight = 78;
    const optionsCount = Array.isArray(products.productOptionList)
      ? products.productOptionList.length
      : 0; // 옵션 개수
    const calculatedHeight = minHeight + optionHeight * optionsCount;

    return calculatedHeight;
  }

  // 옵션 추가
  const handleAddOption = (newOption: useOptions) => {
    setUseOptions((prevOptions) => [...prevOptions, newOption]);
    setOptionToggleHeight(optionToggleHeight + 78);

    // products.productOptionList에도 추가
    setProducts({
      ...products,
      productOptionList: [...products.productOptionList, newOption],
    });
  };

  // 옵션 삭제
  const handleDeleteOption = (index: number) => {
    const newOptions = [...useOptions];
    newOptions.splice(index, 1);
    setOptionToggleHeight(optionToggleHeight - 78);
    setUseOptions(newOptions);

    // products.productOptionList에서도 삭제
    const newProductOptionList = [...products.productOptionList];
    newProductOptionList.splice(index, 1);
    setProducts({
      ...products,
      productOptionList: newProductOptionList,
    });
  };

  const handleProductOptionChange = (newOption: useOptions[]) => {
    setUseOptions(newOption);

    // products.productOptionList에도 수정
    setProducts({
      ...products,
      productOptionList: newOption,
    });
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <div>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <ToggleComponent label="옵션정보" height={calculateToggleHeight()}>
            <Box display="flex" flexDirection="column" gap={2}>
              <OptionTable
                optionRows={products.productOptionList || []}
                onChangeOption={(index, updatedOption) => {
                  const newProductOptionList = [...products.productOptionList];
                  newProductOptionList[index] = updatedOption;
                  handleProductOptionChange(newProductOptionList);
                }}
                onDeleteOption={handleDeleteOption}
                // 옵션 판매 상태
                isEditMode={true}
              />
              <OptionInput onAddOption={handleAddOption} />
            </Box>
          </ToggleComponent>
        </Box>
      </div>
    </Container>
  );
};

export default ProductOptionModify;

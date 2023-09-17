import { Container, Box } from "@mui/material";
import { useState } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import OptionTable from "../productOption/OptionTable";
import OptionInput from "../productOption/OptionInput";
import useProductModifyStore from "page/product/store/ProductModifyStore";
import { useOptions } from "page/product/entity/useOptions";

const ProductOptionModify = () => {
  const { modifyProducts, setModifyProducts } = useProductModifyStore();
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);

  function calculateToggleHeight() {
    const minHeight = 100;
    const optionHeight = 78;
    const optionsCount = Array.isArray(modifyProducts.productOptionList)
      ? modifyProducts.productOptionList.length
      : 0; // 옵션 개수
    const calculatedHeight = minHeight + optionHeight * optionsCount;

    return calculatedHeight;
  }

  // 옵션 추가
  const handleAddOption = (newOption: useOptions) => {
    setUseOptions((prevOptions) => [...prevOptions, newOption]);
    setOptionToggleHeight(optionToggleHeight + 78);

    setModifyProducts({
      ...modifyProducts,
      productOptionList: [...modifyProducts.productOptionList, newOption],
    });
  };

  // 옵션 삭제
  const handleDeleteOption = (index: number) => {
    const newOptions = [...useOptions];
    newOptions.splice(index, 1);
    setOptionToggleHeight(optionToggleHeight - 78);
    setUseOptions(newOptions);

    const newProductOptionList = [...modifyProducts.productOptionList];
    newProductOptionList.splice(index, 1);
    setModifyProducts({
      ...modifyProducts,
      productOptionList: newProductOptionList,
    });
  };

  const handleProductOptionChange = (newOption: useOptions[]) => {
    setUseOptions(newOption);

    setModifyProducts({
      ...modifyProducts,
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
                optionRows={modifyProducts.productOptionList || []}
                onChangeOption={(index, updatedOption) => {
                  const newProductOptionList = [...modifyProducts.productOptionList];
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

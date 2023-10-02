import { Container, Box } from "@mui/material";
import { useState, useEffect } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import OptionTable from "../productOption/OptionTable";
import OptionInput from "../productOption/OptionInput";
import { useOptions } from "page/product/entity/useOptions";
import useProductModifyRefactorStore from "page/product/store/ProductRefactorModifyStore";
import useProductReadStore from "page/product/store/ProductReadStore";

const ProductOptionModify = () => {
  const { modifyProducts, setModifyProducts } = useProductModifyRefactorStore();
  const { productReads, setProductRead } = useProductReadStore();
  const [localOptions, setLocalOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);

  useEffect(() => {
    if (productReads.optionResponseForAdmin) {
      setLocalOptions(productReads.optionResponseForAdmin);
    }
  }, [productReads.optionResponseForAdmin]);

  function calculateToggleHeight() {
    const minHeight = 150;
    const optionHeight = 78;
    const optionsCount = Array.isArray(localOptions) ? localOptions.length : 0;
    const calculatedHeight = minHeight + optionHeight * optionsCount;

    return calculatedHeight;
  }

  // 옵션 추가
  const handleAddOption = (newOption: useOptions) => {
    const newOptions = [...localOptions, newOption];
    setLocalOptions(newOptions);
    setOptionToggleHeight(optionToggleHeight + 78);

    if (modifyProducts.productOptionModifyRequest) {
      setModifyProducts({
        ...modifyProducts,
        productOptionModifyRequest: [...modifyProducts.productOptionModifyRequest, newOption],
      });
    }

    if (productReads.optionResponseForAdmin) {
      setProductRead({
        ...productReads,
        optionResponseForAdmin: [...productReads.optionResponseForAdmin, newOption],
      });
    }
  };

  // 옵션 삭제
  const handleDeleteOption = (index: number) => {
    const newOptions = [...localOptions];
    newOptions.splice(index, 1);
    setOptionToggleHeight(optionToggleHeight - 78);
    setLocalOptions(newOptions);

    if (modifyProducts.productOptionModifyRequest) {
      const newProductOptionList = [...modifyProducts.productOptionModifyRequest];
      newProductOptionList.splice(index, 1);
      setModifyProducts({
        ...modifyProducts,
        productOptionModifyRequest: newProductOptionList,
      });
    }

    if (productReads.optionResponseForAdmin) {
      const newProductOptionList = [...productReads.optionResponseForAdmin];
      newProductOptionList.splice(index, 1);
      setProductRead({
        ...productReads,
        optionResponseForAdmin: newProductOptionList,
      });
    }
  };

  const handleProductOptionChange = (updatedOption: useOptions, index: number) => {
    const newOptions = [...localOptions];
    newOptions[index] = updatedOption;
    setLocalOptions(newOptions);

    if (modifyProducts.productOptionModifyRequest) {
      const newProductOptionList = [...modifyProducts.productOptionModifyRequest];
      newProductOptionList[index] = updatedOption;
      setModifyProducts({
        ...modifyProducts,
        productOptionModifyRequest: newProductOptionList,
      });
    }

    if (productReads.optionResponseForAdmin) {
      const newProductOptionList = [...productReads.optionResponseForAdmin];
      newProductOptionList[index] = updatedOption;
      setProductRead({
        ...productReads,
        optionResponseForAdmin: newProductOptionList,
      });
    }
  };

  return (
    <div className="product-modify-option-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="product-modify-toggle-component">
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <ToggleComponent label="옵션정보" height={calculateToggleHeight()}>
              <Box display="flex" flexDirection="column" gap={2}>
                <OptionTable
                  optionRows={localOptions || []}
                  onChangeOption={(index, updatedOption) => {
                    handleProductOptionChange(updatedOption, index);
                  }}
                  onDeleteOption={(index) => {
                    handleDeleteOption(index);
                  }}
                  isEditMode={true}
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

export default ProductOptionModify;

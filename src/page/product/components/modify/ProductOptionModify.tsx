import { Container, Box } from "@mui/material";
import { useState } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import OptionTable from "../productOption/OptionTable";
import OptionInput from "../productOption/OptionInput";
import { useOptions } from "page/product/entity/useOptions";
import useProductModifyRefactorStore from "page/product/store/ProductRefactorModifyStore";
import useProductReadStore from "page/product/store/ProductReadStore";

const ProductOptionModify = () => {
  const { modifyProducts, setModifyProducts } = useProductModifyRefactorStore();
  const { productReads, setProductRead } = useProductReadStore();
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);

  if (!modifyProducts.productOptionModifyRequest) {
    setModifyProducts({
      ...modifyProducts,
      productOptionModifyRequest: [],
    });
  }

  function calculateToggleHeight() {
    const minHeight = 180;
    const optionHeight = 78;
    const optionsCount = Array.isArray(productReads.optionResponseForAdmin)
      ? productReads.optionResponseForAdmin.length
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
      productOptionModifyRequest: [
        ...modifyProducts.productOptionModifyRequest,
        newOption,
      ],
    });

    setProductRead({
      ...productReads,
      optionResponseForAdmin: [
        ...productReads.optionResponseForAdmin,
        newOption,
      ],
    });
  };

  // 옵션 삭제
  const handleDeleteOption = (index: number) => {
    const newOptions = [...useOptions];
    newOptions.splice(index, 1);
    setOptionToggleHeight(optionToggleHeight - 78);
    setUseOptions(newOptions);

    const newProductOptionList = [...modifyProducts.productOptionModifyRequest];
    newProductOptionList.splice(index, 1);
    setModifyProducts({
      ...modifyProducts,
      productOptionModifyRequest: newProductOptionList,
    });

    setProductRead({
      ...productReads,
      optionResponseForAdmin: newProductOptionList,
    });
  };

  const handleProductOptionChange = (newOption: useOptions[]) => {
    setUseOptions(newOption);

    setModifyProducts({
      ...modifyProducts,
      productOptionModifyRequest: newOption,
    });

    setProductRead({
      ...productReads,
      optionResponseForAdmin: newOption,
    });
  };

  return (
    <div className="product-modify-option-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="product-modify-toggle-component">
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <ToggleComponent label="옵션정보" height={calculateToggleHeight()}>
              <Box display="flex" flexDirection="column" gap={2}>
                <OptionTable
                  optionRows={productReads.optionResponseForAdmin || []}
                  onChangeOption={(index, updatedOption) => {
                    const newProductOptionList = [
                      ...modifyProducts.productOptionModifyRequest,
                    ];
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
    </div>
  );
};

export default ProductOptionModify;

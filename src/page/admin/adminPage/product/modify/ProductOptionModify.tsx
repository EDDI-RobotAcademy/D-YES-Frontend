import { Container, Box } from "@mui/material";
import React, { useState } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import OptionTable from "../productOption/OptionTable";
import OptionInput from "../productOption/OptionInput";
import useProductModifyStore from "store/product/ProductModifyStore";
import { useOptions } from "entity/product/useOptions";
import { useParams } from "react-router-dom";
import { useProductQuery } from "page/product/api/ProductApi";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ProductOptionModify = () => {
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  const { products, setProducts } = useProductModifyStore();
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);

  function calculateToggleHeight() {
    const minHeight = 100; // 최소 높이
    const optionHeight = 78; // 각 옵션 아이템의 높이
    const optionsCount = data?.optionResponseForAdmin?.length || 0; // 옵션 개수
    const calculatedHeight = minHeight + optionHeight * optionsCount;

    return calculatedHeight;
  }

  // 옵션 추가
  const handleAddOption = (newOption: useOptions) => {
    setUseOptions((prevOptions) => [...prevOptions, newOption]);
    // 옵션정보에서 추가버튼을 누르면 토글 높이 증가
    setOptionToggleHeight(optionToggleHeight + 78);
  };

  // 옵션 삭제
  const handleDeleteOption = (index: number) => {
    const newOptions = [...useOptions];
    newOptions.splice(index, 1);
    // 옵션정보에서 삭제버튼을 누르면 토글 높이 감소
    setOptionToggleHeight(optionToggleHeight - 78);
    setUseOptions(newOptions);
  };
  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <div>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <ToggleComponent label="옵션정보" height={calculateToggleHeight()}>
            <Box display="flex" flexDirection="column" gap={2}>
              <OptionTable
                optionRows={data?.optionResponseForAdmin || []}
                onChangeOption={(index, updatedOption) => {
                  const newOptions = [...useOptions];
                  newOptions[index] = updatedOption;
                  setUseOptions(newOptions);
                }}
                onDeleteOption={handleDeleteOption}
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

import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { registerProduct } from "../api/ProductApi";
import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import "./css/ProductPage.css";
import ToggleComponent from "./productOption/ToggleComponent";
import OptionTable from "./productOption/OptionTable";
import OptionInput from "./productOption/OptionInput";
import { useOptions } from "../entity/useOptions";
import { ProductImg } from "../entity/ProductMainImg";
import { ProductDetailImg } from "../entity/ProductDetailImg";
import { Product } from "../entity/Product";
import { Farm } from "page/farm/entity/Farm";
import FarmSearch from "./productOption/FarmSearch";

const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [selectedOption, setSelectedOption] = useState<
    "" | { value: string; label: string } | undefined
  >("");
  const [optionToggleHeight, setOptionToggleHeight] = useState(200);
  const userToken = localStorage.getItem("userToken");
  const [selectedFarmName, setSelectedFarmName] = useState("");
  const [openFarmSearch, setOpenFarmSearch] = useState(false); // 팝업 오픈 상태
  const [selectedFarm, setSelectedFarm] = useState<null | Farm>(null);

  const handleOpenFarmSearch = () => {
    setOpenFarmSearch(true);
  };

  // 농가 선택 후 처리 함수
  const handleFarmSelect = (selectedFarm: Farm) => {
    setSelectedFarm(selectedFarm);
    setOpenFarmSearch(false); // 팝업 닫기
  };

  const mutation = useMutation(registerProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData("product", data);
      console.log("데이터확인", data);
      navigate("/");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      elements: {
        productName: { value: string };
        productDescription: { value: string };
        cultivationMethod: { value: string };
        mainImg: { value: string };
        detailImgs: { value: string };
        farmName: { value: string };
      };
    };

    const { productName, productDescription, cultivationMethod, mainImg, detailImgs, farmName } =
      target.elements;

    const optionObjects: Partial<useOptions>[] = useOptions.map((option) => ({
      optionName: option.optionName,
      optionPrice: option.optionPrice,
      stock: option.stock,
      value: option.value,
      unit: option.unit,
    }));

    const productMainImageRegisterRequest: ProductImg = {
      mainImg: mainImg.value,
    };

    const productDetailImagesRegisterRequests: ProductDetailImg[] = [
      { detailImgs: detailImgs.value },
    ];

    const productRegisterRequest: Partial<Product> = {
      productName: productName.value,
      productDescription: productDescription.value,
      cultivationMethod: cultivationMethod.value,
    };

    const data = {
      productRegisterRequest: productRegisterRequest,
      productOptionRegisterRequest: optionObjects,
      productMainImageRegisterRequest: productMainImageRegisterRequest,
      productDetailImagesRegisterRequests: productDetailImagesRegisterRequests,
      userToken: userToken || "",
      farmName: farmName.value,
    };

    console.log("데이터가 가냐:", data);
    await mutation.mutateAsync({
      ...data,
      productRegisterRequest: productRegisterRequest as Product,
      productOptionRegisterRequest: optionObjects as useOptions[],
    });
  };

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  // 설렉트 박스
  const handleOptionChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setSelectedOption(event.target.value as "" | { value: string; label: string });
  };

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

  // 토글클릭과 등록버튼의 동작 분리
  const handleFormClick = (event: React.MouseEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;
    if (!target.matches('button[type="submit"]')) {
      event.preventDefault();
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <form onSubmit={handleSubmit} onClick={handleFormClick}>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <h1>상품 등록</h1>
          <ToggleComponent label="기본정보" height={150}>
            <Box display="flex" flexDirection="column" gap={2}>
              <div className="text-field-container">
                <div className="text-field-label" aria-label="상품명">
                  상품명
                </div>
                <TextField name="productName" className="text-field-input" size="small" />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">재배방식</div>
                <FormControl
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Select
                    name="cultivationMethod"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="text-field"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <MenuItem value="">옵션을 선택해주세요</MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="text-field-container">
                <div className="text-field-label">농가 이름</div>
                <TextField
                  name="farmName"
                  className="text-field-input"
                  size="small"
                  value={selectedFarmName} // 선택된 농가 이름 상태를 값으로 설정
                />
                <Button onClick={handleOpenFarmSearch}>조회</Button>
                <FarmSearch
                  open={openFarmSearch}
                  onClose={() => setOpenFarmSearch(false)} // 팝업 닫기 함수
                  onSelectFarmName={setSelectedFarmName} // 선택된 농가 이름 상태 업데이트
                  onSelectFarm={(selectedFarm) => {
                    setSelectedFarmName(selectedFarm.farmName);
                    handleFarmSelect(selectedFarm); // 농가 선택 후 처리 함수 호출
                  }}
                />
              </div>
            </Box>
          </ToggleComponent>
          <ToggleComponent label="이미지" height={120}>
            <div className="text-field-label">메인 이미지</div>
            <TextField name="mainImg" className="text-field-input" size="small" />
            <div className="text-field-label">상세 이미지</div>
            <TextField name="detailImgs" className="text-field-input" size="small" />
          </ToggleComponent>
          <ToggleComponent label="옵션정보" height={optionToggleHeight}>
            <Box display="flex" flexDirection="column" gap={2}>
              <OptionTable
                optionRows={useOptions}
                onChangeOption={(index, updatedOption) => {
                  const newOptions = [...useOptions];
                  newOptions[index] = updatedOption;
                  setUseOptions(newOptions);
                }}
                onDeleteOption={handleDeleteOption}
              />
              <OptionInput onAddOption={handleAddOption} />
            </Box>
          </ToggleComponent>
          <ToggleComponent label="상세정보" height={300}>
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <div className="text-field-label" aria-label="상세정보">
                상세정보
              </div>
              <TextField
                name="productDescription"
                className="text-field-input"
                multiline
                minRows={10}
                maxRows={20}
              />
            </Box>
          </ToggleComponent>
        </Box>
        <Button type="submit">등록</Button>
      </form>
    </Container>
  );
};

export default ProductRegisterPage;

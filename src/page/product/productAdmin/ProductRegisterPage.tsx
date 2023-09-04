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
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";
import { toast } from "react-toastify";
import TextQuill from "utility/quill/TextQuill";

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
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [productDescription, setProductDescription] = useState("");

  const handleOpenFarmSearch = () => {
    setOpenFarmSearch(true);
  };

  // 농가 선택 후 처리 함수
  const handleFarmSelect = (selectedFarm: Farm) => {
    setSelectedFarm(selectedFarm);
    setOpenFarmSearch(false); // 팝업 닫기
  };

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setSelectedMainImage(compressedImage);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onDetailImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const compressedImages = await Promise.all(
          acceptedFiles.map(async (file) => {
            return await compressImg(file);
          })
        );
        const updatedImages = [...selectedDetailImages, ...compressedImages];
        setSelectedDetailImages(updatedImages);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps, getInputProps: mainImageInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
  });

  const { getRootProps: detailImageRootProps, getInputProps: detailImageInputProps } = useDropzone({
    onDrop: onDetailImageDrop,
    maxFiles: 10,
  });

  const handleRemoveDetailImage = (event: React.MouseEvent, index: number) => {
    // 이미지를 삭제할 때 이미지 불러오기 방지
    event.stopPropagation();
    const updatedImages = [...selectedDetailImages];
    updatedImages.splice(index, 1);
    setSelectedDetailImages(updatedImages);
  };

  const mutation = useMutation(registerProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData("product", data);
      navigate("/");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const detailImageUpload = selectedDetailImages.map(async (image) => {
      const detailFileToUpload = new File([image], image.name);
      return (await uploadFileAwsS3(detailFileToUpload)) || "";
    });
    const s3DetailObjectVersion = await Promise.all(detailImageUpload);

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

    const { productName, cultivationMethod, farmName } = target.elements;

    if (!productName.value || !cultivationMethod.value || !farmName.value) {
      toast.success("필수 입력 항목을 모두 채워주세요.");
      return;
    }

    if (!productDescription) {
      toast.success("상세정보를 입력해주세요."); // 상세정보가 비어 있을 때 메시지를 변경
      return;
    }

    // some함수는 배열 요소 중 하나라도 조건을 만족하면 true를 반환
    // some함수는 useOptions배열을 순회하면서 중복 여부를 확인
    // 조건은 옵션명이 동일하고 옵션의 인덱스가 같이 않을 때
    // 중복한 옵션이 있다면 true를 반환
    const isDuplicateOptionName = useOptions.some((option, index) =>
      useOptions.some(
        (otherOption, otherIndex) =>
          option.optionName === otherOption.optionName && index !== otherIndex
      )
    );

    if (isDuplicateOptionName) {
      toast.error("이미 존재하는 옵션 이름입니다.");
      return;
    }

    const hasIncompleteOption = useOptions.some((option) => {
      return !option.optionName || !option.optionPrice || !option.stock || !option.unit;
    });

    if (hasIncompleteOption) {
      toast.error("옵션 정보를 모두 입력해주세요.");
      return;
    }

    if (selectedDetailImages.length === 0) {
      toast.error("상세 이미지를 추가해주세요.");
      return;
    }

    if (selectedDetailImages.length < 6 || selectedDetailImages.length > 10) {
      toast.error("상세 이미지를 최소 6장, 최대 10장 등록해주세요.");
      return;
    }

    const optionObjects: Partial<useOptions>[] = useOptions.map((option) => ({
      optionName: option.optionName,
      optionPrice: option.optionPrice,
      stock: option.stock,
      value: option.value,
      unit: option.unit,
    }));

    const mainFileToUpload = selectedMainImage
      ? new File([selectedMainImage], selectedMainImage.name)
      : "";
    if (!mainFileToUpload) {
      toast.success("메인 이미지를 등록해주세요");
      return;
    }
    const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

    const partialProductMainImageRegisterRequest: Partial<ProductImg> = {
      mainImg: selectedMainImage
        ? selectedMainImage.name + "?versionId=" + s3MainObjectVersion
        : "undefined main image",
    };

    const detailImgsName = selectedDetailImages.map((image, idx) => {
      return image.name + "?versionId=" + s3DetailObjectVersion[idx];
    });

    const productDetailImagesRegisterRequests: Partial<ProductDetailImg>[] = detailImgsName.map(
      (detailImg) => ({
        detailImgs: detailImg,
      })
    );

    const productRegisterRequest: Partial<Product> = {
      productName: productName.value,
      productDescription: productDescription,
      cultivationMethod: cultivationMethod.value,
    };

    const data = {
      productRegisterRequest: productRegisterRequest,
      productOptionRegisterRequest: optionObjects,
      productMainImageRegisterRequest: partialProductMainImageRegisterRequest,
      productDetailImagesRegisterRequests: productDetailImagesRegisterRequests,
      userToken: userToken || "",
      farmName: farmName.value,
    };

    await mutation.mutateAsync({
      ...data,
      productRegisterRequest: productRegisterRequest as Product,
      productOptionRegisterRequest: optionObjects as useOptions[],
      productMainImageRegisterRequest: partialProductMainImageRegisterRequest as ProductImg,
      productDetailImagesRegisterRequests:
        productDetailImagesRegisterRequests as ProductDetailImg[],
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
                <div className="text-field-label" aria-label="상품명*">
                  상품명*
                </div>
                <TextField name="productName" className="text-field-input" size="small" />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">재배방식*</div>
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
                <div className="text-field-label">농가 이름*</div>
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
          <ToggleComponent label="이미지" height={850}>
            <div className="text-field-label">메인 이미지*</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "400px",
                backgroundColor: "#e4e4e4",
                cursor: "pointer",
              }}
              {...mainImageRootProps()}
            >
              {selectedMainImage ? (
                <img
                  // 선택된 사진이 있으면 미리보기
                  src={URL.createObjectURL(selectedMainImage)}
                  style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                  alt="Selected"
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div>상품의 메인 이미지를 추가해주세요.</div>
                  <div>메인 이미지는 사용자에게 가장 처음 보여지는 대표 이미지입니다.</div>
                  <input {...mainImageInputProps()} />
                </div>
              )}
            </div>
            <div className="text-field-label">상세 이미지*</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "400px",
                backgroundColor: "#e4e4e4",
                cursor: "pointer",
                flexWrap: "wrap", // 이미지가 4개 이상일 경우 줄바꿈
              }}
              {...detailImageRootProps()}
            >
              {selectedDetailImages.length > 0 ? (
                selectedDetailImages.map((image, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "calc(33.33% - 16px)",
                      height: "auto",
                      margin: "8px",
                      cursor: "pointer",
                      position: "relative", // 상대 위치 설정
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${idx}`}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <RemoveCircleOutlineSharpIcon
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                        zIndex: 1,
                      }}
                      onClick={(event) => handleRemoveDetailImage(event, idx)}
                    />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <div>상품의 상세 이미지를 추가해주세요.</div>
                  <div>상세 이미지는 최소 6장, 최대 10장까지 등록할 수 있습니다.</div>
                  <input {...detailImageInputProps()} />
                </div>
              )}
            </div>
          </ToggleComponent>
          <ToggleComponent label="옵션정보*" height={optionToggleHeight}>
            <Box display="flex" flexDirection="column" gap={2}>
              <OptionTable
                optionRows={useOptions}
                onChangeOption={(index, updatedOption) => {
                  const newOptions = [...useOptions];
                  newOptions[index] = updatedOption;
                  setUseOptions(newOptions);
                }}
                onDeleteOption={handleDeleteOption}
                isEditMode={false}
              />
              <OptionInput onAddOption={handleAddOption} />
            </Box>
          </ToggleComponent>
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
                setValue={setProductDescription}
                isDisable={false}
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

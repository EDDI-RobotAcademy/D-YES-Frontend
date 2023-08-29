import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, useProductQuery } from "../api/ProductApi";
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
import ToggleComponent from "./productOption/ToggleComponent";
import OptionTable from "./productOption/OptionTable";
import OptionInput from "./productOption/OptionInput";
import { useOptions } from "../entity/useOptions";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { getImageUrl } from "utility/s3/awsS3";

const AdminProductModifyPage = ({ productId }: { productId: string }) => {
  const navigate = useNavigate();
  const { data } = useProductQuery(productId || "");
  const [selectedOption, setSelectedOption] = useState<
    "" | { value: string; label: string } | undefined
  >("");
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await fetchProduct(productId || "");
      console.log("읽기 확인", data);
    };
    fetchProductData();
  }, []);

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  const handleOptionChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setSelectedOption(event.target.value as "" | { value: string; label: string });
  };

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setSelectedMainImage(compressedImage);
        // localStorage.setItem("mainImg", compressedImage.name);
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
        setSelectedDetailImages(compressedImages);
        // localStorage.setItem(
        //   "detailImg",
        //   JSON.stringify(compressedImages.map((detailImage) => detailImage.name))
        // );
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
    maxFiles: 6,
  });

  function calculateToggleHeight(options: Array<any>) {
    const minHeight = 100; // 최소 높이
    const optionHeight = 78; // 각 옵션 아이템의 높이
    const optionsCount = options?.length || 0; // 옵션 개수

    // 최소 높이와 각 옵션 아이템 높이를 고려하여 토글 높이 계산
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

  const handleFormClick = (event: React.MouseEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;
    if (!target.matches('button[type="submit"]')) {
      event.preventDefault();
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <form onClick={handleFormClick}>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <h1>상품 수정</h1>
          {data ? (
            <>
              <ToggleComponent label="기본정보" height={150}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <div className="text-field-container">
                    <div className="text-field-label" aria-label="상품명">
                      상품명
                    </div>
                    <TextField
                      name="productName"
                      className="text-field-input"
                      size="small"
                      value={data.productResponseForAdmin?.productName || ""}
                    />
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
                        value={data.productResponseForAdmin?.cultivationMethod || ""}
                        sx={{ width: "100%" }}
                      >
                        <MenuItem value="" disabled>
                          옵션을 선택해주세요
                        </MenuItem>
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
                      value={data.farmInfoResponseForAdmin?.farmName}
                    />
                  </div>
                </Box>
              </ToggleComponent>
              <ToggleComponent label="이미지" height={850}>
                <div className="text-field-label">메인 이미지</div>
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
                  {data.mainImageResponseForAdmin?.mainImg && (
                    <img
                      src={getImageUrl(data.mainImageResponseForAdmin.mainImg)}
                      style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                      alt="Selected"
                    />
                  )}
                </div>
                <div className="text-field-label">상세 이미지</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "400px",
                    backgroundColor: "#e4e4e4",
                    cursor: "pointer",
                    flexWrap: "wrap",
                  }}
                  {...detailImageRootProps()}
                >
                  {data.detailImagesForAdmin?.length > 0
                    ? data.detailImagesForAdmin.map((detailImage, idx) => (
                        <img
                          key={idx}
                          src={getImageUrl(detailImage.detailImgs)}
                          style={{
                            width: "calc(33.33% - 16px)",
                            height: "auto",
                            margin: "8px",
                            cursor: "pointer",
                          }}
                          alt={`Selected ${idx}`}
                        />
                      ))
                    : null}
                </div>
              </ToggleComponent>
              <ToggleComponent
                label="옵션정보"
                height={calculateToggleHeight(data.optionResponseForAdmin)}
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  <OptionTable
                    optionRows={data.optionResponseForAdmin || []} // 서버에서 받아온 옵션 정보를 활용
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
                    value={data.productResponseForAdmin?.productDescription}
                  />
                </Box>
              </ToggleComponent>
            </>
          ) : (
            <p>Loading product data...</p>
          )}
        </Box>
        <Button type="submit">수정 완료</Button>
      </form>
    </Container>
  );
};

export default AdminProductModifyPage;
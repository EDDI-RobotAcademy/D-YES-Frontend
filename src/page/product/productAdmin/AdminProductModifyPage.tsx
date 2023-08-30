import React, { useEffect, useState } from "react";
import { fetchProduct, useProductQuery, useProductUpdateMutation } from "../api/ProductApi";
import { Box, Button, Container, FormControl, MenuItem, Select, TextField } from "@mui/material";
import ToggleComponent from "./productOption/ToggleComponent";
import OptionTable from "./productOption/OptionTable";
import OptionInput from "./productOption/OptionInput";
import { useOptions } from "../entity/useOptions";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { getImageUrl, uploadFileAwsS3 } from "utility/s3/awsS3";
import { useQueryClient } from "react-query";
import { ProductModify } from "../entity/ProductModify";
import { Product } from "../entity/Product";
import { ProductImg } from "../entity/ProductMainImg";
import { ProductDetailImg } from "../entity/ProductDetailImg";
import { useNavigate } from "react-router-dom";

const AdminProductModifyPage = ({ productId }: { productId: string }) => {
  const navigate = useNavigate();
  const { data } = useProductQuery(productId || "");
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [productName, setProductName] = useState("");
  const [selectedCultivationMethod, setSelectedCultivationMethod] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const mutation = useProductUpdateMutation();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await fetchProduct(productId || "");
      if (data) {
        // 수정 데이터 업데이트
        setProductName(data.productResponseForAdmin?.productName || "");
        setSelectedCultivationMethod(data.productResponseForAdmin?.cultivationMethod || "");
        setUseOptions(data.optionResponseForAdmin || []);
        setProductDescription(data.productResponseForAdmin?.productDescription || "");
      }
    };
    fetchProductData();
  }, []);

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

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
        setSelectedDetailImages(compressedImages);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
  });

  const { getRootProps: detailImageRootProps } = useDropzone({
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

  const handleEditFinishClick = async () => {
    if (productName && selectedCultivationMethod && productDescription) {
      const productModifyRequestData: Partial<Product> = {
        productName: productName,
        cultivationMethod: selectedCultivationMethod,
        productDescription: productDescription,
      };

      const mainFileToUpload = selectedMainImage
        ? new File([selectedMainImage], selectedMainImage.name)
        : "";
      if (!mainFileToUpload) {
        alert("메인 이미지를 등록해주세요");
        return;
      }
      const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

      const productMainImageModifyRequest: ProductImg = {
        mainImageId: data!.mainImageResponseForAdmin!.mainImageId,
        mainImg: selectedMainImage
          ? selectedMainImage.name + "?versionId=" + s3MainObjectVersion
          : "undefined main image",
      };

      const detailImageUploadPromises = selectedDetailImages.map(async (image, idx) => {
        const detailFileToUpload = new File([image], image.name);
        const s3DetailObjectVersion = await uploadFileAwsS3(detailFileToUpload);

        return {
          detailImageId: data!.detailImagesForAdmin[idx]!.detailImageId,
          detailImgs: image.name + "?versionId=" + s3DetailObjectVersion,
        };
      });

      const productDetailImagesModifyRequest = await Promise.all(detailImageUploadPromises);

      const updatedData: ProductModify = {
        productId: parseInt(productId),
        productModifyRequest: productModifyRequestData,
        productOptionModifyRequest: useOptions,
        productMainImageModifyRequest: productMainImageModifyRequest,
        productDetailImagesModifyRequest: productDetailImagesModifyRequest,
        userToken: userToken || "",
      };
      await mutation.mutateAsync(updatedData);
      queryClient.invalidateQueries(["productModify", parseInt(productId)]);
      navigate("/");
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
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
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
                        value={selectedCultivationMethod}
                        sx={{ width: "100%" }}
                        onChange={(e) => setSelectedCultivationMethod(e.target.value)}
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
                  {selectedMainImage ? (
                    <img
                      src={URL.createObjectURL(selectedMainImage)}
                      style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                      alt="Selected"
                    />
                  ) : data.mainImageResponseForAdmin?.mainImg ? (
                    <img
                      src={getImageUrl(data.mainImageResponseForAdmin.mainImg)}
                      style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                      alt="Selected"
                    />
                  ) : null}
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
                  {selectedDetailImages.length > 0
                    ? selectedDetailImages.map((selectedImage, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(selectedImage)}
                          style={{
                            width: "calc(33.33% - 16px)",
                            height: "auto",
                            margin: "8px",
                            cursor: "pointer",
                          }}
                          alt={`Selected ${idx}`}
                        />
                      ))
                    : data.detailImagesForAdmin?.length > 0
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
              {data.optionResponseForAdmin ? (
                <ToggleComponent label="옵션정보" height={calculateToggleHeight(useOptions)}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <OptionTable
                      optionRows={useOptions || []}
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
              ) : null}
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
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                </Box>
              </ToggleComponent>
            </>
          ) : (
            <p>Loading product data...</p>
          )}
        </Box>
        <Button variant="outlined" onClick={handleEditFinishClick}>
          수정 완료
        </Button>
      </form>
    </Container>
  );
};

export default AdminProductModifyPage;

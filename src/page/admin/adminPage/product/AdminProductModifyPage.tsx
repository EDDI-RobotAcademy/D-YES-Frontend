import React, { useEffect, useState } from "react";
import { Box, Button, Container, FormControl, MenuItem, Select, TextField } from "@mui/material";
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";
import ToggleComponent from "./productOption/ToggleComponent";
import OptionTable from "./productOption/OptionTable";
import OptionInput from "./productOption/OptionInput";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { getImageUrl, uploadFileAwsS3 } from "utility/s3/awsS3";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TextQuill from "utility/quill/TextQuill";
import {
  fetchProduct,
  useProductQuery,
  useProductUpdateMutation,
} from "page/product/api/ProductApi";
import { useOptions } from "entity/product/useOptions";
import { ProductDetailImg } from "entity/product/ProductDetailImg";
import { Product } from "entity/product/Product";
import { ProductImg } from "entity/product/ProductMainImg";
import { ProductModify } from "entity/product/ProductModify";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const AdminProductModifyPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [optionToggleHeight, setOptionToggleHeight] = useState(0);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [serverDetailImages, setServerDetailImages] = useState<ProductDetailImg[]>([]);
  const [deletedImageIndexes, setDeletedImageIndexes] = useState<number[]>([]);
  const [productName, setProductName] = useState("");
  const [selectedCultivationMethod, setSelectedCultivationMethod] = useState("");
  const [selectedSaleStatus, setSelectedSaleStatus] = useState("");
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
        setSelectedSaleStatus(data.productResponseForAdmin?.productSaleStatus || "AVAILABLE");
        setServerDetailImages(data.detailImagesForAdmin || []);
      }
    };
    fetchProductData();
  }, []);

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  const saleStatus = [
    { value: "AVAILABLE", label: "판매중" },
    { value: "UNAVAILABLE", label: "판매중지" },
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
            return {
              image: await compressImg(file),
              detailImageId: 0,
            };
          })
        );

        setSelectedDetailImages((prevImages: File[]) => [
          ...prevImages,
          ...compressedImages.map((item) => item.image),
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
    noClick: false,
  });

  const { getRootProps: detailImageRootProps } = useDropzone({
    onDrop: onDetailImageDrop,
    maxFiles: 10,
    noClick: false,
  });

  const handleDeleteDetailImage = (event: React.MouseEvent, imageIdToDelete: number) => {
    event.stopPropagation();

    const updatedServerDetailImages = serverDetailImages.filter(
      (detailImage) => detailImage.detailImageId !== imageIdToDelete
    );

    // 이미지를 제거한 후, 해당 이미지의 인덱스를 deletedImageIndexes 배열에 추가
    setServerDetailImages(updatedServerDetailImages);

    // 이미지 삭제할 때 해당 이미지의 인덱스를 deletedImageIndexes 배열에 추가
    setDeletedImageIndexes((prevIndexes) => [...prevIndexes, imageIdToDelete]);
  };

  const handleRemoveDetailImage = (event: React.MouseEvent, index: number) => {
    // 이미지를 삭제할 때 이미지 불러오기 방지
    event.stopPropagation();
    const updatedImages = [...selectedDetailImages];
    updatedImages.splice(index, 1);
    setSelectedDetailImages(updatedImages);
  };

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
    if (productName && selectedCultivationMethod && productDescription && selectedSaleStatus) {
      const productModifyRequestData: Partial<Product> = {
        productName: productName,
        cultivationMethod: selectedCultivationMethod,
        productDescription: productDescription,
        productSaleStatus: selectedSaleStatus,
      };

      const existingMainImageUrl = data?.mainImageResponseForAdmin?.mainImg;

      const mainFileToUpload = selectedMainImage
        ? new File([selectedMainImage], selectedMainImage.name)
        : undefined;

      let s3MainObjectVersion = "";
      if (mainFileToUpload) {
        s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";
      }

      const productMainImageModifyRequest: ProductImg = {
        mainImageId: data!.mainImageResponseForAdmin!.mainImageId,
        mainImg: mainFileToUpload
          ? selectedMainImage
            ? selectedMainImage.name + "?versionId=" + s3MainObjectVersion
            : "undefined main image"
          : existingMainImageUrl || "undefined main image",
      };

      const detailImageUploadPromises = selectedDetailImages.map(async (image, idx) => {
        const detailFileToUpload = new File([image], image.name);
        const s3DetailObjectVersion = await uploadFileAwsS3(detailFileToUpload);

        return {
          detailImageId: 0,
          detailImgs: image.name + "?versionId=" + s3DetailObjectVersion,
        };
      });

      const productDetailImagesModifyRequest = await Promise.all(detailImageUploadPromises);

      if (selectedDetailImages.length === 0 || selectedDetailImages.length !== 0) {
        const existingDetailImageRequests = (data?.detailImagesForAdmin || []).map(
          (existingDetailImage) => ({
            detailImageId: existingDetailImage.detailImageId || 0,
            detailImgs: existingDetailImage.detailImgs || "undefined detail image",
          })
        );

        productDetailImagesModifyRequest.push(...existingDetailImageRequests);
      }

      const updatedProductDetailImagesModifyRequest = productDetailImagesModifyRequest.filter(
        (detailImage) => !deletedImageIndexes.includes(detailImage.detailImageId)
      );

      const updatedData: ProductModify = {
        productId: parseInt(productId || ""),
        productModifyRequest: productModifyRequestData,
        productOptionModifyRequest: useOptions,
        productMainImageModifyRequest: productMainImageModifyRequest,
        productDetailImagesModifyRequest: updatedProductDetailImagesModifyRequest,
        userToken: userToken || "",
      };

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

      const totalDetailImages = [...selectedDetailImages, ...(data?.detailImagesForAdmin || [])];

      if (totalDetailImages.length < 6 || totalDetailImages.length > 10) {
        toast.error("상세 이미지를 최소 6장, 최대 10장 등록해주세요.");
        return;
      }

      await mutation.mutateAsync(updatedData);
      console.log("확인", updatedData);
      queryClient.invalidateQueries(["productModify", parseInt(productId || "")]);
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
              <ToggleComponent label="기본정보" height={220}>
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
                  <div className="text-field-container">
                    <div className="text-field-label">판매 상태</div>
                    <FormControl
                      sx={{
                        display: "flex",
                        flexGrow: 1,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Select
                        name="saleStatus"
                        value={selectedSaleStatus}
                        sx={{ width: "100%" }}
                        onChange={(e) => setSelectedSaleStatus(e.target.value)}
                      >
                        <MenuItem value="" disabled>
                          판매 상태를 선택해주세요
                        </MenuItem>
                        {saleStatus.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                  {(selectedDetailImages.length > 0 || serverDetailImages.length > 0) &&
                    selectedDetailImages.map((selectedImage, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "calc(33.33% - 16px)",
                          height: "auto",
                          margin: "8px",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          style={{ width: "100%", height: "100%" }}
                          alt={`Selected ${idx}`}
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
                    ))}
                  {serverDetailImages.length > 0 &&
                    serverDetailImages.map((detailImage, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "calc(33.33% - 16px)",
                          height: "auto",
                          margin: "8px",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <img
                          src={getImageUrl(detailImage.detailImgs)}
                          style={{ width: "100%", height: "100%" }}
                          alt={`Selected ${detailImage.detailImageId}`}
                        />
                        <RemoveCircleOutlineSharpIcon
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            cursor: "pointer",
                            zIndex: 1,
                          }}
                          onClick={(event) =>
                            handleDeleteDetailImage(event, detailImage.detailImageId)
                          }
                        />
                      </div>
                    ))}
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
              <ToggleComponent label="상세정보" height={500}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={2}
                  aria-label="상세정보"
                >
                  {/* <TextQuill
                    name="productDescription"
                    value={productDescription}
                    setValue={setProductDescription}
                    isDisable={false}
                  /> */}
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

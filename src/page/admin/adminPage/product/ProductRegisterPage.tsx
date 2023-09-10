import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import "./css/ProductPage.css";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { toast } from "react-toastify";
import ProductOptionsRegister from "./Register/ProductOptionsRegister";
import ProductDescription from "./Register/ProductDescription";
import ProductImageRegister from "./Register/ProductImageRegister";
import { registerProduct } from "page/product/api/ProductApi";
import { Product } from "entity/product/Product";
import { useOptions } from "entity/product/useOptions";
import { ProductImg } from "entity/product/ProductMainImg";
import { ProductDetailImg } from "entity/product/ProductDetailImg";
import ProductDetailRegister from "./Register/ProductDetailRegister";

const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const [productDescription, setProductDescription] = useState("");
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [options, setOptions] = useState<useOptions[]>([]);
  const [productDetailInfo, setProductDetailInfo] = useState({
    productName: "",
    cultivationMethod: "",
    farmName: "",
  });

  const handleProductDetailInfoChange = (updatedInfo: any) => {
    setProductDetailInfo((prevProductDetailInfo) => ({
      ...prevProductDetailInfo,
      ...updatedInfo,
    }));
    console.log("기본정보", updatedInfo)
  };

  const handleProductDescriptionChange = (description: string) => {
    setProductDescription(description);
    console.log("상세정보", description);
  };

  const handleOptionsChange = (updatedOptions: useOptions[]) => {
    setOptions(updatedOptions);
    console.log("옵션정보", updatedOptions)
  };

  const handleMainImageChange = (newImage: File | null) => {
    setSelectedMainImage(newImage);
    console.log("메인이미지", newImage)
  };

  const handleDetailImagesChange = (newImages: File[]) => {
    setSelectedDetailImages(newImages);
    console.log("상세이미지", newImages)
  };

  const mutation = useMutation(registerProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData("product", data);
      navigate("/adminProductListPage");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!productDetailInfo) {
      toast.success("필수 입력 항목을 모두 채워주세요.");
      return;
    }

    if (!productDescription) {
      toast.success("상세정보를 입력해주세요.");
      return;
    }

    // some함수는 배열 요소 중 하나라도 조건을 만족하면 true를 반환
    // some함수는 useOptions배열을 순회하면서 중복 여부를 확인
    // 조건은 옵션명이 동일하고 옵션의 인덱스가 같이 않을 때
    // 중복한 옵션이 있다면 true를 반환
    const isDuplicateOptionName = options.some((option, index) =>
      options.some(
        (otherOption, otherIndex) =>
          option.optionName === otherOption.optionName && index !== otherIndex
      )
    );

    if (isDuplicateOptionName) {
      toast.error("이미 존재하는 옵션 이름입니다.");
      return;
    }

    const hasIncompleteOption = options.some((option) => {
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

    const mainFileToUpload = selectedMainImage
      ? new File([selectedMainImage], selectedMainImage.name)
      : "";
    if (!mainFileToUpload) {
      toast.success("메인 이미지를 등록해주세요");
      return;
    }

    const detailImageUpload = selectedDetailImages.map(async (image) => {
      const detailFileToUpload = new File([image], image.name);
      return (await uploadFileAwsS3(detailFileToUpload)) || "";
    });

    const s3DetailObjectVersion = await Promise.all(detailImageUpload);

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

    const optionObjects: Partial<useOptions>[] = options.map((option) => ({
      optionName: option.optionName,
      optionPrice: option.optionPrice,
      stock: option.stock,
      value: option.value,
      unit: option.unit,
    }));

    const productRegisterRequest: Partial<Product> = {
      productName: productDetailInfo.productName,
      productDescription: productDescription,
      cultivationMethod: productDetailInfo.cultivationMethod,
    };

    const data = {
      productRegisterRequest: productRegisterRequest,
      productOptionRegisterRequest: optionObjects,
      productMainImageRegisterRequest: partialProductMainImageRegisterRequest,
      productDetailImagesRegisterRequests: productDetailImagesRegisterRequests,
      userToken: userToken || "",
      farmName: productDetailInfo.farmName,
    };

    await mutation.mutateAsync({
      ...data,
      productRegisterRequest: productRegisterRequest as Product,
      productOptionRegisterRequest: optionObjects as useOptions[],
      productMainImageRegisterRequest: partialProductMainImageRegisterRequest as ProductImg,
      productDetailImagesRegisterRequests:
        productDetailImagesRegisterRequests as ProductDetailImg[],
    });
    console.log("데이터확인", data);
  };

  const handleFormClick = (event: React.MouseEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;
    if (!target.matches('button[type="submit"]')) {
      event.preventDefault();
    }
  };

  return (
    <div className="product-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <form onSubmit={handleSubmit} onClick={() => handleFormClick}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <h1>상품 등록</h1>
            <ProductDetailRegister onProductDetailInfoChange={handleProductDetailInfoChange} />
            <ProductImageRegister
              onMainImageChange={handleMainImageChange}
              onDetailImagesChange={handleDetailImagesChange}
            />
            <ProductOptionsRegister onOptionsChange={handleOptionsChange} />
            <ProductDescription onProductDescriptionChange={handleProductDescriptionChange} />
          </Box>
          <Button type="submit">등록</Button>
        </form>
      </Container>
    </div>
  );
};

export default ProductRegisterPage;

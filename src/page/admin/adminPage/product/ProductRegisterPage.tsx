import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import "../../../product/css/ProductPage.css";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { toast } from "react-toastify";
import { registerProduct } from "page/product/api/ProductApi";
import { Product } from "page/product/entity/Product";
import { useOptions } from "page/product/entity/useOptions";
import { ProductImg } from "page/product/entity/ProductMainImg";
import { ProductDetailImg } from "page/product/entity/ProductDetailImg";
import useProductRegisterStore from "page/product/store/ProductRegisterStore";
import useProductImageStore from "page/product/store/ProductImageStore";
import ProductDetailRegister from "page/product/components/register/ProductDetailRegister";
import ProductImageRegister from "page/product/components/register/ProductImageRegister";
import ProductOptionsRegister from "page/product/components/register/ProductOptionsRegister";
import ProductDescription from "page/product/components/register/ProductDescription";

const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const { products } = useProductRegisterStore();
  const { productImgs, productDetailImgs } = useProductImageStore();

  const mutation = useMutation(registerProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData("product", data);
      navigate("/adminProductListPage");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(products);

    if (!products.productName && !products.farmName) {
      toast.success("필수 입력 항목을 모두 채워주세요.");
      return;
    }

    if (!products.productDescription) {
      toast.success("상세정보를 입력해주세요.");
      return;
    }

    // some함수는 배열 요소 중 하나라도 조건을 만족하면 true를 반환
    // some함수는 useOptions배열을 순회하면서 중복 여부를 확인
    // 조건은 옵션명이 동일하고 옵션의 인덱스가 같이 않을 때
    // 중복한 옵션이 있다면 true를 반환
    const isDuplicateOptionName = products.productOptionList.some((option, index) =>
      products.productOptionList.some(
        (otherOption, otherIndex) =>
          option.optionName === otherOption.optionName && index !== otherIndex
      )
    );

    if (isDuplicateOptionName) {
      toast.error("이미 존재하는 옵션 이름입니다.");
      return;
    }

    const hasIncompleteOption = products.productOptionList.some((option) => {
      return !option.optionName || !option.optionPrice || !option.stock || !option.unit;
    });

    if (hasIncompleteOption) {
      toast.error("옵션 정보를 모두 입력해주세요.");
      return;
    }

    if (productDetailImgs.length === 0) {
      toast.error("상세 이미지를 추가해주세요.");
      return;
    }

    if (productDetailImgs.length < 6 || productDetailImgs.length > 10) {
      toast.error("상세 이미지를 최소 6장, 최대 10장 등록해주세요.");
      return;
    }

    const mainFileToUpload =
      productImgs instanceof Blob
        ? (() => {
            const blobWithProperties = productImgs as Blob & { name: string };
            return new File([productImgs], blobWithProperties.name);
          })()
        : null;

    if (!mainFileToUpload) {
      toast.success("메인 이미지를 등록해주세요");
      return;
    }

    const detailImageUpload = productDetailImgs.map(async (image) => {
      if (image instanceof Blob) {
        const blobWithProperties = image as Blob & { name: string };
        // 이미지 Blob을 File로 변환하여 원래 이미지 파일의 이름을 사용
        const detailFileToUpload = new File([blobWithProperties], blobWithProperties.name);
        return (await uploadFileAwsS3(detailFileToUpload)) || "";
      }
    });

    const s3DetailObjectVersion = await Promise.all(detailImageUpload);

    const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

    const partialProductMainImageRegisterRequest: Partial<ProductImg> = {
      mainImg: mainFileToUpload
        ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
        : "undefined main image",
    };

    const detailImgsName = productDetailImgs.map((image, idx) => {
      if (image instanceof Blob) {
        const blobWithProperties = image as Blob & { name: string };
        return blobWithProperties.name + "?versionId=" + s3DetailObjectVersion[idx];
      }
      return undefined;
    });

    const productDetailImagesRegisterRequests: Partial<ProductDetailImg>[] = detailImgsName.map(
      (detailImg) => ({
        detailImgs: detailImg as unknown as File,
      })
    );

    const optionObjects: Partial<useOptions>[] = products.productOptionList.map((option) => ({
      optionName: option.optionName,
      optionPrice: option.optionPrice,
      stock: option.stock,
      value: option.value,
      unit: option.unit,
    }));

    const productRegisterRequest: Partial<Product> = {
      productName: products.productName,
      productDescription: products.productDescription,
      cultivationMethod: products.cultivationMethod,
    };

    const data = {
      productRegisterRequest: productRegisterRequest,
      productOptionRegisterRequest: optionObjects,
      productMainImageRegisterRequest: partialProductMainImageRegisterRequest,
      productDetailImagesRegisterRequests: productDetailImagesRegisterRequests,
      userToken: userToken || "",
      farmName: products.farmName,
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
            <ProductDetailRegister />
            <ProductImageRegister />
            <ProductOptionsRegister />
            <ProductDescription />
          </Box>
          <Button type="submit">등록</Button>
        </form>
      </Container>
    </div>
  );
};

export default ProductRegisterPage;

import React, { useEffect, useState } from "react";
import { Box, Button, Container, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { getImageUrl, uploadFileAwsS3 } from "utility/s3/awsS3";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TextQuill from "utility/quill/TextQuill";
import { useProductQuery, useProductUpdateMutation } from "page/product/api/ProductApi";
import { Product } from "entity/product/Product";
import { ProductImg } from "entity/product/ProductMainImg";
import { ProductModify } from "entity/product/ProductModify";
import ProductDetailModify from "./modify/ProductDetailModify";
import ProductImageModify from "./modify/ProductImageModify";
import ProductOptionModify from "./modify/ProductOptionModify";
import ProductDescriptionModify from "./modify/ProductDescriptionModify";
import useProductModifyStore from "store/product/ProductModifyStore";
import useProductImageStore from "store/product/ProductImageStore";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const AdminProductModifyPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  const mutation = useProductUpdateMutation();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const { products, setProducts } = useProductModifyStore();
  const { productImgs, setProductImgs, productDetailImgs, setProductDetailImgs } =
  useProductImageStore();

  useEffect(() => {
    const newProductName = data?.productResponseForAdmin.productName || "";
    const newCultivationMethod = data?.productResponseForAdmin.cultivationMethod || "";
    const newProductSaleStatus = data?.productResponseForAdmin.productSaleStatus || "";
    const newProductDescription = data?.productResponseForAdmin.productDescription || "";
    const newOptions = data?.optionResponseForAdmin || [];
    const newMainImages = data?.mainImageResponseForAdmin || "";
    const newDetailImages = data?.detailImagesForAdmin || [];

    setProducts({
      ...products,
      productName: newProductName,
      cultivationMethod: newCultivationMethod,
      productSaleStatus: newProductSaleStatus,
      productDescription: newProductDescription,
      productOptionList: newOptions,
    });

    setProductImgs({
      ...productImgs,
      mainImg: newMainImages as string,
    });

    setProductDetailImgs([...newDetailImages]);
  }, [data, setProducts]);

  const handleFormClick = (event: React.MouseEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;
    if (!target.matches('button[type="submit"]')) {
      event.preventDefault();
    }
  };

  const handleEditFinishClick = async () => {
    if (
      products.productName &&
      products.cultivationMethod &&
      products.productDescription &&
      products.productSaleStatus
    ) {
      const productModifyRequestData: Partial<Product> = {
        productName: products.productName,
        cultivationMethod: products.cultivationMethod,
        productDescription: products.productDescription,
        productSaleStatus: products.productSaleStatus,
      };
      console.log("받은 데이터 확인", products);

      const mainFileToUpload =
        productImgs instanceof Blob
          ? (() => {
              const blobWithProperties = productImgs as Blob & { name: string };
              return new File([productImgs], blobWithProperties.name);
            })()
          : null;

      let s3MainObjectVersion = "";
      if (mainFileToUpload) {
        s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";
      }

      const existingMainImageUrl = data?.mainImageResponseForAdmin?.mainImg;

      const productMainImageModifyRequest: ProductImg = {
        mainImageId: data!.mainImageResponseForAdmin!.mainImageId,
        mainImg: mainFileToUpload
          ? ((mainFileToUpload
              ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
              : "undefined main image") as string)
          : ((existingMainImageUrl || "undefined main image") as string),
      };
      console.log("확인1", productMainImageModifyRequest)

      // const detailImageUploadPromises = productDetailImgs.map(async (image, idx) => {
      //   const detailFileToUpload = new File([image], image.name);
      //   const s3DetailObjectVersion = await uploadFileAwsS3(detailFileToUpload);
      //   return {
      //     detailImageId: 0,
      //     detailImgs: image.name + "?versionId=" + s3DetailObjectVersion,
      //   };
      // });
      // const productDetailImagesModifyRequest = await Promise.all(detailImageUploadPromises);
      // if (productDetailImgs.length === 0 || productDetailImgs.length !== 0) {
      //   const existingDetailImageRequests = (data?.detailImagesForAdmin || []).map(
      //     (existingDetailImage) => ({
      //       detailImageId: existingDetailImage.detailImageId || 0,
      //       detailImgs: existingDetailImage.detailImgs || "undefined detail image",
      //     })
      //   );
      //   productDetailImagesModifyRequest.push(...existingDetailImageRequests);
      // }
      // const updatedProductDetailImagesModifyRequest = productDetailImagesModifyRequest.filter(
      //   (detailImage) => !productDetailImgs.includes(detailImage.detailImageId)
      // );

      const updatedData: ProductModify = {
        productId: parseInt(productId || ""),
        productModifyRequest: productModifyRequestData,
        productOptionModifyRequest: products.productOptionList,
        productMainImageModifyRequest: productMainImageModifyRequest,
        // productDetailImagesModifyRequest: updatedProductDetailImagesModifyRequest,
        userToken: userToken || "",
      };

      // const isDuplicateOptionName = useOptions.some((option, index) =>
      //   useOptions.some(
      //     (otherOption, otherIndex) =>
      //       option.optionName === otherOption.optionName && index !== otherIndex
      //   )
      // );

      // if (isDuplicateOptionName) {
      //   toast.error("이미 존재하는 옵션 이름입니다.");
      //   return;
      // }

      // const hasIncompleteOption = useOptions.some((option) => {
      //   return !option.optionName || !option.optionPrice || !option.stock || !option.unit;
      // });

      // if (hasIncompleteOption) {
      //   toast.error("옵션 정보를 모두 입력해주세요.");
      //   return;
      // }

      // const totalDetailImages = [...selectedDetailImages, ...(data?.detailImagesForAdmin || [])];

      // if (totalDetailImages.length < 6 || totalDetailImages.length > 10) {
      //   toast.error("상세 이미지를 최소 6장, 최대 10장 등록해주세요.");
      //   return;
      // }

      await mutation.mutateAsync(updatedData);
      console.log("수정확인", updatedData);
      queryClient.invalidateQueries(["productModify", parseInt(productId || "")]);
      navigate("/adminProductListPage");
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <form onClick={handleFormClick}>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <h1>상품 수정</h1>
          <ProductDetailModify />
          <ProductImageModify />
          <ProductOptionModify />
          <ProductDescriptionModify />
        </Box>
        <Button variant="outlined" onClick={handleEditFinishClick}>
          수정 완료
        </Button>
      </form>
    </Container>
  );
};

export default AdminProductModifyPage;

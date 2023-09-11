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
import ProductDetailModify from "./modify/ProductDetailModify";
import ProductImageModify from "./modify/ProductImageModify";
import ProductOptionModify from "./modify/ProductOptionModify";
import ProductDescriptionModify from "./modify/ProductDescriptionModify";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const AdminProductModifyPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  const [useOptions, setUseOptions] = useState<useOptions[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [deletedImageIndexes, setDeletedImageIndexes] = useState<number[]>([]);
  const [productName, setProductName] = useState("");
  const [selectedCultivationMethod, setSelectedCultivationMethod] = useState("");
  const [selectedSaleStatus, setSelectedSaleStatus] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const mutation = useProductUpdateMutation();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");

  // useEffect(() => {
  //   const fetchProductData = async () => {
  //     const data = await fetchProduct(productId || "");
  //     if (data) {
  //       // 수정 데이터 업데이트
  //       setProductName(data.productResponseForAdmin?.productName || "");
  //       // setSelectedCultivationMethod(data.productResponseForAdmin?.cultivationMethod || "");
  //       setUseOptions(data.optionResponseForAdmin || []);
  //       setProductDescription(data.productResponseForAdmin?.productDescription || "");
  //       setSelectedSaleStatus(data.productResponseForAdmin?.productSaleStatus || "AVAILABLE");
  //       setServerDetailImages(data.detailImagesForAdmin || []);
  //     }
  //   };
  //   fetchProductData();
  // }, []);

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
        // cultivationMethod: selectedCultivationMethod,
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

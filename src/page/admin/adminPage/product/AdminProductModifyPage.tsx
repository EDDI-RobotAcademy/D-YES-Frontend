import React, { useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "page/product/api/ProductApi";
import { Product } from "page/product/entity/Product";
import { ProductModify } from "page/product/entity/ProductModify";
import ProductDetailModify from "../../../product/components/modify/ProductDetailModify";
import ProductImageModify from "../../../product/components/modify/ProductImageModify";
import ProductOptionModify from "../../../product/components/modify/ProductOptionModify";
import ProductDescriptionModify from "../../../product/components/modify/ProductDescriptionModify";
import { ProductDetailImg } from "page/product/entity/ProductDetailImg";
import { toast } from "react-toastify";
import { useAuth } from "layout/navigation/AuthConText";
import useProductModifyRefactorStore from "page/product/store/ProductRefactorModifyStore";
import useProductReadStore from "page/product/store/ProductReadStore";
import { ProductModifyImg } from "page/product/entity/ProductModifyImg";
import { useOptions } from "page/product/entity/useOptions";

const AdminProductModifyPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const { modifyProducts } = useProductModifyRefactorStore();
  const { productReads } = useProductReadStore();
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const mutation = useMutation(updateProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData("productModify", data);
      console.log("수정확인", data);
      toast.success("수정되었습니다.");
      navigate("/adminProductListPage");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const productModifyRequestData: Partial<Product> = {
      productName:
        modifyProducts.productModifyRequest?.productName ||
        productReads.productResponseForAdmin?.productName,
      cultivationMethod:
        modifyProducts.productModifyRequest?.cultivationMethod ||
        productReads.productResponseForAdmin?.cultivationMethod,
      productDescription:
        modifyProducts.productModifyRequest?.productDescription ||
        productReads.productResponseForAdmin?.productDescription,
      productSaleStatus:
        modifyProducts.productModifyRequest?.productSaleStatus ||
        productReads.productResponseForAdmin?.productSaleStatus,
    };

    let mainImage = productReads?.mainImageResponseForAdmin?.mainImg || "";

    if (modifyProducts.productMainImageModifyRequest?.mainImg) {
      const s3MainObjectVersion =
        (await uploadFileAwsS3(modifyProducts.productMainImageModifyRequest?.mainImg)) || "";
      mainImage = (modifyProducts.productMainImageModifyRequest?.mainImg.name +
        "?versionId=" +
        s3MainObjectVersion) as unknown as File;
    }

    const productMainImageModifyRequest: ProductModifyImg = {
      mainImageId:
        productReads.mainImageResponseForAdmin.mainImageId ||
        modifyProducts.productMainImageModifyRequest.mainImageId,
      mainImg: mainImage,
    };

    const detailImageUploadPromises = modifyProducts.productDetailImagesModifyRequest
      ? modifyProducts.productDetailImagesModifyRequest.map(async (image, idx) => {
          const detailFileToUpload = new File([image.detailImgs], image.detailImgs.name);

          let s3DetailObjectVersion = "";
          let name = "";

          s3DetailObjectVersion = (await uploadFileAwsS3(detailFileToUpload)) || "";
          name = detailFileToUpload.name;

          if (name.trim() === "") {
            return null;
          }

          return {
            detailImageId: 0,
            detailImgs: name + "?versionId=" + s3DetailObjectVersion,
          };
        })
      : [];
    const existingDetailImageNames = productReads.detailImagesForAdmin.map((image) => ({
      detailImageId: image.detailImageId,
      detailImgs: image.detailImgs,
    }));

    const allDetailImageUploadPromises = [
      ...detailImageUploadPromises,
      ...existingDetailImageNames,
    ];

    const filteredAllDetailImageUploadPromises = allDetailImageUploadPromises.filter(
      (image) => image !== null
    );

    const productDetailImagesModifyRequest = await Promise.all(
      filteredAllDetailImageUploadPromises
    );

    const updatedProductDetailImagesModifyRequest = productDetailImagesModifyRequest
      .filter((detailImage) => detailImage !== null)
      .map((detailImage) => {
        const productDetailImg: ProductDetailImg = {
          detailImageId: detailImage!.detailImageId,
          detailImgs: detailImage!.detailImgs as unknown as File,
        };

        return productDetailImg;
      });

    const productOptionModifyRequest = modifyProducts.productOptionModifyRequest || [];
    const existingOptions = productReads.optionResponseForAdmin || [];

    const productOptionModifyRequestMapped = existingOptions.map((existingOption, index) => {
      const newOption = productOptionModifyRequest[index] || {};

      return {
        optionId: existingOption.optionId,
        optionName: newOption.optionName || existingOption.optionName,
        optionPrice: newOption.optionPrice || existingOption.optionPrice,
        stock: newOption.stock || existingOption.stock,
        value: newOption.value || existingOption.value,
        unit: newOption.unit || existingOption.unit,
        optionSaleStatus: newOption.optionSaleStatus || existingOption.optionSaleStatus, // 추가
      };
    });

    const updatedData: ProductModify = {
      productId: parseInt(productId || ""),
      productModifyRequest: productModifyRequestData,
      productOptionModifyRequest: productOptionModifyRequestMapped,
      productMainImageModifyRequest: productMainImageModifyRequest,
      productDetailImagesModifyRequest: updatedProductDetailImagesModifyRequest,
      userToken: userToken || "",
    };

    const isDuplicateOptionName = productOptionModifyRequest.some((option, index) =>
      productOptionModifyRequest.some(
        (otherOption, otherIndex) =>
          option.optionName === otherOption.optionName && index !== otherIndex
      )
    );

    if (isDuplicateOptionName) {
      toast.error("이미 존재하는 옵션 이름입니다.");
      return;
    }

    const hasIncompleteOption = modifyProducts.productOptionModifyRequest?.some((option) => {
      return !option.optionName || !option.optionPrice || !option.stock || !option.unit;
    });

    if (hasIncompleteOption) {
      toast.error("옵션 정보를 모두 입력해주세요.");
      return;
    }

    const combinedDetailImages = [
      ...(productReads?.detailImagesForAdmin || []),
      ...(modifyProducts?.productDetailImagesModifyRequest || []),
    ];

    if (combinedDetailImages.length < 6) {
      toast.error("상세 이미지를 최소 6장 등록해주세요.");
      return;
    }

    if (combinedDetailImages.length > 10) {
      toast.error("상세 이미지를 최대 10장까지 등록할 수 있습니다.");
      return;
    }

    console.log("아이디확인", updatedData);
    await mutation.mutateAsync(updatedData);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <h1>상품 수정</h1>
          <ProductDetailModify />
          <ProductImageModify />
          <ProductOptionModify />
          <ProductDescriptionModify />
        </Box>
        <Button type="submit">수정 완료</Button>
      </form>
    </Container>
  );
};

export default AdminProductModifyPage;

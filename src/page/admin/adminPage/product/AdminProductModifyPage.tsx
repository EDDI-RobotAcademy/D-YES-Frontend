import React, { useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, useProductQuery, useProductUpdateMutation } from "page/product/api/ProductApi";
import { Product } from "page/product/entity/Product";
import { ProductImg } from "page/product/entity/ProductMainImg";
import { ProductModify } from "page/product/entity/ProductModify";
import ProductDetailModify from "../../../product/components/modify/ProductDetailModify";
import ProductImageModify from "../../../product/components/modify/ProductImageModify";
import ProductOptionModify from "../../../product/components/modify/ProductOptionModify";
import ProductDescriptionModify from "../../../product/components/modify/ProductDescriptionModify";
import useProductModifyStore from "page/product/store/ProductModifyStore";
import useProductImageStore from "page/product/store/ProductImageStore";
import { ProductDetailImg } from "page/product/entity/ProductDetailImg";
import { toast } from "react-toastify";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const AdminProductModifyPage = () => {
  const navigate = useNavigate();
  const hasFetchedRef = React.useRef(false);
  const { productId } = useParams<RouteParams>();
  const mutation = useProductUpdateMutation();
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const { modifyProducts, setModifyProducts } = useProductModifyStore();
  const { productImgs, setProductImgs, productDetailImgs, setProductDetailImgs } =
    useProductImageStore();

  const fetchModify = async () => {
    hasFetchedRef.current = true;
    const productData = await fetchProduct(productId || "");
    return productData;
  };

  const { data } = useQuery("user", fetchModify, {
    enabled: !!productId && !hasFetchedRef.current,
    initialData: queryClient.getQueryData("productRead") || undefined,
  });

  useEffect(() => {
    const newProductName = data?.productResponseForAdmin.productName || "";
    const newCultivationMethod = data?.productResponseForAdmin.cultivationMethod || "";
    const newProductSaleStatus = data?.productResponseForAdmin.productSaleStatus || "";
    const newProductDescription = data?.productResponseForAdmin.productDescription || "";
    const newOptions = data?.optionResponseForAdmin || [];
    const newMainImages = data?.mainImageResponseForAdmin || "";
    const newDetailImages = data?.detailImagesForAdmin || [];

    setModifyProducts({
      ...modifyProducts,
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
  }, [
    data,
    setModifyProducts,
    // 아래 부분이 무한 루프를 발생시킴(우선 주석 처리)
    // productImgs,
    // products,
    setProductDetailImgs,
    setProductImgs,
  ]);

  const handleFormClick = (event: React.MouseEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;
    if (!target.matches('button[type="submit"]')) {
      event.preventDefault();
    }
  };

  const handleEditFinishClick = async () => {
    if (
      modifyProducts.productName &&
      modifyProducts.cultivationMethod &&
      modifyProducts.productDescription &&
      modifyProducts.productSaleStatus
    ) {
      const productModifyRequestData: Partial<Product> = {
        productName: modifyProducts.productName,
        cultivationMethod: modifyProducts.cultivationMethod,
        productDescription: modifyProducts.productDescription,
        productSaleStatus: modifyProducts.productSaleStatus,
      };
      console.log("받은 데이터 확인", modifyProducts);

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

      const detailImageUploadPromises = productDetailImgs.map(async (image, idx) => {
        if (image instanceof Blob) {
          const blobWithProperties = image as Blob & { name: string };
          const detailFileToUpload = new File([image], blobWithProperties.name);

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
        } else {
          return image;
        }
      });

      const filteredDetailImageUploadPromises = detailImageUploadPromises.filter(
        (image) => image !== null
      );

      const productDetailImagesModifyRequest = await Promise.all(filteredDetailImageUploadPromises);

      const updatedProductDetailImagesModifyRequest = productDetailImagesModifyRequest
        .filter((detailImage) => detailImage !== null)
        .map((detailImage) => {
          const productDetailImg: ProductDetailImg = {
            detailImageId: detailImage!.detailImageId,
            detailImgs: detailImage!.detailImgs as unknown as File,
          };

          return productDetailImg;
        });

      const updatedData: ProductModify = {
        productId: parseInt(productId || ""),
        productModifyRequest: productModifyRequestData,
        productOptionModifyRequest: modifyProducts.productOptionList,
        productMainImageModifyRequest: productMainImageModifyRequest,
        productDetailImagesModifyRequest: updatedProductDetailImagesModifyRequest,
        userToken: userToken || "",
      };

      const isDuplicateOptionName = modifyProducts.productOptionList.some((option, index) =>
        modifyProducts.productOptionList.some(
          (otherOption, otherIndex) =>
            option.optionName === otherOption.optionName && index !== otherIndex
        )
      );

      if (isDuplicateOptionName) {
        toast.error("이미 존재하는 옵션 이름입니다.");
        return;
      }

      const hasIncompleteOption = modifyProducts.productOptionList.some((option) => {
        return !option.optionName || !option.optionPrice || !option.stock || !option.unit;
      });

      if (hasIncompleteOption) {
        toast.error("옵션 정보를 모두 입력해주세요.");
        return;
      }

      if (productDetailImgs.length < 6 || productDetailImgs.length > 10) {
        toast.error("상세 이미지를 최소 6장, 최대 10장 등록해주세요.");
        return;
      }

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

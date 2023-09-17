import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";
import { ProductDetailImg } from "page/product/entity/ProductDetailImg";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { getImageUrl } from "utility/s3/awsS3";
import { useParams } from "react-router-dom";
import { useProductQuery } from "page/product/api/ProductApi";
import useProductImageStore from "page/product/store/ProductImageStore";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ProductImageModify = () => {
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const { setProductImgs, productDetailImgs, setProductDetailImgs } = useProductImageStore();

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setSelectedMainImage(compressedImage);
        setProductImgs(compressedImage);
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
        setProductDetailImgs([...compressedImages.map((item) => item.image), ...productDetailImgs]);
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
  
    const updatedProductDetailImages = productDetailImgs.filter((image, idx) => {
      if (image && "detailImageId" in image) {
        return image.detailImageId !== imageIdToDelete;
      }
      return true;
    });
  
    setProductDetailImgs(updatedProductDetailImages);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <div>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
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
              ) : data?.mainImageResponseForAdmin?.mainImg ? (
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
              {productDetailImgs &&
                productDetailImgs.length > 0 &&
                productDetailImgs.map((detailImage, idx) => (
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
                    {detailImage && (
                      <>
                        <img
                          src={
                            typeof detailImage === "string"
                              ? detailImage
                              : detailImage instanceof Blob
                              ? URL.createObjectURL(detailImage)
                              : getImageUrl(detailImage.detailImgs.toString())
                          }
                          style={{ width: "100%", height: "100%" }}
                          alt={`Selected ${(detailImage as ProductDetailImg).detailImageId}`} // 타입 단언 사용
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
                            handleDeleteDetailImage(
                              event,
                              (detailImage as ProductDetailImg).detailImageId
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                ))}
            </div>
          </ToggleComponent>
        </Box>
      </div>
    </Container>
  );
};

export default ProductImageModify;

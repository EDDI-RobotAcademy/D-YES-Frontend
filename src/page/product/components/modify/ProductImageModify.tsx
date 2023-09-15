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
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  // const [deletedImageIndexes, setDeletedImageIndexes] = useState<number[]>([]);
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
            console.log("이미지 추가 중" + file.name);
            return {
              image: await compressImg(file),
              detailImageId: 0,
            };
          })
        );
        setProductDetailImgs([...compressedImages.map((item) => item.image), ...productDetailImgs]);
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

    const updatedProductDetailImages = productDetailImgs.filter((detailImage) => {
      if ("detailImageId" in detailImage) {
        return detailImage.detailImageId !== imageIdToDelete;
      }
      return true;
    });

    setProductDetailImgs(updatedProductDetailImages);
    // setDeletedImageIndexes((prevIndexes) => [...prevIndexes, imageIdToDelete]);
  };

  const handleRemoveDetailImage = (event: React.MouseEvent, index: number) => {
    // 이미지를 삭제할 때 이미지 불러오기 방지
    event.stopPropagation();
    const updatedImages = [...selectedDetailImages];
    updatedImages.splice(index, 1);
    setSelectedDetailImages(updatedImages);
    setProductDetailImgs(updatedImages);
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
              {(selectedDetailImages.length > 0 || productDetailImgs.length > 0) &&
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
                    {"detailImgs" in detailImage && detailImage.detailImgs && (
                      <>
                        <img
                          src={getImageUrl(detailImage.detailImgs)}
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
                          } // 타입 단언 사용
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

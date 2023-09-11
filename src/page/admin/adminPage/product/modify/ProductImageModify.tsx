import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";
import { ProductDetailImg } from "entity/product/ProductDetailImg";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { getImageUrl } from "utility/s3/awsS3";
import useProductModifyStore from "store/product/ProductModifyStore";
import { useParams } from "react-router-dom";
import { useProductQuery } from "page/product/api/ProductApi";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ProductImageModify = () => {
  const { productId } = useParams<RouteParams>();
  const { data } = useProductQuery(productId || "");
  const { products, setProducts } = useProductModifyStore();
  const [serverDetailImages, setServerDetailImages] = useState<ProductDetailImg[]>([]);
  const [selectedDetailImages, setSelectedDetailImages] = useState<File[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<File | null>(null);
  const [deletedImageIndexes, setDeletedImageIndexes] = useState<number[]>([]);

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
              {data?.detailImagesForAdmin &&
                data.detailImagesForAdmin.length > 0 &&
                data.detailImagesForAdmin.map((detailImage, idx) => (
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
                      onClick={(event) => handleDeleteDetailImage(event, detailImage.detailImageId)}
                    />
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

import { Box, Container } from "@mui/material";
import React from "react";
import ToggleComponent from "../productOption/ToggleComponent";
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { getImageUrl } from "utility/s3/awsS3";
import useProductReadStore from "page/product/store/ProductReadStore";
import useProductModifyRefactorStore from "page/product/store/ProductRefactorModifyStore";
import { ProductDetailImg } from "page/product/entity/ProductDetailImg";
import { isValidImageExtension } from "utility/s3/checkValidImageExtension";
import { toast } from "react-toastify";

const ProductImageModify = () => {
  const { modifyProducts, setModifyProducts } = useProductModifyRefactorStore();
  const { productReads, setProductRead } = useProductReadStore();

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (!isValidImageExtension(acceptedFile[0].name))
      return toast.error("확장자를 확인해주세요 (.jpg, .jpeg, .png)");
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setModifyProducts({
          ...modifyProducts,
          productMainImageModifyRequest: {
            ...modifyProducts.productMainImageModifyRequest,
            mainImg: compressedImage,
          },
        });
        setProductRead({
          ...productReads,
          mainImageResponseForAdmin: {
            ...productReads.mainImageResponseForAdmin,
            mainImg: compressedImage,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps, getInputProps: mainImageInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    noClick: false,
  });

  const onDetailImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const invalidFiles = acceptedFiles.filter((file) => !isValidImageExtension(file.name));
        if (invalidFiles.length > 0) {
          toast.error("확장자를 확인해주세요 (.jpg, .jpeg, .png)");
          return;
        }
        const compressedImages = await Promise.all(
          acceptedFiles.map(async (file) => {
            return {
              image: await compressImg(file),
              detailImageId: 0,
            };
          })
        );
        setModifyProducts({
          ...modifyProducts,
          productDetailImagesModifyRequest: [
            ...compressedImages.map((item) => ({
              detailImageId: 0,
              detailImgs: item.image,
            })),
          ],
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: detailImageRootProps, getInputProps: detailImageInputProps } = useDropzone({
    onDrop: onDetailImageDrop,
    noClick: false,
  });

  const handleDeleteDetailImage = (event: React.MouseEvent, imageIdToDelete: number) => {
    event.stopPropagation();

    const updatedProductDetailImages = productReads.detailImagesForAdmin.filter((image, idx) => {
      if (image && "detailImageId" in image) {
        return image.detailImageId !== imageIdToDelete;
      }
      return true;
    });

    setProductRead({
      ...productReads,
      detailImagesForAdmin: updatedProductDetailImages,
    });
  };

  const handleDeleteDetailImageByIndex = (event: React.MouseEvent, indexToDelete: number) => {
    event.stopPropagation();

    if (
      modifyProducts.productDetailImagesModifyRequest &&
      modifyProducts.productDetailImagesModifyRequest.length > 0
    ) {
      const updatedImages = [...modifyProducts.productDetailImagesModifyRequest];
      updatedImages.splice(indexToDelete, 1);

      setModifyProducts({
        ...modifyProducts,
        productDetailImagesModifyRequest: updatedImages,
      });
    }
  };

  return (
    <div className="product-modify-detail-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="product-modify-toggle-component">
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <ToggleComponent label="이미지" height={1110}>
              <div className="main-image-container">
                <div className="image-text-field-label" style={{ display: "flex" }}>
                  메인 이미지
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "600px",
                    backgroundColor: "#e4e4e4",
                    cursor: "pointer",
                  }}
                  {...mainImageRootProps()}
                >
                  <input {...mainImageInputProps()} />
                  {modifyProducts.productMainImageModifyRequest?.mainImg ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "600px",
                        backgroundColor: "#e4e4e4",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(
                          modifyProducts.productMainImageModifyRequest.mainImg
                        )}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          cursor: "pointer",
                        }}
                        alt="Selected"
                      />
                      <input {...mainImageInputProps()} />
                    </div>
                  ) : productReads.mainImageResponseForAdmin?.mainImg ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "600px",
                        backgroundColor: "#e4e4e4",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={getImageUrl(productReads.mainImageResponseForAdmin.mainImg.toString())}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          cursor: "pointer",
                        }}
                        alt="Selected"
                      />
                      <input {...mainImageInputProps()} />
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", fontFamily: "SUIT-Light" }}>
                      <img
                        className="upload-icon"
                        alt="이미지 업로드"
                        src="img/upload-icon.png"
                        width={40}
                      />
                      <div>클릭하여 이미지를 추가해주세요</div>
                      <input {...mainImageInputProps()} />
                    </div>
                  )}
                </div>
              </div>
              <div className="detail-image-container">
                <div className="image-text-field-label" style={{ display: "flex" }}>
                  상세 이미지
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "460px",
                    backgroundColor: "#e4e4e4",
                    cursor: "pointer",
                    flexWrap: "wrap",
                  }}
                  {...detailImageRootProps()}
                >
                  <input {...detailImageInputProps()} />
                  {modifyProducts.productDetailImagesModifyRequest &&
                  modifyProducts.productDetailImagesModifyRequest.length > 0
                    ? modifyProducts.productDetailImagesModifyRequest.map((detailImage, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: "calc(18.33% - 16px)",
                            cursor: "pointer",
                            position: "relative",
                            padding: "6px",
                          }}
                        >
                          {detailImage && (
                            <div>
                              <RemoveCircleOutlineSharpIcon
                                style={{
                                  position: "absolute",
                                  top: "5px",
                                  right: "5px",
                                  cursor: "pointer",
                                  zIndex: 1,
                                }}
                                onClick={(event) => handleDeleteDetailImageByIndex(event, idx)}
                              />
                              <div
                                style={{
                                  width: "100%",
                                  borderRadius: "4px",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    paddingBottom: "100%",
                                  }}
                                >
                                  <img
                                    src={
                                      typeof detailImage.detailImgs === "string"
                                        ? detailImage.detailImgs
                                        : URL.createObjectURL(detailImage.detailImgs)
                                    }
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      boxSizing: "border-box",
                                      borderRadius: "4px",
                                    }}
                                    alt={`Selected ${idx}`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    : null}
                  {productReads.detailImagesForAdmin && productReads.detailImagesForAdmin.length > 0
                    ? productReads.detailImagesForAdmin.map((detailImage, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: "calc(18.33% - 16px)",
                            cursor: "pointer",
                            position: "relative",
                            padding: "6px",
                          }}
                        >
                          {detailImage && (
                            <div>
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
                              <div
                                style={{
                                  width: "100%",
                                  borderRadius: "4px",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    paddingBottom: "100%",
                                  }}
                                >
                                  <img
                                    src={
                                      typeof detailImage.detailImgs === "string"
                                        ? getImageUrl(detailImage.detailImgs)
                                        : URL.createObjectURL(detailImage.detailImgs)
                                    }
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      boxSizing: "border-box",
                                      borderRadius: "4px",
                                    }}
                                    alt={`Selected ${idx}`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </ToggleComponent>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default ProductImageModify;

import { Box, Button, Container, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { reviewRegister } from "./api/ReviewApi";
import useReviewStore from "./store/ReviewStore";
import useReviewImageStore from "./store/ReviewImageStore";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { ReviewImage } from "./entity/ReviewImage";
import Rating from "@mui/material/Rating";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useAuth } from "layout/navigation/AuthConText";
import { ReviewRegister } from "./entity/ReviewRegister";
import { OrderProductListResponse } from "page/order/entity/UserOrderProduct";

import "./css/ReviewRegisterPage.css";

const ReviewRegisterPage = () => {
  const navigate = useNavigate();
  const { checkAuthorization } = useAuth();
  const isUser = checkAuthorization();
  const queryClient = useQueryClient();
  const { reviews, setReviews } = useReviewStore();
  const [ratingValue, setRatingValue] = React.useState<number>(0);
  const { reviewImages, setReviewImages } = useReviewImageStore();
  const location = useLocation();
  const { productOptionId, orderId, productName, optionInfo } = location.state;
  const mutation = useMutation(reviewRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("review", data);
      navigate("/myOrder");
    },
  });

  const onReviewImageDrop = async (acceptedFiles: File[]) => {
    try {
      const compressedImages = await Promise.all(
        acceptedFiles.map(async (file) => {
          return {
            reviewImageId: 0,
            reviewImages: file,
          };
        })
      );
      if (reviewImages.length + compressedImages.length > 6) {
        toast.error("이미지는 최대 6장까지 등록할 수 있습니다.");
        return;
      }
      setReviewImages([...reviewImages, ...compressedImages]);
    } catch (error) {
      toast.error("이미지 불러오기에 실패했습니다");
    }
  };

  const { getRootProps: reviewImageRootProps, getInputProps: reviewImageInputProps } = useDropzone({
    onDrop: onReviewImageDrop,
    maxFiles: 10,
  });

  const handleContentChange = (newContent: string) => {
    setReviews({ ...reviews, content: newContent });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!reviews.content) {
      toast.error("리뷰를 입력해주세요!");
      return;
    }

    if (reviewImages.length < 1) {
      toast.error("이미지를 최소 1장 이상 등록해주세요.");
      return;
    } else if (reviewImages.length > 6) {
      toast.error("이미지는 최대 6장까지 등록할 수 있습니다.");
      return;
    }

    if (!ratingValue) {
      toast.error("평점을 선택해주세요");
      return;
    }

    const reviewImageUpload = reviewImages.map(async (image) => {
      if (image.reviewImages instanceof File) {
        const reviewFileToUpload = image.reviewImages;
        return (await uploadFileAwsS3(reviewFileToUpload)) || "";
      }
    });

    const s3DetailObjectVersion = await Promise.all(reviewImageUpload);

    const reviewImgsName = reviewImages.map((image, idx) => {
      if (image.reviewImages instanceof File) {
        return image.reviewImages.name + "?versionId=" + s3DetailObjectVersion[idx];
      }
      return undefined;
    });

    const reviewImagesRegisterRequests: Partial<ReviewImage>[] = reviewImgsName.map(
      (reviewImg) => ({
        reviewImages: reviewImg as unknown as File,
      })
    );

    const filteredArray: string[] = reviewImgsName.filter(
      (item): item is string => typeof item === "string"
    );

    const data: ReviewRegister = {
      reviewRegisterRequest: {
        userToken: localStorage.getItem("userToken") || "",
        orderId: orderId,
        productOptionIdList: productOptionId,
        content: reviews.content,
        rating: ratingValue,
      },
      imagesRegisterRequestList: filteredArray.map((image) => ({ reviewImages: image })),
    };
    await mutation.mutateAsync({
      ...data,
      userToken: localStorage.getItem("userToken") || "",
      orderId: orderId,
      productOptionId: productOptionId,
      content: reviews.content,
      rating: ratingValue,
      imagesRegisterRequestList: reviewImagesRegisterRequests as ReviewImage[],
    });

    setReviews({ ...reviews, content: "" });
    setReviewImages([]);
  };

  useEffect(() => {
    if (!isUser) {
      toast.error("로그인을 해주세요.");
      navigate("/login");
    }
  }, [isUser, navigate]);

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <div className="review-reg-info-container">
            <div className="review-reg-info-grid">
              <div>
                <p className="review-reg-product-name">{productName}</p>
                <p className="review-reg-option-info">
                  {optionInfo.flatMap((option: OrderProductListResponse, index: number) =>
                    option.orderOptionList.map((item) => (
                      <span key={index}>
                        {item.optionName}
                        {index < optionInfo.length - 1 ? ", " : ""}
                      </span>
                    ))
                  )}
                </p>
              </div>
            </div>
            <Rating
              name="rating"
              value={ratingValue}
              onChange={(_, value) => {
                setRatingValue(value!);
              }}
              precision={0.5}
            />
          </div>
          <TextField
            label="내용"
            name="content"
            value={reviews.content}
            multiline
            minRows={10}
            maxRows={10}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              handleContentChange(event.target.value)
            }
          />
          <div className="review-reg-img-input" {...reviewImageRootProps()}>
            {reviewImages.length > 0 ? (
              reviewImages.map((image: ReviewImage, idx: number) => (
                <div key={idx}>
                  <img
                    src={URL.createObjectURL(image.reviewImages)}
                    alt={`Selected ${idx}`}
                    className="review-reg-img-style"
                  />
                  {/* <RemoveCircleOutlineSharpIcon
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    onClick={(event) => handleRemoveDetailImage(event, idx)}
                  /> */}
                </div>
              ))
            ) : (
              <div className="review-reg-input-message">
                <div>리뷰 이미지를 추가해주세요.</div>
                <input {...reviewImageInputProps()} />
              </div>
            )}
          </div>
          <div className="review-reg-submit-btn">
            <Button
              style={{ minWidth: "150px", color: "#578b36", borderColor: "#578b36" }}
              variant="outlined"
              type="submit"
            >
              작성 완료
            </Button>
          </div>
        </Box>
      </form>
    </Container>
  );
};

export default ReviewRegisterPage;

import { Box, Button, Container, TextField } from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { reviewRegister } from "./api/ReviewApi";
import useReviewStore from "./store/ReviewStore";
import { compressImg } from "utility/s3/imageCompression";
import useReviewImageStore from "./store/ReviewImageStore";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { ReviewImage } from "./entity/ReviewImage";
import { OrderOptionListResponse } from "page/order/entity/UserOrderOption";
import { styled } from "@mui/material/styles";
import Rating, { IconContainerProps } from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { useDropzone } from "react-dropzone";

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Very Satisfied",
  },
};

const ReviewRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reviews, setReviews } = useReviewStore();
  const [rating, setRating] = useState(2);
  const { reviewImages, setReviewImages } = useReviewImageStore();
  const location = useLocation();
  const { productOptionId, orderId, productName, optionInfo } = location.state;
  const mutation = useMutation(reviewRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("review", data);
      console.log("리뷰확인", data);
      navigate("/");
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

      setReviewImages([...reviewImages, ...compressedImages]);
    } catch (error) {
      console.error(error);
    }
  };

  const { getRootProps: reviewImageRootProps, getInputProps: reviewImageInputProps } = useDropzone({
    onDrop: onReviewImageDrop,
    maxFiles: 10,
  });

  const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
    if (newValue !== null) {
      setRating(newValue);
    }
  };

  const handleContentChange = (newContent: string) => {
    setReviews({ ...reviews, content: newContent });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

    const data = {
      userToken: localStorage.getItem("userToken") || "",
      orderId: orderId,
      productOptionId: Number(productOptionId[0]),
      content: reviews.content,
      rating: rating,
      imagesRegisterRequestList: reviewImagesRegisterRequests,
    };
    console.log("data", data);
    await mutation.mutateAsync({
      ...data,
      orderId: orderId,
      productOptionId: Number(productOptionId[0]),
      content: reviews.content,
      rating: rating,
      imagesRegisterRequestList: reviewImagesRegisterRequests as ReviewImage[],
    });
  };
  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <p style={{ fontSize: "20px", marginRight: "10px" }}>{productName}</p>
              <p style={{ color: "gray" }}>
                {optionInfo.map((option: OrderOptionListResponse, index: number) => (
                  <span key={index}>
                    {option.optionName}
                    {index < optionInfo.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
            <StyledRating
              name="highlight-selected-only"
              value={rating}
              defaultValue={2}
              IconContainerComponent={IconContainer}
              getLabelText={(value: number) => customIcons[value].label}
              highlightSelectedOnly
              onChange={handleRatingChange}
            />
          </div>
          <TextField
            label="내용"
            name="content"
            value={reviews.content}
            multiline
            minRows={10}
            maxRows={10}
            sx={{ borderRadius: "4px" }}
            onChange={(event) => handleContentChange(event.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              height: "100px",
              backgroundColor: "#eef2f3",
              cursor: "pointer",
              flexWrap: "wrap",
            }}
            {...reviewImageRootProps()}
          >
            {reviewImages.length > 0 ? (
              reviewImages.map((image, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "auto",
                    height: "auto",
                    margin: "0 8px",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <img
                    src={URL.createObjectURL(image.reviewImages)}
                    alt={`Selected ${idx}`}
                    style={{ width: "auto", height: "70px" }}
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
              <div style={{ textAlign: "center", width: "100%" }}>
                <div>리뷰 이미지를 추가해주세요.</div>
                <input {...reviewImageInputProps()} />
              </div>
            )}
          </div>
        </Box>
        <Button type="submit">작성 완료</Button>
      </form>
    </Container>
  );
};

export default ReviewRegisterPage;

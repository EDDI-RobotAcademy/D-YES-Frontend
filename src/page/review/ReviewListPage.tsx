import * as React from "react";
import { Rating, IconContainerProps } from "@mui/material";
import { useParams } from "react-router-dom";
import { useReviewInfoStore } from "./store/ReviewListStore";
import { getReviewList } from "./api/ReviewApi";
import { ReviewRequestResponseForm } from "./entity/ReviewList";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import { styled } from "@mui/material/styles";
import { getImageUrl } from "utility/s3/awsS3";

import "./css/ReviewListPage.css";
import { ReviewRequestImages } from "./entity/ReviewListImage";

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
    label: "1point",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: "2point",
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "3point",
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "4point",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "5point",
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ReviewListPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { productId } = useParams<RouteParams>();
  const { reviewInfo, setReviewInfo } = useReviewInfoStore();
  const [sortOption, setSortOption] = React.useState("rating");

  React.useEffect(() => {
    const fetchReviewData = async () => {
      if (productId) {
        const data = await getReviewList(productId);
        if (data) {
          setReviewInfo(data);
          setIsLoading(true);
        }
      }
    };
    fetchReviewData();
  }, [productId]);

  const handleRatingClick = () => {
    setSortOption("rating");
  };

  const handleLatestClick = () => {
    setSortOption("latest");
  };

  const sortReviews = (reviews: ReviewRequestResponseForm[], option: string) => {
    if (!Array.isArray(reviews)) {
      return reviews;
    }
    if (option === "rating") {
      return reviews
        .slice()
        .sort((a, b) => b.reviewRequestResponse.rating - a.reviewRequestResponse.rating);
    }
    if (option === "latest") {
      return reviews
        .slice()
        .sort(
          (a, b) =>
            new Date(b.reviewRequestResponse.createDate).getTime() -
            new Date(a.reviewRequestResponse.createDate).getTime()
        )
        .reverse();
    }
    return reviews;
  };

  const filteredReviews = sortReviews(reviewInfo, sortOption);

  return (
    <div className="review-component">
      <div className="review-header-name">상품후기</div>
      {isLoading ? (
        <>
          <div className="review-controll">
            <div className="review-counter">총 {reviewInfo.length}개</div>
            <div className="review-filter-button">
              <p
                className={sortOption === "rating" ? "" : "sort-option-selected"}
                onClick={handleRatingClick}
              >
                평점 높은 순
              </p>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <p
                className={sortOption === "latest" ? "" : "sort-option-selected"}
                onClick={handleLatestClick}
              >
                최신 순
              </p>
            </div>
          </div>
          {filteredReviews.map((review: ReviewRequestResponseForm, idx: number) => (
            <div className="review-list" key={idx}>
              <div className="review-info-container">
                <div className="review-user-info-container">
                  <p>{review.reviewRequestResponse.userNickName}</p>
                  <StyledRating
                    name="highlight-selected-only"
                    value={review.reviewRequestResponse.rating}
                    IconContainerComponent={IconContainer}
                    highlightSelectedOnly
                    readOnly
                  />
                  <p className="review-text-color-gray">
                    구매일: {review.reviewRequestResponse.purchaseDate}
                  </p>
                </div>
                <div className="review-product-info-container">
                  <p>{review.reviewRequestResponse.productName}</p>
                  <p className="review-text-color-gray">
                    {review.reviewRequestResponse.optionName}
                  </p>
                  <p>{review.reviewRequestResponse.content}</p>
                  <div className="review-image-container">
                    {review.imagesResponseList.map((image: ReviewRequestImages) => (
                      <img
                        key={image.reviewImageId}
                        className="review-images"
                        src={getImageUrl(image.reviewImages)}
                        alt="reviewImg"
                      />
                    ))}
                  </div>
                  <p className="review-text-color-gray">
                    작성일: {review.reviewRequestResponse.createDate.toString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>리뷰 정보 불러오는 중</p>
      )}
    </div>
  );
};

export default ReviewListPage;

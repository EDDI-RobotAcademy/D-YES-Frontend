import * as React from "react";
import { useParams } from "react-router-dom";
import { useReviewInfoStore } from "./store/ReviewListStore";
import { getReviewList } from "./api/ReviewApi";
import { ReviewRequestResponseForm } from "./entity/ReviewList";
import { getImageUrl } from "utility/s3/awsS3";
import { ReviewRequestImages } from "./entity/ReviewListImage";
import { ProductReviewResponseForUser } from "page/product/entity/ProductReview";
import { Rating } from "@mui/material";

import "./css/ReviewListPage.css";

interface RouteParams {
  productId: string;
  [key: string]: string;
}

const ReviewListPage: React.FC<{ reviewData: ProductReviewResponseForUser }> = (props) => {
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
      <p>평균 만족도</p>
      <Rating
        name="total-rating"
        value={Number(props.reviewData.averageRating.toFixed(1))}
        precision={0.1}
        style={{ padding: "5px 0" }}
        size="large"
        readOnly
      />
      <div>
        {props.reviewData.averageRating.toFixed(1)} ({props.reviewData.totalReviewCount})
      </div>
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
                  <Rating
                    name="user-rating"
                    value={review.reviewRequestResponse.rating}
                    precision={0.5}
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

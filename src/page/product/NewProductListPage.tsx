import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Button,
  Skeleton,
  Badge,
  Rating,
} from "@mui/material";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "utility/s3/awsS3";
import { won } from "utility/filters/wonFilter";
import { ProductListResponseFormForUser } from "page/product/entity/ProductList";
import { getNewProductList } from "./api/ProductApi";

import "./css/ProductListPage.css";
import "./css/NewProductListPage.css";

const tagMapping: { [key: string]: { className: string; name: string } } = {
  ORGANIC: { className: "product-list-tag-organic", name: "유기농" },
  PESTICIDE_FREE: { className: "product-list-tag-pesticide-free", name: "무농약" },
  ENVIRONMENT_FRIENDLY: { className: "product-list-tag-environment-friendly", name: "친환경" },
};

const NewProductListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState<ProductListResponseFormForUser[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getNewProductList();
        setLoadedProducts(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/productDetail/${productId}`);
  };

  const goToReview = (productId: number) => {
    localStorage.setItem("fromReview", "true");
    navigate(`/productDetail/${productId}`);
  };

  return (
    <div className="product-list-filter-options">
      <div className="product-list-page-name">신상품</div>
      <div className="product-filter-options">
        <div className="new-product-banner">
          <img style={{ height: "300px" }} src="/img/new-product-banner.png" />
        </div>
        {loading ? (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" alignItems="center">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card className="product-list-card-style" key={idx}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent sx={{ padding: "8px" }}>
                  <Skeleton variant="text" height={28} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
                <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Skeleton variant="circular" width={16} height={16} sx={{ marginRight: 1 }} />
                    <Skeleton variant="text" height={16} width={40} />
                  </div>
                  <Skeleton variant="text" height={16} width={80} />
                </CardActions>
              </Card>
            ))}
          </Box>
        ) : (
          <Container>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="flex-start"
              alignItems="center"
              paddingTop="10px"
            >
              {loadedProducts.map((product) => (
                <Card
                  key={product.productResponseForListForUser.productId}
                  className="product-list-card-style"
                  sx={{
                    opacity: product.productOptionResponseForListForUser.isSoldOut ? 0.5 : 1,
                    pointerEvents: product.productOptionResponseForListForUser.isSoldOut
                      ? "none"
                      : "auto",
                  }}
                >
                  {product.productOptionResponseForListForUser.isSoldOut && (
                    <img
                      src="img/soldoutExample.png"
                      alt="Sold Out"
                      className="product-list-soldout-img"
                    />
                  )}
                  <CardActionArea
                    onClick={() =>
                      handleProductClick(product.productResponseForListForUser.productId)
                    }
                  >
                    <CardContent className="product-list-farm-info">
                      <div>
                        <div>
                          {product.farmInfoResponseForListForUser.farmName}
                          <br />
                          {product.farmInfoResponseForListForUser.representativeName}
                        </div>
                      </div>
                      <CardMedia
                        component="img"
                        image={getImageUrl(product.farmInfoResponseForListForUser.mainImage)}
                        alt={`farmImage ${product.productResponseForListForUser.productId}`}
                        className="product-list-main-img"
                      />
                    </CardContent>
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(product.productMainImageResponseForListForUser.mainImg)}
                      alt={`mainImage ${product.productResponseForListForUser.productId}`}
                    />
                    <CardContent sx={{ padding: "8px" }}>
                      {product.productResponseForListForUser.cultivationMethod &&
                        product.productResponseForListForUser.cultivationMethod.length > 0 && (
                          <div className="product-list-tag-style">
                            <div
                              data-testid="cultivation-method"
                              className={`${
                                tagMapping[product.productResponseForListForUser.cultivationMethod]
                                  ?.className
                              } product-list-tag-common`}
                            >
                              {tagMapping[product.productResponseForListForUser.cultivationMethod]
                                ?.name || product.productResponseForListForUser.cultivationMethod}
                            </div>
                            <div className="new-product-tag product-list-tag-common">NEW</div>
                          </div>
                        )}
                      {product.farmProducePriceChangeInfoForListForUser
                        .roundedPriceChangePercentage !== -999 && (
                        <div className="product-list-fluctuation-rate">
                          <Badge
                            badgeContent={`${product.farmProducePriceChangeInfoForListForUser.roundedPriceChangePercentage}%`}
                            color={
                              product.farmProducePriceChangeInfoForListForUser
                                .roundedPriceChangePercentage > 0
                                ? "error"
                                : "primary"
                            }
                          />
                        </div>
                      )}
                      <Typography data-testid="product-name" variant="h6" fontFamily={"SUIT-Bold"}>
                        {product.productResponseForListForUser.productName}
                      </Typography>
                      <Typography
                        data-testid="option-price"
                        variant="body2"
                        color="text.secondary"
                        fontFamily={"SUIT-Light"}
                      >
                        {won(product.productOptionResponseForListForUser.minOptionPrice)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions className="product-list-review-grid">
                    <div className="product-list-review-rate">
                      <Rating
                        name="rating"
                        value={product.productReviewResponseForUser.averageRating}
                        precision={0.1}
                        readOnly
                      />
                      ({product.productReviewResponseForUser.totalReviewCount})
                    </div>
                    <Button
                      size="small"
                      onClick={() => goToReview(product.productResponseForListForUser.productId)}
                    >
                      리뷰 확인하기
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Container>
        )}
      </div>
    </div>
  );
};

export default NewProductListPage;

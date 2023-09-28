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
import { CardActionArea, FormControlLabel, Checkbox } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getImageUrl } from "utility/s3/awsS3";
import { won } from "utility/filters/wonFilter";
import { ProductListResponseFormForUser } from "page/product/entity/ProductList";
import RotatingIconButton from "layout/button/RotatingIconButton";
import { getProductList } from "./api/ProductApi";

import "./css/ProductListPage.css";

const tagMapping: { [key: string]: { className: string; name: string } } = {
  ORGANIC: { className: "product-list-tag-organic", name: "유기농" },
  PESTICIDE_FREE: { className: "product-list-tag-pesticide-free", name: "무농약" },
  ENVIRONMENT_FRIENDLY: { className: "product-list-tag-environment-friendly", name: "친환경" },
};

const FilterOptions: React.FC<{
  selectedFilters: string[];
  onFilterChange: (selectedFilters: string[]) => void;
}> = ({ selectedFilters, onFilterChange }) => {
  const handleTagClick = (tag: string) => {
    if (selectedFilters.includes(tag)) {
      onFilterChange(selectedFilters.filter((filter) => filter !== tag));
    } else {
      onFilterChange([...selectedFilters, tag]);
    }
  };
  return (
    <div>
      {Object.keys(tagMapping).map((tag) => (
        <FormControlLabel
          key={tag}
          control={
            <Checkbox
              checked={selectedFilters.includes(tag)}
              onChange={() => handleTagClick(tag)}
              value={tag}
            />
          }
          label={tagMapping[tag].name || tag}
          labelPlacement="end"
        />
      ))}
    </div>
  );
};

const ProductListPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(Object.keys(tagMapping));
  const [priceSort, setPriceSort] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState<ProductListResponseFormForUser[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProductList(currentPath);
        setLoadedProducts(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, [currentPath]);

  const handleProductClick = (productId: number) => {
    navigate(`/productDetail/${productId}`);
  };

  const handleSortToggle = () => {
    setPriceSort((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
  };

  const filterProducts = (
    products: ProductListResponseFormForUser[],
    selectedFilters: string[]
  ): ProductListResponseFormForUser[] => {
    if (selectedFilters.length === 0) {
      return products;
    }
    return products.filter((product) =>
      selectedFilters.some(
        (filter) => product.productResponseForListForUser.cultivationMethod === filter
      )
    );
  };

  const sortProducts = (
    products: ProductListResponseFormForUser[]
  ): ProductListResponseFormForUser[] => {
    return products
      .slice()
      .sort((a, b) => {
        if (priceSort === "asc") {
          return (
            a.productOptionResponseForListForUser.minOptionPrice -
            b.productOptionResponseForListForUser.minOptionPrice
          );
        } else {
          return (
            b.productOptionResponseForListForUser.minOptionPrice -
            a.productOptionResponseForListForUser.minOptionPrice
          );
        }
      })
      .sort((a, b) => {
        if (
          a.productOptionResponseForListForUser.isSoldOut &&
          !b.productOptionResponseForListForUser.isSoldOut
        ) {
          return 1;
        }
        if (
          !a.productOptionResponseForListForUser.isSoldOut &&
          b.productOptionResponseForListForUser.isSoldOut
        ) {
          return -1;
        }
        return 0;
      });
  };

  const filteredProducts = filterProducts(loadedProducts, selectedFilters);
  const sortedProducts = sortProducts(filteredProducts);

  const goToReview = (productId: number) => {
    localStorage.setItem("fromReview", "true");
    navigate(`/productDetail/${productId}`);
  };

  return (
    <div className="product-list-filter-options">
      <div className="product-list-page-name">상품 전체 리스트</div>
      <div className="product-filter-options">
        <div className="filter-button-container">
          <div>
            <FilterOptions selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} />
          </div>
          <div>
            <RotatingIconButton up="가격 높은 순" down="가격 낮은 순" onToggle={handleSortToggle} />
          </div>
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
              {sortedProducts.map((product) => (
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

export default ProductListPage;

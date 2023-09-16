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
} from "@mui/material";
// import StarIcon from "@mui/icons-material/Star";
import { CardActionArea, FormControlLabel, Checkbox } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getImageUrl } from "utility/s3/awsS3";
import { won } from "utility/filters/wonFilter";
import ToggleComponent from "page/product/components/productOption/ToggleComponent";
import { ProductList } from "page/product/entity/ProductList";
import RotatingIconButton from "layout/button/RotatingIconButton";
import { getProductList } from "./api/ProductApi";

import "./css/ProductListPage.css";

const tagMapping: { [key: string]: { className: string; name: string } } = {
  ORGANIC: { className: "tag-organic", name: "유기농" },
  PESTICIDE_FREE: { className: "tag-pesticide-free", name: "무농약" },
  ENVIRONMENT_FRIENDLY: { className: "tag-environment-friendly", name: "친환경" },
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
          className="checkbox-name"
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
  const [loadedProducts, setLoadedProducts] = useState<ProductList[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProductList(currentPath!);
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

  const filterProducts = (products: ProductList[], selectedFilters: string[]): ProductList[] => {
    if (selectedFilters.length === 0) {
      return products;
    }
    return products.filter((product) =>
      selectedFilters.some((filter) => product.cultivationMethod === filter)
    );
  };

  const sortProducts = (products: ProductList[]): ProductList[] => {
    // 기본 필터 -> 판매 여부
    // 추가 필터 -> 가격순
    return products
      .slice()
      .sort((a, b) => {
        if (priceSort === "asc") {
          return a.minOptionPrice - b.minOptionPrice;
        } else {
          return b.minOptionPrice - a.minOptionPrice;
        }
      })
      .sort((a, b) => {
        if (a.isSoldOut && !b.isSoldOut) {
          return 1;
        }
        if (!a.isSoldOut && b.isSoldOut) {
          return -1;
        }
        return 0;
      });
  };

  const filteredProducts = filterProducts(loadedProducts, selectedFilters);
  const sortedProducts = sortProducts(filteredProducts);

  return (
    <div className="product-list-container">
      <div className="product-list-page">상품 전체 리스트</div>
      <div className="product-filter-options">
        <div className="product-filter-toggle">
          <ToggleComponent label="필터" height={50}>
            <Box>
              <div className="filter-button-container">
                <div>
                  <FilterOptions
                    selectedFilters={selectedFilters}
                    onFilterChange={setSelectedFilters}
                  />
                </div>
                <div>
                  <RotatingIconButton
                    up="가격 높은 순"
                    down="가격 낮은 순"
                    onToggle={handleSortToggle}
                  />
                </div>
              </div>
            </Box>
          </ToggleComponent>
        </div>
        {loading ? (
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" alignItems="center">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card
                key={idx}
                sx={{
                  width: 275,
                  height: "auto",
                  marginBottom: 2,
                  boxShadow: "none",
                  position: "relative",
                }}
              >
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
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
            }}
          >
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              justifyContent="center"
              alignItems="center"
              paddingTop="10px"
            >
              {sortedProducts.map((product) => (
                <Card
                  key={product.productId}
                  className=""
                  sx={{
                    width: 275,
                    height: "auto",
                    marginBottom: 2,
                    boxShadow: "none",
                    position: "relative",
                    opacity: product.isSoldOut ? 0.5 : 1,
                    pointerEvents: product.isSoldOut ? "none" : "auto",
                  }}
                >
                  {product.isSoldOut && (
                    <img
                      src="img/soldoutExample.png"
                      alt="Sold Out"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -65%)",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        zIndex: 1,
                      }}
                    />
                  )}
                  <CardActionArea onClick={() => handleProductClick(product.productId)}>
                    <CardContent
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: "4px",
                        fontFamily: "SUIT-Light",
                        fontSize: "15px",
                      }}
                    >
                      <div className="farm-info">
                        {product.farmName}
                        <br />
                        {product.representativeName}
                      </div>
                      <CardMedia
                        component="img"
                        height="30"
                        image={getImageUrl(product.mainImage)}
                        alt={`farmImage ${product.productId}`}
                        style={{
                          position: "relative",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                          overflow: "hidden",
                          objectFit: "cover",
                          paddingLeft: "6px",
                        }}
                      />
                    </CardContent>
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(product.productMainImage)}
                      alt={`mainImage ${product.productId}`}
                    />
                    <CardContent sx={{ padding: "8px" }}>
                      {product.cultivationMethod && product.cultivationMethod.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            gap: "4px",
                            marginTop: "8px",
                          }}
                        >
                          <div
                            data-testid="cultivation-method"
                            className={`${
                              tagMapping[product.cultivationMethod]?.className
                            } tag-common`}
                          >
                            {tagMapping[product.cultivationMethod]?.name ||
                              product.cultivationMethod}
                          </div>
                        </div>
                      )}
                      <Typography data-testid="product-name" variant="h6" fontFamily={"SUIT-Bold"}>
                        {product.productName}
                      </Typography>
                      <Typography
                        data-testid="option-price"
                        variant="body2"
                        color="text.secondary"
                        fontFamily={"SUIT-Light"}
                      >
                        {won(product.minOptionPrice)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
                    {/* <div style={{ display: "flex", alignItems: "center" }}>
                      <StarIcon sx={{ color: "#f1c40f", fontSize: "1rem" }} />
                      <Typography
                        variant="body2"
                        sx={{ marginLeft: "4px" }}
                        fontFamily={"SUIT-Light"}
                      >
                        {product.ratings.toFixed(1) || 0}&nbsp;({product.reviewCount})
                      </Typography>
                    </div> */}
                    <Button
                      size="small"
                      component={Link}
                      to={`/reviews/${product.productId}`}
                      style={{ display: "flex", alignItems: "center", fontFamily: "SUIT-Light" }}
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

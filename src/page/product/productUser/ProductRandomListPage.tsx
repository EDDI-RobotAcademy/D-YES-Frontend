import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Skeleton,
} from "@mui/material";
import { CardActionArea } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { RandomProductList } from "../entity/RandomProductList";
import { getImageUrl } from "utility/s3/awsS3";
import { getRandomProductList } from "../api/ProductApi";
import { won } from "utility/filters/wonFilter";

import "./css/ProductRandomList.css";

const ProductRandomListPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState<RandomProductList[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getRandomProductList();
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

  return (
    <div className="product-randon-list-container">
      <div className="product-randon-list-header">오늘의 상품</div>
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
              {loadedProducts.map((product) => (
                <Card
                  key={product.productId}
                  className=""
                  sx={{
                    width: 225,
                    height: "auto",
                    marginBottom: 2,
                    boxShadow: "none",
                    position: "relative",
                  }}
                >
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
                    </CardContent>
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(product.productMainImage)}
                      alt={`mainImage ${product.productId}`}
                    />
                    <CardContent sx={{ padding: "8px" }}>
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
                </Card>
              ))}
            </Box>
          </Container>
        )}
      </div>
  );
};

export default ProductRandomListPage;

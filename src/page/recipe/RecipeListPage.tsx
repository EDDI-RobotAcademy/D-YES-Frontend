import { Card, CardContent, CardMedia, Typography, Grid, Box } from "@mui/material";
import React from "react";

const RecipeListPage = () => {
  // 가상 레시피 데이터 배열 생성 (이미지 URL 포함)
  const recipes = [
    {
      id: 1,
      title: "파스타",
      description: "맛있는 파스타 레시피",
      image: "/img/images (1).jpg",
    },
    {
      id: 2,
      title: "스프",
      description: "건강한 스프 레시피",
      image: "/img/images (1).jpg",
    },
    {
      id: 3,
      title: "샐러드",
      description: "시원한 샐러드 레시피",
      image: "/img/images.jpg",
    },
    {
      id: 4,
      title: "한식",
      description: "고소한 한식 레시피",
      image: "/img/images.jpg",
    },
  ];

  const cardsPerRow = 3;

  const cardGroups = [];
  for (let i = 0; i < recipes.length; i += cardsPerRow) {
    const cardGroup = recipes.slice(i, i + cardsPerRow);
    cardGroups.push(cardGroup);
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <div>
        <h1>레시피 목록</h1>
        {cardGroups.map((group, index) => (
          <Grid container spacing={2} key={index} sx={{ marginY: 2 }}>
            {group.map((recipe) => (
              <Grid item key={recipe.id} xs={12 / cardsPerRow}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={recipe.image}
                    alt={recipe.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      </div>
    </Box>
  );
};

export default RecipeListPage;

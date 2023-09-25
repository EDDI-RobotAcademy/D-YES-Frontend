import { Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";

const RecipeDetailPage = () => {
  const recipeData = {
    mainImage: `/img/sampleImg.jpg`,
    recipeTitle: "레시피 제목",
    cookingTime: "조리 시간",
    briefDescription: "간략한 설명",
    mainIngredient: "메인 재료",
    subIngredients: ["부재료 1", "부재료 2", "부재료 3"],
    detailedInstructions: ["단계 1 설명", "단계 2 설명", "단계 3 설명"],
  };

  return (
    <div>
      <Container sx={{ marginTop: "2em", display: "flex", width: "1060px" }}>
        <Grid container spacing={2}>
          {/* 메인 이미지 */}
          <Grid
            item
            xs={12}
            md={6}
            style={{ padding: "16px", display: "flex", justifyContent: "flex-end" }}
          >
            <img
              src={recipeData.mainImage}
              alt={recipeData.recipeTitle}
              style={{
                width: "500px",
                height: "500px",
                objectFit: "cover",
              }}
            />
          </Grid>

          {/* 레시피 정보 */}
          <Grid
            item
            xs={12}
            md={6}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "500px",
              width: "500px",
            }}
          >
            {/* 레시피 제목 */}
            <Typography variant="h4" gutterBottom>
              {recipeData.recipeTitle}
            </Typography>

            {/* 조리 시간 */}
            <Typography variant="subtitle1" gutterBottom>
              조리 시간: {recipeData.cookingTime}
            </Typography>
            <hr
              style={{
                width: "500px",
                border: "none",
                borderBottom: "1px solid #ccc",
                margin: "0 0 16px 0",
              }}
            />

            {/* 간략한 설명 */}
            <Typography variant="body1">{recipeData.briefDescription}</Typography>
          </Grid>

          {/* 부재료들 */}
          <Grid item xs={12} sx={{ width: "100%" }}>
            <div style={{ position: "relative" }}>
              <Typography variant="h6">재료</Typography>
            </div>
          </Grid>
          <Paper
            style={{
              padding: "16px",
              marginTop: "16px",
              backgroundColor: "purple",
              height: "200px",
              width: "470px",
            }}
          >
            <Typography variant="h6">주재료</Typography>
            <Typography variant="body1">{recipeData.mainIngredient}</Typography>
          </Paper>

          {/* 부재료 상자 */}
          <Paper
            style={{
              padding: "16px",
              marginTop: "16px",
              marginLeft: "24px",
              backgroundColor: "purple",
              height: "200px",
              width: "470px",
            }}
          >
            <Typography variant="h6">부재료</Typography>
            <Typography variant="body1">
              <ul>
                {recipeData.subIngredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </Typography>
          </Paper>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <div style={{ position: "relative" }}>
              <Typography variant="h6">만드는 방법</Typography>
            </div>
          </Grid>
          <Paper
            style={{
              padding: "16px",
              marginTop: "16px",
              backgroundColor: "purple",
              width: "100%",
            }}
          >
            <ol>
              {recipeData.detailedInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};
export default RecipeDetailPage;

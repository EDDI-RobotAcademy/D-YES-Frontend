import React from "react";
import { Button, TextField } from "@mui/material";
import { RecipeDetail } from "./entity/Recipe";
import {
  mainIngredients,
  recipeDifficulty,
  recipeMainCategory,
  recipeSubCategory,
} from "./RecipeDictionary";
import FireIcon from "@mui/icons-material/LocalFireDepartment";
import TimerIcon from "@mui/icons-material/Timer";
import GroupIcon from "@mui/icons-material/Group";

import "./css/RecipeDetailPage.css";

const RecipeDetailPage: React.FC = () => {
  const dummyRecipeData: RecipeDetail = {
    nickName: "형진",
    recipeRegisterRequest: {
      recipeName: "사과 만들기",
    },
    recipeContentRegisterRequest: {
      recipeDetails: ["만드는법 1번", "만드는법 2번", "만드는법 3번"],
      recipeDescription: "사과를 만들어보아요",
      cookingTime: "10분",
      difficulty: "EASY",
    },
    recipeCategoryRegisterRequest: {
      recipeMainCategory: "KOREAN",
      recipeSubCategory: "SALAD",
    },
    recipeIngredientRegisterRequest: {
      servingSize: 1,
      mainIngredient: "CUCUMBER",
      mainIngredientAmount: "1개",
      otherIngredientList: [
        { ingredientName: "부재료 1번", ingredientAmount: "1개" },
        { ingredientName: "부재료 2번", ingredientAmount: "2개" },
        { ingredientName: "부재료 3번", ingredientAmount: "3개" },
      ],
      seasoningList: [
        { ingredientName: "양념 1번", ingredientAmount: "1개" },
        { ingredientName: "양념 2번", ingredientAmount: "2개" },
        { ingredientName: "양념 3번", ingredientAmount: "3개" },
      ],
    },
    recipeMainImageRegisterRequest: {
      recipeMainImage: "/img/sampleImg1.jpg",
    },
  };

  const mainCategoryValue: string =
    dummyRecipeData.recipeCategoryRegisterRequest.recipeMainCategory;
  const mainCategoryList = recipeMainCategory.find(
    (category) => category.value === mainCategoryValue
  );

  const subCategoryValue: string = dummyRecipeData.recipeCategoryRegisterRequest.recipeSubCategory;
  const subCategoryList = recipeSubCategory.find((category) => category.value === subCategoryValue);

  const difficultyValue: string = dummyRecipeData.recipeContentRegisterRequest.difficulty;
  const difficultyList = recipeDifficulty.find(
    (difficulty) => difficulty.value === difficultyValue
  );

  const mainIngredientValue: string =
    dummyRecipeData.recipeIngredientRegisterRequest.mainIngredient;
  const mainIngredientList = mainIngredients.find(
    (ingredient) => ingredient.value === mainIngredientValue
  );

  const handleRecipeModify = () => {};

  const handleRecipeDelete = () => {};

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-grid">
        <div className="recipe-detail-page-name">레시피 목록</div>
        <hr />
        <div className="recipe-detail-flex">
          <div className="recipe-detail-main-info">
            <div className="recipe-detail-image-grid">
              <img
                src={dummyRecipeData.recipeMainImageRegisterRequest.recipeMainImage}
                alt={dummyRecipeData.recipeRegisterRequest.recipeName}
                className="recipe-detail-image"
              />
            </div>
            <div className="recipe-detail-info-grid">
              <div className="recipe-detail-nickname-category">
                <p className="recipe-detail-nickname">{dummyRecipeData.nickName}님의 레시피</p>
                <p>
                  {mainCategoryList?.label} | {subCategoryList?.label}
                </p>
              </div>
              <p className="recipe-detail-recipe-name">
                {dummyRecipeData.recipeRegisterRequest.recipeName}
              </p>
              <hr className="recipe-detail-hr-1" />
              <p className="recipe-detail-description">
                {dummyRecipeData.recipeContentRegisterRequest.recipeDescription}
              </p>
            </div>
          </div>
          <div className="recipe-detail-spacer" />
          <div className="recipe-detail-detail-info-grid">
            <div className="recipe-detail-detail-icon">
              <FireIcon fontSize="inherit" />
              {difficultyList?.label}
            </div>
            <div className="recipe-detail-detail-icon">
              <TimerIcon fontSize="inherit" />
              {dummyRecipeData.recipeContentRegisterRequest.cookingTime}
            </div>
            <div className="recipe-detail-detail-icon">
              <GroupIcon fontSize="inherit" />
              {dummyRecipeData.recipeIngredientRegisterRequest.servingSize}인분
            </div>
          </div>
          <div className="recipe-detail-spacer" />
          <div className="recipe-detail-info">
            <p className="recipe-detail-info-font">재료</p>
          </div>
          <div className="recipe-detail-ingredients">
            <div className="recipe-detail-ingredient">
              <p className="recipe-detail-ingredient-name">주재료</p>
              <div className="recipe-detail-ingredient-container">
                <div className="recipe-detail-main-ingredient">
                  <p>{mainIngredientList?.label}</p>
                  <p>{dummyRecipeData.recipeIngredientRegisterRequest.mainIngredientAmount}</p>
                </div>
              </div>
            </div>
            <div className="recipe-detail-ingredient">
              <p className="recipe-detail-ingredient-name">부재료</p>
              <div className="recipe-detail-ingredient-container">
                {dummyRecipeData.recipeIngredientRegisterRequest.otherIngredientList.map(
                  (ingredient, index) => (
                    <div className="recipe-detail-sub-ingredient" key={index}>
                      <p>{ingredient.ingredientName}</p>
                      <p>{ingredient.ingredientAmount}</p>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="recipe-detail-ingredient">
              <p className="recipe-detail-ingredient-name">양념</p>
              <div className="recipe-detail-ingredient-container">
                {dummyRecipeData.recipeIngredientRegisterRequest.seasoningList.map(
                  (ingredient, index) => (
                    <div className="recipe-detail-sub-ingredient" key={index}>
                      <p>{ingredient.ingredientName}</p>
                      <p>{ingredient.ingredientAmount}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="recipe-detail-spacer" />
          <div className="recipe-detail-info">
            <p className="recipe-detail-info-font">만드는 방법</p>
          </div>
          <div className="recipe-detail-instructions">
            {dummyRecipeData.recipeContentRegisterRequest.recipeDetails.map((detail, idx) => (
              <div className="recipe-detail-instruction" key={idx}>
                <span className="recipe-detail-idx-num">{idx + 1}</span>
                {detail}
              </div>
            ))}
          </div>
          <div className="recipe-detail-spacer" />
          <div className="recipe-detail-info">
            <p className="recipe-detail-info-font">댓글</p>
          </div>
          <div className="recipe-detail-comment-container">
            <TextField className="recipe-detail-comment-field" placeholder="댓글을 입력하세요" />
            <div className="recipe-detail-comment-btn">
              <Button
                type="submit"
                variant="outlined"
                style={{ minWidth: "50px", color: "#578b36", borderColor: "#578b36" }}
              >
                확인
              </Button>
            </div>
          </div>

          {dummyRecipeData.nickName === localStorage.getItem("encodedNickName") ? (
            <div className="recipe-datail-control-btn">
              <Button
                variant="contained"
                style={{ minWidth: "150px", color: "white", backgroundColor: "#578b36" }}
                onClick={handleRecipeModify}
              >
                수정
              </Button>
              <Button
                variant="contained"
                style={{ minWidth: "150px", color: "white", backgroundColor: "#578b36" }}
                onClick={handleRecipeDelete}
              >
                삭제
              </Button>
            </div>
          ) : (
            <hr />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;

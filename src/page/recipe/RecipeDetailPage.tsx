import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
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
import { deleteRecipe, getRecipeDetail } from "./api/RecipeApi";
import { toast } from "react-toastify";
import { getImageUrl } from "utility/s3/awsS3";
import RecipeComment from "./RecipeComment";

import "./css/RecipeDetailPage.css";

interface RouteParams {
  recipeId: string;
  [key: string]: string;
}
const RecipeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams<RouteParams>();
  const [loadedItems, setLoadedItems] = useState<RecipeDetail>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecipeDetailData = async () => {
      try {
        const data = await getRecipeDetail(recipeId!);
        setLoadedItems(data);
        setIsLoading(true);
      } catch (error) {
        toast.error("레시피 정보를 가져오는데 실패했습니다");
      }
    };
    fetchRecipeDetailData();
  }, []);

  const mainCategoryValue: string =
    loadedItems?.recipeCategoryRegisterRequest.recipeMainCategory || "";
  const mainCategoryList = recipeMainCategory.find(
    (category) => category.value === mainCategoryValue
  );

  const subCategoryValue: string =
    loadedItems?.recipeCategoryRegisterRequest.recipeSubCategory || "";
  const subCategoryList = recipeSubCategory.find((category) => category.value === subCategoryValue);

  const difficultyValue: string = loadedItems?.recipeContentRegisterRequest.difficulty || "";
  const difficultyList = recipeDifficulty.find(
    (difficulty) => difficulty.value === difficultyValue
  );

  const mainIngredientValue: string =
    loadedItems?.recipeIngredientRegisterRequest.mainIngredient || "";
  const mainIngredientList = mainIngredients.find(
    (ingredient) => ingredient.value === mainIngredientValue
  );

  const handleRecipeModify = () => {
    toast.error("준비중입니다");
  };

  const handleRecipeDelete = async (recipeId: string) => {
    try {
      const isDelete = await deleteRecipe(recipeId);
      if (isDelete) {
        toast.success("레시피가 삭제되었습니다");
        navigate("/recipe/list", { replace: true });
      } else {
        toast.error("서버와의 통신 중 오류가 발생했습니다");
      }
    } catch (error) {
      toast.error("레시피 삭제에 실패했습니다");
    }
  };

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-grid">
        <div className="recipe-detail-page-name">레시피 목록</div>
        <hr />
        {isLoading && loadedItems ? (
          <div className="recipe-detail-flex">
            <div className="recipe-detail-main-info">
              <div className="recipe-detail-image-grid">
                <img
                  src={getImageUrl(loadedItems.recipeMainImageRegisterRequest.recipeMainImage)}
                  alt={loadedItems.recipeRegisterRequest.recipeName}
                  className="recipe-detail-image"
                />
              </div>
              <div className="recipe-detail-info-grid">
                <div className="recipe-detail-nickname-category">
                  <p className="recipe-detail-nickname">{loadedItems.nickName}님의 레시피</p>
                  <p>
                    {mainCategoryList?.label} | {subCategoryList?.label}
                  </p>
                </div>
                <p className="recipe-detail-recipe-name">
                  {loadedItems.recipeRegisterRequest.recipeName}
                </p>
                <hr className="recipe-detail-hr-1" />
                <p className="recipe-detail-description">
                  {loadedItems.recipeContentRegisterRequest.recipeDescription}
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
                {loadedItems.recipeContentRegisterRequest.cookingTime}
              </div>
              <div className="recipe-detail-detail-icon">
                <GroupIcon fontSize="inherit" />
                {loadedItems.recipeIngredientRegisterRequest.servingSize}인분
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
                    <p>{loadedItems.recipeIngredientRegisterRequest.mainIngredientAmount}</p>
                  </div>
                </div>
              </div>
              <div className="recipe-detail-ingredient">
                <p className="recipe-detail-ingredient-name">부재료</p>
                <div className="recipe-detail-ingredient-container">
                  {loadedItems.recipeIngredientRegisterRequest.otherIngredientList.map(
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
                  {loadedItems.recipeIngredientRegisterRequest.seasoningList.map(
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
              {loadedItems.recipeContentRegisterRequest.recipeDetails.map((detail, idx) => (
                <div className="recipe-detail-instruction" key={idx}>
                  <span className="recipe-detail-idx-num">{idx + 1}</span>
                  {detail}
                </div>
              ))}
            </div>
            <div className="recipe-detail-spacer" />
            <RecipeComment recipeId={recipeId!} />
            {loadedItems.nickName === localStorage.getItem("encodedNickName") ? (
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
                  onClick={() => handleRecipeDelete(recipeId!)}
                >
                  삭제
                </Button>
              </div>
            ) : (
              <hr />
            )}
          </div>
        ) : (
          <div>레시피 상세정보를 불러오는 중</div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;

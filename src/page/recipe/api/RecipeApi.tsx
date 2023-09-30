import axiosInstance from "utility/axiosInstance";
import { RecipeDetail } from "../entity/Recipe";
import { RecipeContent } from "../entity/RecipeContent";
import { RecipeImage } from "../entity/RecipeImage";
import { RecipeIngredient } from "../entity/RecipeIngredient";
import { RecipeName } from "../entity/RecipeName";
import { RecipeListResponseForm } from "../entity/RecipeList";
import { RecipeCategory } from "../entity/RecipeCategory";
import { RecipeRegisterForm } from "../entity/RecipeRegister";

const userToken = localStorage.getItem("userToken");

// 레시피 등록
export const recipeRegister = async (data: {
  userToken: string;
  recipeRegisterRequest: RecipeName;
  recipeContentRegisterRequest: RecipeContent;
  recipeCategoryRegisterRequest: RecipeCategory;
  recipeIngredientRegisterRequest: RecipeIngredient;
  recipeMainImageRegisterRequest: RecipeImage;
}): Promise<boolean> => {
  const response = await axiosInstance.post<boolean>("/recipe/register", data);
  console.log("짜잔", response.data);
  return response.data;
};

// 레시피 목록 조회
export const getRecipeList = async () => {
  const response = await axiosInstance.get<RecipeListResponseForm[]>("/recipe/list");
  console.log("레시피 목록 정보", response.data);
  return response.data;
};

// 레시피 읽기
export const getRecipeDetail = async (recipeId: string) => {
  const response = await axiosInstance.get<RecipeDetail>(`/recipe/read/${recipeId}`);
  console.log("레시피 상세정보", response.data);
  return response.data;
};

// 레시피 삭제
export const deleteRecipe = async (recipeId: string) => {
  const response = await axiosInstance.delete<boolean>(`/recipe/delete/${recipeId}`, {
    data: { userToken },
  });
  return response.data;
};

// 레시피 댓글 등록
export const recipeCommentRegister = async (data: RecipeRegisterForm) => {
  const response = await axiosInstance.post<boolean>("/recipe/comment/register", data);
  return response.data;
};

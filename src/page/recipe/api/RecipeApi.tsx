import axiosInstance from "utility/axiosInstance";
import { Recipe } from "../entity/Recipe";
import { RecipeContent } from "../entity/RecipeContent";
import { RecipeImage } from "../entity/RecipeImage";
import { RecipeIngredient } from "../entity/RecipeIngredient";
import { RecipeName } from "../entity/RecipeName";
import { RecipeListResponseForm } from "../entity/RecipeList";

export const recipeRegister = async (data: {
  userToken: string;
  recipeRegisterRequest: RecipeName;
  recipeContentRegisterRequest: RecipeContent;
  recipeIngredientRegisterRequest: RecipeIngredient;
  recipeMainImageRegisterRequest: RecipeImage;
}): Promise<Recipe> => {
  const response = await axiosInstance.post<Recipe>("/recipe/register", data);
  console.log("짜잔", response.data);
  return response.data;
};

// 레시피 목록 조회
export const getRecipeList = async () => {
  const response = await axiosInstance.get<RecipeListResponseForm[]>("/recipe/list");
  console.log("레시피 목록 정보", response.data);
  return response.data;
};

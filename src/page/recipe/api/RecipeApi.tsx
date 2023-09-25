import axiosInstance from "utility/axiosInstance";
import { Recipe } from "../entity/Recipe";
import { RecipeContent } from "../entity/RecipeContent";
import { RecipeImage } from "../entity/RecipeImage";
import { RecipeIngredient } from "../entity/RecipeIngredient";
import { RecipeName } from "../entity/RecipeName";

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

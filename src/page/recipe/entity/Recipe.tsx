import { RecipeCategory } from "./RecipeCategory";
import { RecipeContent } from "./RecipeContent";
import { RecipeImage, RecipeImageName } from "./RecipeImage";
import { RecipeIngredient } from "./RecipeIngredient";
import { RecipeName } from "./RecipeName";

export type Recipe = Omit<RecipeDetail, "nickName" | "recipeMainImageRegisterRequest"> & {
  recipeMainImageRegisterRequest: RecipeImage;
};

export type RecipeDetail = {
  nickName: string;
  recipeRegisterRequest: RecipeName;
  recipeContentRegisterRequest: RecipeContent;
  recipeCategoryRegisterRequest: RecipeCategory;
  recipeIngredientRegisterRequest: RecipeIngredient;
  recipeMainImageRegisterRequest: RecipeImageName;
};

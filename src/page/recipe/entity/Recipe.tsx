import { RecipeContent } from "./RecipeContent";
import { RecipeImage } from "./RecipeImage";
import { RecipeIngredient } from "./RecipeIngredient";
import { RecipeName } from "./RecipeName";

export interface Recipe {
  recipeRegisterRequest: RecipeName;
  recipeContentRegisterRequest: RecipeContent;
  recipeIngredientRegisterRequest: RecipeIngredient;
  recipeMainImageRegisterRequest: RecipeImage;
}

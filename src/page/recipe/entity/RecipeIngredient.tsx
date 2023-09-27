import { RecipeIngredientInfo } from "./RecipeIngredientInfo";

export interface RecipeIngredient {
  servingSize: number;
  mainIngredient: string;
  mainIngredientAmount: string;
  otherIngredientList: RecipeIngredientInfo[];
  seasoningList: RecipeIngredientInfo[];
}

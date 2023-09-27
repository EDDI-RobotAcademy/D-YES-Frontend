import { RecipeIngredientInfo } from "./RecipeIngredientInfo";

export interface RecipeIngredient {
  servingSize: number;
  mainIngredient: string;
  mainIngredientAmount: string;
  otherIngredienList: RecipeIngredientInfo[];
  seasoningList: RecipeIngredientInfo[];
}

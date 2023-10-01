import { RecipeCommentInfo } from "./RecipeCommentInfo";

export interface RecipeCommentList {
  recipeId: number;
  recipeCommentInfoResponseList: RecipeCommentInfo[];
}

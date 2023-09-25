import { create } from "zustand";
import { Recipe } from "../entity/Recipe";

interface RecipeState {
  recipes: Recipe;
  setRecipes: (recipes: Recipe) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: {} as Recipe,
  setRecipes: (recipes) => set({ recipes }),
}));
export default useRecipeStore;

import { CategoryElements } from "./CategoryElements";

export interface CategoryType {
  categoryId: number;
  categoryName: { name: string; categoryName: string };
  categoryElements: CategoryElements;
}

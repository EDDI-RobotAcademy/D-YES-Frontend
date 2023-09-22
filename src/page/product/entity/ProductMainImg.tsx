export interface ProductImg {
  mainImageId: number;
  mainImg: string;
}

export type ProductMainImageForUser = Omit<ProductImg, "mainImageId">;

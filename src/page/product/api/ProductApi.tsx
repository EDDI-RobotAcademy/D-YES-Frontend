import axiosInstance from "utility/axiosInstance";
import { Product } from "../entity/Product";
import { useOptions } from "../entity/useOptions";
import { ProductImg } from "../entity/ProductMainImg";
import { ProductDetailImg } from "../entity/ProductDetailImg";

// 상품 등록
export const registerProduct = async (data: {
  productRegisterRequest: Product;
  productOptionRegisterRequest: useOptions[];
  productMainImageRegisterRequest: ProductImg;
  productDetailImagesRegisterRequests: ProductDetailImg[];
}): Promise<Product> => {
  const response = await axiosInstance.springAxiosInst.post<Product>("/product/register", data);
  console.log("api데이터 확인", response.data);
  return response.data;
};

// 사용자용 상품 리스트 확인
export const getProductList = async () => {
  const response = await axiosInstance.springAxiosInst.get("/product/user/list");
  console.log("상품 리스트 데이터", response.data);
  return response.data;
};

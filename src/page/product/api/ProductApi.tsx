import axiosInstance from "utility/axiosInstance";
import { Product } from "../entity/Product";
import { useOptions } from "../entity/useOptions";
import { ProductImg } from "../entity/ProductMainImg";
import { ProductDetailImg } from "../entity/ProductDetailImg";

// 상품 등록
export const registerProduct = async (
  data: {
    productRegisterRequest: Product; 
    productOptionRegisterRequest: useOptions[];
    productMainImageRegisterRequest: ProductImg;
    productDetailImagesRegisterRequests: ProductDetailImg[]
  }
): Promise<Product> => {
  const response = await axiosInstance.springAxiosInst.post<Product>('/product/register', data)
  console.log('api데이터 확인', response.data)
  return response.data
}



import axiosInstance from "utility/axiosInstance";
import { Product } from "../entity/Product";
import { useOptions } from "../entity/useOptions";

// 상품 등록
export const registerProduct = async (
  data: {productName: string; productDescription: string; 
    cultivationMethod: string; productOption: useOptions[];}
): Promise<Product> => {
  const response = await axiosInstance.springAxiosInst.post<Product>('/product/register', data)
  console.log('api데이터 확인', response.data)
  return response.data
}



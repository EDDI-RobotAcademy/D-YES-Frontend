import axiosInstance from "utility/axiosInstance";
import { Product } from "../entity/Product";
import { useOptions } from "../entity/useOptions";
import { ProductImg } from "../entity/ProductMainImg";
import { ProductDetailImg } from "../entity/ProductDetailImg";
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import useProductStore from "../store/ProductStore";
import { ProductRead } from "../entity/ProductRead";
import { ProductModify } from "../entity/ProductModify";
import { ProductDetail } from "../entity/ProductDetail";

// 관리자용 상품 등록
export const registerProduct = async (data: {
  productRegisterRequest: Product;
  productOptionRegisterRequest: useOptions[];
  productMainImageRegisterRequest: ProductImg;
  productDetailImagesRegisterRequests: ProductDetailImg[];
  farmName: string;
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

// 관리자용 상품 리스트 확인
export const fetchProductList = async (): Promise<Product[]> => {
  const response = await axiosInstance.springAxiosInst.get<Product[]>("/product/admin/list", {
    params: {
      userToken: localStorage.getItem("userToken"),
    },
  });
  return response.data;
};

export const useProductListQuery = (): UseQueryResult<Product[], unknown> => {
  const setProducts = useProductStore((state) => state.setProducts);
  const queryResult: UseQueryResult<Product[], unknown> = useQuery(
    "productList",
    fetchProductList,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setProducts(data);
      },
    }
  );

  return queryResult;
};

// 관리자용 상품 삭제
export const deleteProducts = async (productIds: string[]): Promise<any> => {
  const userToken = localStorage.getItem("userToken");
  const deleteForm = {
    userToken: userToken,
    productIdList: productIds.map((id) => parseInt(id)),
  };

  const response = await axiosInstance.springAxiosInst.delete("/product/deleteList", {
    data: deleteForm,
  });

  return response.data;
};

// 관리자용 수정 페이지에 접근했을 때 데이터 읽어오기
export const fetchProduct = async (productId: string): Promise<ProductRead | null> => {
  const response = await axiosInstance.springAxiosInst.get<ProductRead>(
    `/product/admin/read/${productId}`
  );
  return response.data;
};

export const useProductQuery = (productId: string): UseQueryResult<ProductRead | null, unknown> => {
  return useQuery(["productRead", productId], () => fetchProduct(productId), {
    refetchOnWindowFocus: false,
  });
};

// 관리자 수정
export const updateProduct = async (updatedData: ProductModify): Promise<ProductModify> => {
  const {
    productId,
    productModifyRequest,
    productOptionModifyRequest,
    productMainImageModifyRequest,
    productDetailImagesModifyRequest,
    userToken = localStorage.getItem("userToken"),
  } = updatedData;
  const response = await axiosInstance.springAxiosInst.put<ProductModify>(
    `/product/modify/${productId}`,
    {
      userToken,
      productModifyRequest,
      productOptionModifyRequest,
      productMainImageModifyRequest,
      productDetailImagesModifyRequest,
    }
  );
  return response.data;
};

export const useProductUpdateMutation = (): UseMutationResult<
  ProductModify,
  unknown,
  ProductModify
> => {
  const queryClient = useQueryClient();
  return useMutation(updateProduct, {
    onSuccess: (data) => {
      queryClient.setQueryData(["productModify", data.productId], data);
    },
  });
};

// 사용자용 상품 상세정보 확인
export const getProductDetail = async (productId: string): Promise<ProductDetail | null> => {
  const response = await axiosInstance.springAxiosInst.get<ProductDetail>(
    `/product/user/read/${productId}`
  );
  console.log("확인", response.data);
  return response.data;
};

export const useProductDetailQuery = (
  productId: string
): UseQueryResult<ProductDetail | null, unknown> => {
  return useQuery(["productRead", productId], () => getProductDetail(productId));
};

// 상품 삭제
export const deleteProduct = async (productId: string): Promise<void> => {
  await axiosInstance.springAxiosInst.delete("product/delete", {
    data: { productId, userToken: localStorage.getItem("userToken") },
  });
};

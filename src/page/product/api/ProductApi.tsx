import axiosInstance from "utility/axiosInstance";
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Product } from "page/product/entity/Product";
import { useOptions } from "page/product/entity/useOptions";
import { ProductImg } from "page/product/entity/ProductMainImg";
import { ProductDetailImg } from "page/product/entity/ProductDetailImg";
import useProductStore from "page/product/store/ProductStore";
import { ProductRead } from "page/product/entity/ProductRead";
import { ProductModify } from "page/product/entity/ProductModify";
import { ProductDetail } from "page/product/entity/ProductDetail";
import { ProductPopupRead } from "page/product/entity/ProductPopupRead";
import ProductOptionStore from "page/product/store/ProductOptionStore";

// 관리자용 상품 등록
export const registerProduct = async (data: {
  productRegisterRequest: Product;
  productOptionRegisterRequest: useOptions[];
  productMainImageRegisterRequest: ProductImg;
  productDetailImagesRegisterRequests: ProductDetailImg[];
  farmName: string;
}): Promise<Product> => {
  const response = await axiosInstance.post<Product>(
    "/product/admin/register",
    data
  );
  console.log("api데이터 확인", response.data);
  return response.data;
};

// 사용자용 상품 리스트 확인
export const getProductList = async (currentPath: string) => {
  let endpoint = "/product/user/list/all";

  const selectedName = currentPath.substring(currentPath.lastIndexOf("/") + 1);
  const isCategoryPath = currentPath.startsWith("/productList/category/");
  const isRegionPath = currentPath.startsWith("/productList/region/");

  if (isCategoryPath) {
    endpoint = `/product/user/list/category/${selectedName}`;
  } else if (isRegionPath) {
    endpoint = `/product/user/list/region/${selectedName}`;
  }

  const response = await axiosInstance.get(endpoint);
  console.log("상품 리스트 데이터", response.data);
  return response.data;
};

// 관리자용 상품 리스트 확인
export const fetchProductList = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>("/product/admin/list", {
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

  const response = await axiosInstance.delete("/product/admin/deleteList", {
    data: deleteForm,
  });
  console.log("상품삭제", response.data);
  return response.data;
};

// 관리자용 수정 페이지에 접근했을 때 데이터 읽어오기
export const fetchProduct = async (productId: string): Promise<ProductRead | null> => {
  const response = await axiosInstance.get<ProductRead>(
    `/product/admin/read/${productId}`
  );
  console.log("읽기", response.data);
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
  const response = await axiosInstance.put<ProductModify>(
    `/product/admin/modify/${productId}`,
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
  const response = await axiosInstance.get<ProductDetail>(
    `/product/user/read/${productId}`
  );

  const optionList: useOptions[] = response.data.optionResponseForUser;
  const extendedOptionList = optionList.map((option) => ({
    ...option,
    optionCount: 1,
  }));

  ProductOptionStore.setState({ optionList: extendedOptionList });
  console.log(response.data);
  return response.data;
};

export const useProductDetailQuery = (
  productId: string
): UseQueryResult<ProductDetail | null, unknown> => {
  return useQuery(["productRead", productId], () => getProductDetail(productId), {
    refetchOnWindowFocus: false,
  });
};

// 관리자용 상품 삭제
export const deleteProduct = async (productId: string): Promise<void> => {
  await axiosInstance.delete(`product/admin/delete/${productId}`, {
    data: { userToken: localStorage.getItem("userToken") },
  });
};

// 사용자용 랜덤 상품 리스트 확인
export const getRandomProductList = async () => {
  const response = await axiosInstance.get("/product/user/random-list");
  console.log("랜덤 상품 리스트 데이터", response.data);
  return response.data;
};

// 관리자용 상품 요약정보 확인
export const fetchPopupProduct = async (productId: string): Promise<ProductPopupRead | null> => {
  const response = await axiosInstance.get<ProductPopupRead>(
    `/product/admin/read-summary/${productId}`
  );
  return response.data;
};

export const usePopupProductQuery = (
  productId: string
): UseQueryResult<ProductPopupRead | null, unknown> => {
  return useQuery(["productPopupRead", productId], () => fetchPopupProduct(productId), {
    refetchOnWindowFocus: false,
  });
};

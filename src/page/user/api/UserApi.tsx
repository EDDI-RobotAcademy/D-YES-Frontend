import axiosInstance from "utility/axiosInstance";
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { User } from "../entity/User";

const userToken = localStorage.getItem("userToken");

// 회원 정보 확인
export const UserMyPage = async (): Promise<User | null> => {
  const response = await axiosInstance.springAxiosInst.get("/user/userProfile", {
    params: {
      userToken: userToken,
    },
  });
  return response.data;
};

// 추가적으로 useQuery를 사용하는 이유는 데이터를 효율적으로 관리하고 가져오기 위해서
// 데이터를 가져와서 캐시에 저장하여 필요할 때마다 재요청하지 않고 데이터를 제공할 수 있음

// 로그아웃 이후 마이페이지를 눌러보니 로그인할때 서버에서 전송받았던 정보가 남아있는 것으로 확인
// 새로고침 후 저장되있던 정보가 사라짐
export const useUserQuery = (): UseQueryResult<User | null, unknown> => {
  return useQuery(["user"], () => UserMyPage(), { enabled: !!userToken, staleTime: Infinity });
};

// 회원 정보 등록 및 수정
export const updateInfo = async (updatedData: User): Promise<User> => {
  const { userToken, email, nickName, profileImg, contactNumber, address, zipCode, addressDetail } =
    updatedData;

    const response = await axiosInstance.springAxiosInst.put<User>("/user/updateInfo", {
    userToken,
    email,
    nickName,
    profileImg,
    contactNumber,
    address,
    zipCode,
    addressDetail,
  });
  return response.data;
};

// queryClient.setQueryData를 호출하여 캐시의 특정 쿼리 결과를 갱신
// 해당 사용자 계정 정보를 쿼리할 때 최신 정보가 사용될 수 있게 함
// 업데이트된 데이터를 캐시에 반영함으로써 네트워크 요청을 피하고 최신 정보를 얻을 수 있음
export const useUserUpdateMutation = (): UseMutationResult<User, unknown, User> => {
  const queryClient = useQueryClient();
  return useMutation(updateInfo, {
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.userId], data);
    },
  });
};

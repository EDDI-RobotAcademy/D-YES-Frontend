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
  return useQuery(["user"], () => UserMyPage(), { enabled: !!userToken });
};
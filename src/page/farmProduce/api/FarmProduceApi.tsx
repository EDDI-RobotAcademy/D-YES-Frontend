import axiosInstance from "utility/axiosInstance";

// 농산물 예측 가격 데이터 확인
export const getFarmProducePriceList = async () => {
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString().split('T')[0];
    console.log(formattedDate);

    const response = await axiosInstance.springAxiosInst.get("/farmProduce/get-price", {
        params: {
          currentDate: formattedDate
        }
      });
  console.log("농산물 예측 가격 데이터", response.data);
  return response.data;
};
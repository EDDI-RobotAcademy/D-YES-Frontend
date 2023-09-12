import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { farmRegister, updateFarm } from "page/admin/api/AdminApi";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getImageUrl, uploadFileAwsS3 } from "utility/s3/awsS3";
import { FarmModify } from "entity/farm/FarmModify";
import { FarmRead } from "entity/farm/FarmRead";
import useFarmStore from "store/farm/FarmStore";
import FarmBusinessInfo from "./farmInfo/FarmBusinessInfo";
import useFarmBusinessStore from "store/farm/FarmBusinessStore";
import FarmInfo from "./farmInfo/FarmInfo";

interface FarmReadInfoProps {
  selectedFarm: FarmRead | null;
  setSelectedFarm: (farm: FarmRead | null) => void;
}

const FarmRegister: React.FC<FarmReadInfoProps> = ({ selectedFarm }) => {
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const [showEditButton, setShowEditButton] = useState(true);
  const { farms } = useFarmStore();
  const { business } = useFarmBusinessStore();

  // 농가 정보 읽어오기
  // useEffect(() => {
  //   console.log("받아오니", selectedFarm);
  //   if (selectedFarm) {
  //     setBusinessInfo({
  //       businessName: selectedFarm.farmOperationInfoResponseForAdmin?.businessName || "",
  //       businessNumber: selectedFarm.farmOperationInfoResponseForAdmin?.businessNumber || "",
  //       representativeName:
  //         selectedFarm.farmOperationInfoResponseForAdmin?.representativeName || "",
  //       representativeContactNumber:
  //         selectedFarm.farmOperationInfoResponseForAdmin?.representativeContactNumber || "",
  //       farmName: selectedFarm.farmInfoResponseForAdmin?.farmName || "",
  //       csContactNumber: selectedFarm.farmInfoResponseForAdmin?.csContactNumber || "",
  //       addressDetail: selectedFarm.farmInfoResponseForAdmin?.farmAddress?.addressDetail || "",
  //       introduction: selectedFarm.farmInfoResponseForAdmin?.introduction || "",
  //     });
  //     setAddressInfo({
  //       address: selectedFarm.farmInfoResponseForAdmin?.farmAddress?.address || "",
  //       zipCode: selectedFarm.farmInfoResponseForAdmin?.farmAddress?.zipCode || "",
  //     });
  //     setSelectedOptions(
  //       Array.isArray(selectedFarm.farmInfoResponseForAdmin?.produceTypes)
  //         ? selectedFarm.farmInfoResponseForAdmin.produceTypes
  //         : []
  //     );
  //     setShowEditButton(true);
  //   }
  // }, [selectedFarm]);

  // 수정 정보 API로 전달
  // const modifyMutation = useMutation(updateFarm, {
  //   onSuccess: (data) => {
  //     queryClient.setQueryData("farmModify", data);
  //     console.log("수정확인", data);
  //     toast.success("수정되었습니다.");
  //   },
  // });

  // 수정
  // const handleEditFinishClick = async () => {
  //   if (businessInfo.csContactNumber && businessInfo.introduction && selectedOptions.length > 0) {
  //     const farmId = selectedFarm?.farmInfoResponseForAdmin.farmId;
  //     const userToken = localStorage.getItem("userToken") || "";
  //     let mainImageName = "";
  //     let s3MainObjectVersion = "";

  //     if (selectedMainImage) {
  //       mainImageName = selectedMainImage.name;
  //       s3MainObjectVersion = (await uploadFileAwsS3(selectedMainImage as File)) || "";
  //     } else {
  //       mainImageName = selectedFarm?.farmInfoResponseForAdmin?.mainImage || "";
  //     }

  //     const updateData: FarmModify = {
  //       farmId: farmId || "",
  //       userToken,
  //       csContactNumber: businessInfo.csContactNumber,
  //       introduction: businessInfo.introduction,
  //       produceTypes: selectedOptions,
  //       mainImage: mainImageName + (s3MainObjectVersion ? `?versionId=${s3MainObjectVersion}` : ""),
  //     };

  //     console.log("수정정보전송", updateData);
  //     await modifyMutation.mutateAsync(updateData);
  //     queryClient.invalidateQueries(["farm", farmId]);

  //     setShowEditButton(false);

  //     handleRegistrationComplete();
  //     const updatedSelectedFarm = { ...selectedFarm };

  //     if (updatedSelectedFarm.farmInfoResponseForAdmin) {
  //       updatedSelectedFarm.farmInfoResponseForAdmin.mainImage = "";
  //     }
  //   }
  // };

  // const handleRegistrationComplete = () => {
  //   setBusiness({
  //     businessName: "",
  //     businessNumber: "",
  //     representativeName: "",
  //     representativeContactNumber: "",
  //   });
  //   setFarms({
  //     farmName: "",
  //     csContactNumber: "",
  //     addressDetail: "",
  //     introduction: "",
  //   });
  //   setSelectedOptions([]);
  //   setSelectedMainImage(null);
  //   setAddressInfo(initialAddressInfo);
  // };

  const mutation = useMutation(farmRegister, {
    onSuccess: (data) => {
      if (typeof data === "boolean" && data === true) {
        queryClient.setQueryData("farm", data);
        console.log("확인", data);
        toast.success("등록되었습니다.");
      } else {
        toast.error("등록이 불가능합니다.");
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("받아온 정보", farms);
    console.log("받아온 정보", business);

    const mainFileToUpload = farms.mainImages ? new File([farms.mainImages], farms.mainImages) : "";
    if (!mainFileToUpload) {
      toast.error("농가 이미지를 등록해주세요");
      return;
    }

    const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

    const mainImages = mainFileToUpload
      ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
      : "undefined main image";

    const data = {
      businessName: business.businessName,
      businessNumber: business.businessNumber,
      representativeName: business.representativeName,
      representativeContactNumber: business.representativeContactNumber,
      farmName: farms.farmName,
      csContactNumber: farms.csContactNumber,
      address: farms.farmAddress?.address || "",
      zipCode: farms.farmAddress?.zipCode || "",
      addressDetail: farms.farmAddress?.addressDetail || "",
      mainImage: mainImages,
      introduction: farms.introduction,
      produceTypes: farms.produceTypes,
      userToken: userToken || "",
    };

    // if (
    //   !farms ||
    //   !business
    // ) {
    //   toast.error("모든 필드를 입력해주세요.");
    //   return;
    // }

    await mutation.mutateAsync(data);

    // handleRegistrationComplete();
  };

  return (
    <div>
      <div className="register-menu">
        <img className="farm-register-icon" alt="농가 등록" src="img/farm-register-icon.png" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            gutterBottom
            style={{
              fontSize: "16px",
              fontFamily: "SUIT-Medium",
              color: "#252525",
              marginBottom: "0px",
            }}
          >
            농가(사업자) 등록
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontSize: "12px",
              fontFamily: "SUIT-Regular",
              color: "#252525",
            }}
          >
            * 사업자 등록증에 있는 정보를 작성해주세요
          </Typography>
        </div>
      </div>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        paddingTop="20px" // 위쪽 패딩 값
        paddingBottom="50px" // 아래쪽 패딩 값
        bgcolor="white" // 하얀색 백그라운드 컬러
        border="solid 1px lightgray"
        paddingLeft="10px"
        paddingRight="10px"
      >
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <FarmBusinessInfo />
            <FarmInfo />
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#DF726D",
                  color: "white",
                  fontFamily: "SUIT-Regular",
                  fontSize: "14px",
                  marginTop: "12px",
                }}
                fullWidth
              >
                등록
              </Button>
              {/* {selectedFarm && showEditButton && (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#DF726D",
                    color: "white",
                    fontFamily: "SUIT-Regular",
                    fontSize: "14px",
                    marginTop: "12px",
                  }}
                  fullWidth
                  onClick={handleEditFinishClick}
                >
                  수정 완료
                </Button>
              )} */}
            </Grid>
          </form>
        </Container>
      </Box>
    </div>
  );
};

export default FarmRegister;

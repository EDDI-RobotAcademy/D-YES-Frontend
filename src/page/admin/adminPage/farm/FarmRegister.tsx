import { Container, Box, Typography, Grid, Button } from "@mui/material";
import { farmRegister, updateFarm } from "page/admin/api/AdminApi";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { FarmModify } from "entity/farm/FarmModify";
import useFarmStore from "store/farm/FarmStore";
import FarmBusinessInfo from "./farmInfo/FarmBusinessInfo";
import useFarmBusinessStore from "store/farm/FarmBusinessStore";
import FarmInfo from "./farmInfo/FarmInfo";
import useFarmReadStore from "store/farm/FarmReadStore";
import useFarmBusinessReadStore from "store/farm/FarmBusinessReadWtore";

const FarmRegister = () => {
  const queryClient = useQueryClient();
  const userToken = localStorage.getItem("userToken");
  const [showEditButton, setShowEditButton] = useState(true);
  const { farms, setFarms } = useFarmStore();
  const { business, setBusiness } = useFarmBusinessStore();
  const { farmReads, setFarmRead } = useFarmReadStore();
  const { setBusinessRead } = useFarmBusinessReadStore();

  // 수정 정보 API로 전달
  const modifyMutation = useMutation(updateFarm, {
    onSuccess: (data) => {
      queryClient.setQueryData("farmModify", data);
      console.log("수정확인", data);
      toast.success("수정되었습니다.");
    },
  });

  // 수정
  const handleEditFinishClick = async () => {
    if (
      (farms.csContactNumber || farmReads?.csContactNumber) &&
      (farms.introduction || farmReads?.introduction) &&
      (farms.produceTypes?.length > 0 ||
        (farmReads?.produceTypes && farmReads.produceTypes.length > 0))
    ) {
      const farmId = farmReads?.farmId;
      const userToken = localStorage.getItem("userToken") || "";

      const mainFileToUpload = farms.mainImage ? farms.mainImage : "";
      console.log("확인", mainFileToUpload);
      if (!mainFileToUpload) {
        toast.error("농가 이미지를 등록해주세요");
        return;
      }

      const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

      const mainImage = mainFileToUpload
        ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
        : "undefined main image";

      const updateData: FarmModify = {
        farmId: (farmId || "").toString(),
        userToken,
        csContactNumber: farms.csContactNumber || farmReads?.csContactNumber || "",
        introduction: farms.introduction || farmReads?.introduction || "",
        produceTypes: farms.produceTypes || farmReads?.produceTypes || [],
        mainImage: mainImage,
      };

      console.log("수정정보전송", updateData);
      await modifyMutation.mutateAsync(updateData);
      queryClient.invalidateQueries(["farm", farmId]);

      setShowEditButton(false);

      handleRegistrationComplete();
    }
  };

  const handleRegistrationComplete = () => {
    setBusiness({
      businessName: "",
      businessNumber: "",
      representativeName: "",
      representativeContactNumber: "",
    });
    setFarms({
      farmId: 0,
      farmName: "",
      csContactNumber: "",
      farmAddress: {
        address: "",
        zipCode: "",
        addressDetail: "",
      },
      mainImage: new File([], ""),
      introduction: "",
      produceTypes: [],
    });
    setFarmRead({
      farmId: 0,
      farmName: "",
      csContactNumber: "",
      farmAddress: {
        address: "",
        zipCode: "",
        addressDetail: "",
      },
      mainImage: "",
      introduction: "",
      produceTypes: [],
    });
    setBusinessRead({
      businessName: "",
      businessNumber: "",
      representativeName: "",
      representativeContactNumber: "",
    });
  };

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

    const mainFileToUpload = farms.mainImage ? farms.mainImage : "";
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

    if (!farms || !business) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    await mutation.mutateAsync(data);

    handleRegistrationComplete();
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
              {farmReads.farmId !== 0 && showEditButton && (
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
              )}
            </Grid>
          </form>
        </Container>
      </Box>
    </div>
  );
};

export default FarmRegister;

import React, { useEffect } from "react";
import useEventModifyStore from "./store/EventModifyStore";
import { Box, Button, Container } from "@mui/material";
import EventModifyDescription from "./components/modify/EventModifyDescription";
import EventModifyImage from "./components/modify/EventModifyImage";
import { useMutation, useQueryClient } from "react-query";
import { updateEvent } from "./api/EventApi";
import { toast } from "react-toastify";
import useEventReadStore from "./store/EventReadStore";
import { EventModify } from "./entity/EventModify";
import { EventModifyToken } from "./entity/EventModifyToken";
import { EventModifyDetail } from "./entity/EventModifyDetail";
import EventModifyDetailPage from "./components/modify/EventModifyDetailPage";
import { EventMainImage } from "./entity/EventMainImage";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { EventOption } from "./entity/EventOption";
import { useNavigate, useParams } from "react-router-dom";
import { EventDetailImage } from "./entity/EventDetailImage";
import { EventDate } from "./entity/EventDate";
import { EventCount } from "./entity/EventCount";
import EventModifyLimit from "./components/modify/EventModifyLimit";
import { useAuth } from "layout/navigation/AuthConText";

const EventModifyPage = () => {
  const { eventModify } = useEventModifyStore();
  const { eventReads } = useEventReadStore();
  const navigate = useNavigate();
  const { eventProductId } = useParams();
  const queryClient = useQueryClient();
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const mutation = useMutation(updateEvent, {
    onSuccess: (data) => {
      queryClient.setQueryData("eventModify", data);
      console.log("수정확인", data);
      toast.success("수정되었습니다.");
      navigate("/adminEventList");
    },
  });
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const combinedDetailImages = [
      ...(eventReads?.detailImagesForUser || []),
      ...(eventModify?.productDetailImagesModifyRequest || []),
    ];

    if (combinedDetailImages.length < 6) {
      toast.error("상세 이미지를 최소 6장 등록해주세요.");
      return;
    }

    if (combinedDetailImages.length > 10) {
      toast.error("상세 이미지를 최대 10장까지 등록할 수 있습니다.");
      return;
    }

    const eventReadsOptions = eventReads?.optionResponseForUser || {};
    const eventModifyOptions = eventModify?.productOptionModifyRequest || {};

    const allOptions = { ...eventReadsOptions, ...eventModifyOptions };

    const hasIncompleteOption =
      !allOptions.optionName || !allOptions.optionPrice || !allOptions.stock || !allOptions.unit;
    if (hasIncompleteOption) {
      toast.error("옵션 정보를 모두 입력해주세요.");
      return;
    }

    let mainImage = eventReads?.mainImageResponseForUser?.mainImg || "";

    if (eventModify.productMainImageModifyRequest?.mainImg) {
      const s3MainObjectVersion =
        (await uploadFileAwsS3(eventModify.productMainImageModifyRequest?.mainImg)) || "";
      mainImage = (eventModify.productMainImageModifyRequest?.mainImg.name +
        "?versionId=" +
        s3MainObjectVersion) as unknown as File;
    }

    const productModifyUserTokenAndEventProductIdRequest: EventModifyToken = {
      userToken: localStorage.getItem("userToken") || "",
    };

    const productModifyRequest: EventModifyDetail = {
      productName:
        eventModify.productModifyRequest?.productName ||
        eventReads.productResponseForUser?.productName,
      productDescription:
        eventModify.productModifyRequest?.productDescription ||
        eventReads.productResponseForUser?.productDescription,
      cultivationMethod:
        eventModify.productModifyRequest?.cultivationMethod ||
        eventReads.productResponseForUser?.cultivationMethod,
    };

    const productOptionModifyRequest: EventOption = {
      optionId: eventReads.optionResponseForUser?.optionId,
      optionName:
        eventModify.productOptionModifyRequest?.optionName ||
        eventReads.optionResponseForUser?.optionName,
      optionPrice:
        eventModify.productOptionModifyRequest?.optionPrice ||
        eventReads.optionResponseForUser?.optionPrice,
      stock:
        eventModify.productOptionModifyRequest?.stock || eventReads.optionResponseForUser?.stock,
      value:
        eventModify.productOptionModifyRequest?.value || eventReads.optionResponseForUser?.value,
      unit: eventModify.productOptionModifyRequest?.unit || eventReads.optionResponseForUser?.unit,
    };

    const productMainImageModifyRequest: EventMainImage = {
      mainImg: mainImage,
    };

    const detailImageUploadPromises = eventModify.productDetailImagesModifyRequest
      ? eventModify.productDetailImagesModifyRequest.map(async (image, idx) => {
          const detailFileToUpload = new File([image.detailImgs], image.detailImgs.name);

          let s3DetailObjectVersion = "";
          let name = "";

          s3DetailObjectVersion = (await uploadFileAwsS3(detailFileToUpload)) || "";
          name = detailFileToUpload.name;

          if (name.trim() === "") {
            return null;
          }

          return {
            detailImageId: 0,
            detailImgs: name + "?versionId=" + s3DetailObjectVersion,
          };
        })
      : [];
    const existingDetailImageNames = eventReads.detailImagesForUser.map((image) => ({
      detailImageId: image.detailImageId,
      detailImgs: image.detailImgs,
    }));

    const allDetailImageUploadPromises = [
      ...detailImageUploadPromises,
      ...existingDetailImageNames,
    ];

    const filteredAllDetailImageUploadPromises = allDetailImageUploadPromises.filter(
      (image) => image !== null
    );

    const productDetailImagesModifyRequest = await Promise.all(
      filteredAllDetailImageUploadPromises
    );

    const updatedProductDetailImagesModifyRequest = productDetailImagesModifyRequest
      .filter((detailImage) => detailImage !== null)
      .map((detailImage) => {
        const productDetailImg: EventDetailImage = {
          detailImageId: detailImage!.detailImageId,
          detailImgs: detailImage!.detailImgs as unknown as File,
        };

        return productDetailImg;
      });

    const eventProductModifyDeadLineRequest: EventDate = {
      startLine:
        eventModify.eventProductModifyDeadLineRequest?.startLine ||
        eventReads?.eventProductDeadLineResponse?.startLine ||
        null,
      deadLine:
        eventModify.eventProductModifyDeadLineRequest?.deadLine ||
        eventReads?.eventProductDeadLineResponse?.deadLine ||
        null,
    };

    const eventProductModifyPurchaseCountRequest: EventCount = {
      targetCount:
        eventModify.eventProductModifyPurchaseCountRequest?.targetCount ||
        eventReads.eventProductPurchaseCountResponse?.targetCount,
    };

    const updateData: EventModify = {
      eventProductId: parseInt(eventProductId || ""),
      productModifyUserTokenAndEventProductIdRequest:
        productModifyUserTokenAndEventProductIdRequest,
      productModifyRequest: productModifyRequest,
      productOptionModifyRequest: productOptionModifyRequest,
      productMainImageModifyRequest: productMainImageModifyRequest,
      productDetailImagesModifyRequest: updatedProductDetailImagesModifyRequest,
      eventProductModifyDeadLineRequest: eventProductModifyDeadLineRequest,
      eventProductModifyPurchaseCountRequest: eventProductModifyPurchaseCountRequest,
    };

    console.log("수정정보전송", updateData);
    await mutation.mutateAsync(updateData);
  };

  return (
    <div className="event-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <h1>이벤트 수정</h1>
            <EventModifyDetailPage />
            <EventModifyImage />
            <EventModifyLimit />
            <EventModifyDescription />
          </Box>
          <Button type="submit">수정완료</Button>
        </form>
      </Container>
    </div>
  );
};

export default EventModifyPage;

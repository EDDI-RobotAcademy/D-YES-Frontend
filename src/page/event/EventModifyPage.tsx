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
import { useParams } from "react-router-dom";

const EventModifyPage = () => {
  const { eventModify, setEventModify } = useEventModifyStore();
  const { eventReads, setEventRead } = useEventReadStore();
  const { eventProductId } = useParams();
  const hasFetchedRef = React.useRef(false);
  const queryClient = useQueryClient();
  const mutation = useMutation(updateEvent, {
    onSuccess: (data) => {
      queryClient.setQueryData("eventModify", data);
      console.log("수정확인", data);
      toast.success("수정되었습니다.");
    },
  });
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
      produceType:
        eventModify.productModifyRequest?.produceType ||
        eventReads.productResponseForUser?.produceType,
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

    // const eventProductModifyDeadLineRequest: EventDate = {
    //   startLine:
    //     eventModify.eventProductModifyDeadLineRequest.startLine ||
    //     eventReads.eventProductDeadLineResponse.startLine,
    //   deadLine:
    //     eventModify.eventProductModifyDeadLineRequest.deadLine ||
    //     eventReads.eventProductDeadLineResponse.deadLine,
    // };

    // const eventProductModifyPurchaseCountRequest: EventCount = {
    //   targetCount:
    //     eventModify.eventProductModifyPurchaseCountRequest.targetCount ||
    //     eventReads.eventProductPurchaseCountResponse.targetCount,
    // };

    const updateData: EventModify = {
      eventProductId: parseInt(eventProductId || ""),
      productModifyUserTokenAndEventProductIdRequest:
        productModifyUserTokenAndEventProductIdRequest,
      productModifyRequest: productModifyRequest,
      productOptionModifyRequest: productOptionModifyRequest,
      productMainImageModifyRequest: productMainImageModifyRequest,
      // productDetailImagesModifyRequest: ,
      // eventProductModifyDeadLineRequest: eventProductModifyDeadLineRequest,
      // eventProductModifyPurchaseCountRequest: eventProductModifyPurchaseCountRequest,
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
            {/* <EventModifyLimit /> */}
            <EventModifyDescription />
          </Box>
          <Button type="submit">수정완료</Button>
        </form>
      </Container>
    </div>
  );
};

export default EventModifyPage;

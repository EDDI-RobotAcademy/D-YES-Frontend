import { Box, Button, Container } from "@mui/material";
import React, { useEffect } from "react";
import EventDetail from "./components/register/EventDetail";
import EventImage from "./components/register/EventImage";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import useEventStore from "./store/EventStore";
import { useAuth } from "layout/navigation/AuthConText";
import { toast } from "react-toastify";
import { registerEvent } from "./api/EventApi";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { EventProduct } from "./entity/EventProduct";
import EventLimit from "./components/register/EventLimit";
import { EventDate } from "./entity/EventDate";
import { EventCount } from "./entity/EventCount";
import EventDescription from "./components/register/EventDescription";

const EventRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { events } = useEventStore();
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();
  const mutation = useMutation(registerEvent, {
    onSuccess: (data) => {
      queryClient.setQueryData("event", data);
    },
  });

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!events || !events.eventProductRegisterRequest) {
      toast.error("이벤트 정보가 올바르게 설정되지 않았습니다.");
      return;
    }

    if (!events.eventProductRegisterRequest.productDescription) {
      toast.error("상품 설명을 입력하세요.");
      return;
    }

    if (
      !events.eventProductRegisterRequest.optionName ||
      !events.eventProductRegisterRequest.optionPrice ||
      !events.eventProductRegisterRequest.stock ||
      !events.eventProductRegisterRequest.unit
    ) {
      toast.error("옵션 정보를 모두 입력해주세요.");
      return;
    }

    const mainFileToUpload =
      events.eventProductRegisterRequest.mainImg instanceof Blob
        ? (() => {
            const blobWithProperties = events.eventProductRegisterRequest.mainImg as Blob & {
              name: string;
            };
            return new File([events.eventProductRegisterRequest.mainImg], blobWithProperties.name);
          })()
        : null;

    if (!mainFileToUpload) {
      toast.success("메인 이미지를 등록해주세요");
      return;
    }

    const detailImages = events.eventProductRegisterRequest.detailImgs || [];
    if (detailImages.length < 6 || detailImages.length > 10) {
      toast.error("상세 이미지를 최소 6장, 최대 10장 등록해주세요.");
      return;
    }

    if (
      !events.eventProductRegisterDeadLineRequest ||
      !events.eventProductRegisterDeadLineRequest.startLine
    ) {
      toast.error("이벤트 기한을 설정해주세요.");
      return;
    }

    const { startLine, deadLine } = events.eventProductRegisterDeadLineRequest;

    if (!startLine || !deadLine || startLine >= deadLine) {
      toast.error("올바른 이벤트 기한을 설정해주세요.");
      return;
    }

    if (
      !events.eventProductRegisterPurchaseCountRequest ||
      !events.eventProductRegisterPurchaseCountRequest.targetCount
    ) {
      toast.error("최대 참여 인원수를 입력하세요.");
      return;
    }

    const detailImageUpload = events.eventProductRegisterRequest.detailImgs.map(async (image) => {
      if (image instanceof Blob) {
        const blobWithProperties = image as Blob & { name: string };
        const detailFileToUpload = new File([blobWithProperties], blobWithProperties.name);
        return (await uploadFileAwsS3(detailFileToUpload)) || "";
      }
    });

    const s3DetailObjectVersion = await Promise.all(detailImageUpload);

    const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

    const mainImage = mainFileToUpload
      ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
      : "undefined main image";

    const detailImgsName = events.eventProductRegisterRequest.detailImgs.map((image, idx) => {
      if (image instanceof Blob) {
        const blobWithProperties = image as Blob & { name: string };
        return blobWithProperties.name + "?versionId=" + s3DetailObjectVersion[idx];
      }
      return undefined;
    });

    const eventProductRegisterRequest: EventProduct = {
      userToken: localStorage.getItem("userToken") || "",
      productName: events.eventProductRegisterRequest.productName,
      productDescription: events.eventProductRegisterRequest.productDescription,
      cultivationMethod: events.eventProductRegisterRequest.cultivationMethod,
      produceType: events.eventProductRegisterRequest.produceType,
      optionName: events.eventProductRegisterRequest.optionName,
      optionPrice: events.eventProductRegisterRequest.optionPrice,
      stock: events.eventProductRegisterRequest.stock,
      value: events.eventProductRegisterRequest.value,
      unit: events.eventProductRegisterRequest.unit,
      mainImg: mainImage as unknown as File,
      detailImgs: detailImgsName as unknown as File[],
      farmName: events.eventProductRegisterRequest.farmName,
    };

    const eventProductRegisterDeadLineRequest: EventDate = {
      startLine: events.eventProductRegisterDeadLineRequest.startLine,
      deadLine: events.eventProductRegisterDeadLineRequest.deadLine,
    };

    const eventProductRegisterPurchaseCountRequest: EventCount = {
      targetCount: events.eventProductRegisterPurchaseCountRequest.targetCount,
    };

    const data = {
      eventProductRegisterRequest: eventProductRegisterRequest,
      eventProductRegisterDeadLineRequest: eventProductRegisterDeadLineRequest,
      eventProductRegisterPurchaseCountRequest: eventProductRegisterPurchaseCountRequest,
    };

    await mutation.mutateAsync(data);
  };

  return (
    <div className="event-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <h1>이벤트 등록</h1>
            <EventDetail />
            <EventImage />
            <EventLimit />
            <EventDescription />
          </Box>
          <Button type="submit">등록</Button>
        </form>
      </Container>
    </div>
  );
};

export default EventRegisterPage;

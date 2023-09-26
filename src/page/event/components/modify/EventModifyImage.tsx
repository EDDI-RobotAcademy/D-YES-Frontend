import { Box, Container } from "@mui/material";
import { EventDetailImage } from "page/event/entity/EventDetailImage";
import useEventModifyStore from "page/event/store/EventModifyStore";
import useEventReadStore from "page/event/store/EventReadStore";
import ToggleComponent from "page/product/components/productOption/ToggleComponent";
import { useDropzone } from "react-dropzone";
import { getImageUrl } from "utility/s3/awsS3";
import { compressImg } from "utility/s3/imageCompression";

const EventModifyImage = () => {
  const { eventReads, setEventRead } = useEventReadStore();
  const { eventModify, setEventModify } = useEventModifyStore();

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setEventModify({
          ...eventModify,
          productMainImageModifyRequest: {
            ...eventModify.productMainImageModifyRequest,
            mainImg: compressedImage,
          },
        });
        setEventRead({
          ...eventReads,
          mainImageResponseForUser: {
            ...eventReads.mainImageResponseForUser,
            mainImg: compressedImage,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps, getInputProps: mainImageInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
  });

  return (
    <Container maxWidth="md" sx={{ marginTop: "2em" }}>
      <div>
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          <ToggleComponent label="이미지" height={850}>
            <div className="text-field-label">메인 이미지</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "400px",
                backgroundColor: "#e4e4e4",
                cursor: "pointer",
              }}
              {...mainImageRootProps()}
            >
              {eventModify.productMainImageModifyRequest?.mainImg ? (
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={URL.createObjectURL(eventModify.productMainImageModifyRequest.mainImg)}
                    style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                    alt="Selected"
                  />
                  <input {...mainImageInputProps()} />
                </div>
              ) : eventReads.mainImageResponseForUser.mainImg ? (
                <div
                  style={{
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={getImageUrl(eventReads.mainImageResponseForUser.mainImg.toString())}
                    style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
                    alt="Selected"
                  />
                  <input {...mainImageInputProps()} />
                </div>
              ) : (
                <div style={{ textAlign: "center", fontFamily: "SUIT-Light" }}>
                  <img
                    className="upload-icon"
                    alt="이미지 업로드"
                    src="img/upload-icon.png"
                    width={40}
                  />
                  <div>클릭하여 이미지를 추가해주세요</div>
                  <input {...mainImageInputProps()} />
                </div>
              )}
            </div>
          </ToggleComponent>
        </Box>
      </div>
    </Container>
  );
};

export default EventModifyImage;

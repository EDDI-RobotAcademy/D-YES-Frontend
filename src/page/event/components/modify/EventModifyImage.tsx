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

  const onDetailImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const compressedImages = await Promise.all(
          acceptedFiles.map(async (file) => {
            return {
              image: await compressImg(file),
              detailImageId: 0,
            };
          })
        );

        // setEventRead({
        //   ...eventReads,
        //   detailImagesForUser: [
        //     ...compressedImages.map((item) => ({
        //       detailImageId: 0,
        //       detailImgs: item.image,
        //     })),
        //   ],
        // });

        setEventModify({
          ...eventModify,
          productDetailImagesModifyRequest: [
            ...compressedImages.map((item) => ({
              detailImageId: 0,
              detailImgs: item.image,
            })),
          ],
        });

        // console.log("기존이미지", existingDetailImages);
        // console.log("추가이미지", updatedDetailImages);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: detailImageRootProps, getInputProps: detailImageInputProps } = useDropzone({
    onDrop: onDetailImageDrop,
    noClick: false,
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
            <div className="text-field-label">상세 이미지</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "400px",
                backgroundColor: "#e4e4e4",
                cursor: "pointer",
                flexWrap: "wrap",
              }}
              {...detailImageRootProps()}
            >
              <input {...detailImageInputProps()} />
              {eventModify.productDetailImagesModifyRequest &&
              eventModify.productDetailImagesModifyRequest.length > 0
                ? eventModify.productDetailImagesModifyRequest.map((detailImage, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "calc(33.33% - 16px)",
                        height: "auto",
                        margin: "8px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {detailImage && (
                        <img
                          src={
                            typeof detailImage.detailImgs === "string"
                              ? detailImage.detailImgs
                              : URL.createObjectURL(detailImage.detailImgs)
                          }
                          style={{ width: "100%", height: "100%" }}
                          alt={`Selected ${idx}`}
                        />
                      )}
                    </div>
                  ))
                : null}
              {eventReads.detailImagesForUser && eventReads.detailImagesForUser.length > 0
                ? eventReads.detailImagesForUser.map((detailImage, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "calc(33.33% - 16px)",
                        height: "auto",
                        margin: "8px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {detailImage && (
                        <img
                          src={
                            typeof detailImage.detailImgs === "string"
                              ? getImageUrl(detailImage.detailImgs)
                              : URL.createObjectURL(detailImage.detailImgs)
                          }
                          style={{ width: "100%", height: "100%" }}
                          alt={`Selected ${idx}`}
                        />
                      )}
                    </div>
                  ))
                : null}
            </div>
          </ToggleComponent>
        </Box>
      </div>
    </Container>
  );
};

export default EventModifyImage;

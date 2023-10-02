import { Box, Container } from "@mui/material";
import useEventStore from "page/event/store/EventStore";
import ToggleComponent from "page/product/components/productOption/ToggleComponent";
import { useDropzone } from "react-dropzone";
import { compressImg } from "utility/s3/imageCompression";
import RemoveCircleOutlineSharpIcon from "@mui/icons-material/RemoveCircleOutlineSharp";

const EventImage = () => {
  const { events, setEvents } = useEventStore();

  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setEvents({
          ...events,
          eventProductRegisterRequest: {
            ...events.eventProductRegisterRequest,
            mainImg: compressedImage,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onDetailImageDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const compressedImages = await Promise.all(
          acceptedFiles.map(async (file) => {
            return await compressImg(file);
          })
        );
        const updatedImages = [
          ...(events.eventProductRegisterRequest.detailImgs || []),
          ...compressedImages,
        ];
        setEvents({
          ...events,
          eventProductRegisterRequest: {
            ...events.eventProductRegisterRequest,
            detailImgs: updatedImages,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const {
    getRootProps: mainImageRootProps,
    getInputProps: mainImageInputProps,
  } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
  });

  const {
    getRootProps: detailImageRootProps,
    getInputProps: detailImageInputProps,
  } = useDropzone({
    onDrop: onDetailImageDrop,
    maxFiles: 10,
  });

  const handleRemoveDetailImage = (event: React.MouseEvent, index: number) => {
    // 이미지를 삭제할 때 이미지 불러오기 방지
    event.stopPropagation();
    const updatedImages = [...events.eventProductRegisterRequest.detailImgs];
    updatedImages.splice(index, 1);
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        detailImgs: updatedImages,
      },
    });
  };

  return (
    <div className="product-register-image-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="product-register-toggle-component">
          <Box display="flex" flexDirection="column" gap={2} width="100%">
            <ToggleComponent label="이미지" height={1110}>
              <div className="main-image-container">
                <div
                  className="image-text-field-label"
                  style={{ display: "flex" }}
                >
                  메인 이미지*
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "600px",
                    backgroundColor: "#e4e4e4",
                    cursor: "pointer",
                  }}
                  {...mainImageRootProps()}
                >
                  {events.eventProductRegisterRequest &&
                  events.eventProductRegisterRequest.mainImg ? (
                    <img
                      src={URL.createObjectURL(
                        events.eventProductRegisterRequest.mainImg
                      )}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        cursor: "pointer",
                      }}
                      alt="Selected"
                    />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div>상품의 메인 이미지를 추가해주세요.</div>
                      <div>
                        메인 이미지는 사용자에게 가장 처음 보여지는 대표
                        이미지입니다.
                      </div>
                      <input {...mainImageInputProps()} />
                    </div>
                  )}
                </div>
              </div>
              <div className="detail-image-container">
                <div
                  className="image-text-field-label"
                  style={{ display: "flex" }}
                >
                  상세 이미지*
                </div>
                <div
                  className="detail-image-box"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "460px",
                    backgroundColor: "#e4e4e4",
                    cursor: "pointer",
                    flexWrap: "wrap", // 이미지가 4개 이상일 경우 줄바꿈
                  }}
                  {...detailImageRootProps()}
                >
                  {events.eventProductRegisterRequest &&
                  events.eventProductRegisterRequest.detailImgs &&
                  events.eventProductRegisterRequest.detailImgs.length > 0 ? (
                    events.eventProductRegisterRequest.detailImgs.map(
                      (image, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: "calc(18.33% - 16px)",
                            cursor: "pointer",
                            position: "relative",
                            padding: "6px",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              backgroundColor: "yellow",
                              borderRadius: "4px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                paddingBottom: "100%",
                              }}
                            >
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Selected ${idx}`}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  boxSizing: "border-box",
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                          </div>
                          <RemoveCircleOutlineSharpIcon
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              cursor: "pointer",
                              zIndex: 1,
                            }}
                            onClick={(event) =>
                              handleRemoveDetailImage(event, idx)
                            }
                          />
                        </div>
                      )
                    )
                  ) : (
                    <div style={{ textAlign: "center", width: "100%" }}>
                      <div>상품의 상세 이미지를 추가해주세요.</div>
                      <div>
                        상세 이미지는 최소 6장, 최대 10장까지 등록할 수
                        있습니다.
                      </div>
                      <input {...detailImageInputProps()} />
                    </div>
                  )}
                </div>
              </div>
            </ToggleComponent>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default EventImage;

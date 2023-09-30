import { Box, Container } from "@mui/material";
import useEventModifyStore from "page/event/store/EventModifyStore";
import useEventReadStore from "page/event/store/EventReadStore";
import ToggleComponent from "page/product/components/productOption/ToggleComponent";
import TextQuill from "utility/quill/TextQuill";

const EventModifyDescription = () => {
  const { eventReads, setEventRead } = useEventReadStore();
  const { eventModify, setEventModify } = useEventModifyStore();
  const handleProductDescriptionChange = (newDescription: string) => {
    setEventModify({
      ...eventModify,
      productModifyRequest: {
        ...eventModify.productModifyRequest,
        productDescription: newDescription,
      },
    });
    setEventRead({
      ...eventReads,
      productResponseForUser: {
        ...eventReads.productResponseForUser,
        productDescription: newDescription,
      },
    });
  };

  return (
    <div className="product-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <div>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <ToggleComponent label="상세정보" height={500}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={2}
                aria-label="상세정보*"
              >
                <TextQuill
                  name="productDescription"
                  value={
                    eventReads.productResponseForUser?.productDescription
                      ? eventReads.productResponseForUser?.productDescription
                      : eventModify.productModifyRequest.productDescription
                  }
                  setValue={handleProductDescriptionChange}
                  isDisable={false}
                />
              </Box>
            </ToggleComponent>
          </Box>
        </div>
      </Container>
    </div>
  );
};

export default EventModifyDescription;

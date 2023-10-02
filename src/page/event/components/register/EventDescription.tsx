import { Box, Container } from "@mui/material";
import useEventStore from "page/event/store/EventStore";
import ToggleComponent from "page/product/components/productOption/ToggleComponent";
import React from "react";
import TextQuill from "utility/quill/TextQuill";

const EventDescription = () => {
  const { events, setEvents } = useEventStore();

  const handleProductDescriptionChange = (newDescription: string) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        productDescription: newDescription,
      },
    });
  };

  return (
    <div className="product-register-option-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="product-register-toggle-component">
          <Box display="flex" flexDirection="column" gap={2} width="100%">
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
                  value={events.eventProductRegisterRequest?.productDescription}
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
export default EventDescription;

import React, { useState } from "react";
import useEventStore from "../../store/EventStore";
import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ToggleComponent from "page/product/components/productOption/ToggleComponent";
import FarmSearch from "page/product/components/productOption/FarmSearch";
import { Farm } from "page/farm/entity/farm/Farm";

const EventDetail = () => {
  const { events, setEvents } = useEventStore();
  const [selectedFarmName, setSelectedFarmName] = React.useState("");
  const [openFarmSearch, setOpenFarmSearch] = React.useState(false);

  const handleEventProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        productName: event.target.value,
      },
    });
  };

  const handleOptionChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        cultivationMethod: event.target.value.toString(),
      },
    });
  };

  const options = [
    { value: "PESTICIDE_FREE", label: "무농약" },
    { value: "ENVIRONMENT_FRIENDLY", label: "친환경" },
    { value: "ORGANIC", label: "유기농" },
  ];

  const handleOpenFarmSearch = () => {
    setOpenFarmSearch(true);
  };

  const handleFarmSelect = (selectedFarm: Farm) => {
    setSelectedFarmName(selectedFarm.farmName);
    setOpenFarmSearch(false);
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        farmName: selectedFarm.farmName,
      },
    });
  };

  const produceTypesOptions = [
    { value: "POTATO", label: "감자" },
    { value: "SWEET_POTATO", label: "고구마" },
    { value: "CABBAGE", label: "양배추" },
    { value: "KIMCHI_CABBAGE", label: "배추" },
    { value: "LEAF_LETTUCE", label: "상추" },
    { value: "ROMAINE_LETTUCE", label: "로메인 상추" },
    { value: "PEPPER", label: "고추" },
    { value: "GARLIC", label: "마늘" },
    { value: "TOMATO", label: "토마토" },
    { value: "CUCUMBER", label: "오이" },
    { value: "CARROT", label: "당근" },
    { value: "EGGPLANT", label: "가지" },
    { value: "ONION", label: "양파" },
    { value: "YOUNG_PUMPKIN", label: "애호박" },
    { value: "WELSH_ONION", label: "대파" },
  ];

  const handleProduceTypesChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        produceType: event.target.value.toString(),
      },
    });
  };

  const handleOptionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        optionName: event.target.value,
      },
    });
  };

  const handleOptionPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        optionPrice: parseInt(event.target.value),
      },
    });
  };

  const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        stock: parseInt(event.target.value),
      },
    });
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        value: parseInt(event.target.value),
      },
    });
  };

  const handleUnitChange = (event: SelectChangeEvent<{ value: string; label: string }>) => {
    setEvents({
      ...events,
      eventProductRegisterRequest: {
        ...events.eventProductRegisterRequest,
        unit: event.target.value.toString(),
      },
    });
  };

  const unitOptions = [
    { value: "KG", label: "KG" },
    { value: "G", label: "G" },
    { value: "EA", label: "EA" },
  ];

  return (
    <div className="event-register-container">
      <Container maxWidth="md" sx={{ marginTop: "2em", display: "flex" }}>
        <div>
          <ToggleComponent label="기본정보" height={350}>
            <Box display="flex" flexDirection="column" gap={2}>
              <div className="text-field-container">
                <div className="text-field-label" aria-label="상품명*">
                  상품명*
                </div>
                <TextField
                  name="productName"
                  className="text-field-input"
                  size="small"
                  value={events.eventProductRegisterRequest?.productName}
                  onChange={handleEventProductNameChange}
                />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">재배방식*</div>
                <FormControl
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Select
                    name="cultivationMethod"
                    value={
                      (events.eventProductRegisterRequest?.cultivationMethod as
                        | ""
                        | { value: string; label: string }) || ""
                    }
                    onChange={handleOptionChange}
                    className="text-field"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <MenuItem value="">옵션을 선택해주세요</MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="text-field-container">
                <div className="text-field-label">농가 이름*</div>
                <TextField
                  name="farmName"
                  className="text-field-input"
                  size="small"
                  value={events.eventProductRegisterRequest?.farmName}
                  onChange={(event) => {
                    setSelectedFarmName(event.target.value);
                  }}
                />
                <Button onClick={handleOpenFarmSearch}>조회</Button>
                <FarmSearch
                  open={openFarmSearch}
                  onClose={() => setOpenFarmSearch(false)}
                  selectedFarmName={selectedFarmName}
                  onSelectFarm={handleFarmSelect}
                />
              </div>
              <div className="text-field-container">
                <div className="text-field-label">농산물*</div>
                <FormControl
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Select
                    name="produceType"
                    value={
                      (events.eventProductRegisterRequest?.produceType as
                        | ""
                        | { value: string; label: string }) || ""
                    }
                    onChange={handleProduceTypesChange}
                    className="text-field"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <MenuItem value="">판매상품을 선택해주세요</MenuItem>
                    {produceTypesOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <TableContainer component={Paper}>
                <table>
                  <TableHead style={{ backgroundColor: "#D0D0D0" }}>
                    <TableRow>
                      <TableCell className="cell" style={{ width: "30%", textAlign: "center" }}>
                        옵션명
                      </TableCell>
                      <TableCell className="cell" style={{ width: "25%", textAlign: "center" }}>
                        가격
                      </TableCell>
                      <TableCell className="cell" style={{ width: "15%", textAlign: "center" }}>
                        재고
                      </TableCell>
                      <TableCell className="cell" style={{ textAlign: "center" }}>
                        단위
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          name="optionName"
                          size="small"
                          value={events.eventProductRegisterRequest?.optionName}
                          fullWidth
                          onChange={handleOptionNameChange}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="optionPrice"
                          size="small"
                          value={events.eventProductRegisterRequest?.optionPrice}
                          fullWidth
                          onChange={handleOptionPriceChange}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="stock"
                          size="small"
                          value={events.eventProductRegisterRequest?.stock}
                          fullWidth
                          onChange={handleStockChange}
                        />
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            name="value"
                            size="small"
                            value={events.eventProductRegisterRequest?.value}
                            fullWidth
                            onChange={handleValueChange}
                          />
                          <Select
                            name="unit"
                            size="small"
                            value={
                              (events.eventProductRegisterRequest?.unit as
                                | ""
                                | { value: string; label: string }) || ""
                            }
                            onChange={handleUnitChange}
                            sx={{ minWidth: "70px" }}
                          >
                            {unitOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </table>
              </TableContainer>
            </Box>
          </ToggleComponent>
        </div>
      </Container>
    </div>
  );
};

export default EventDetail;

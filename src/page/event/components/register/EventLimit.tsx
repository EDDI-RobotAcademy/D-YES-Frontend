import {
  Box,
  Container,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import useEventStore from "page/event/store/EventStore";
import ToggleComponent from "page/product/components/productOption/ToggleComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ko";
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Asia/Seoul");

const EventLimit = () => {
  const { events, setEvents } = useEventStore();

  const handleEventTargetCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEvents({
      ...events,
      eventProductRegisterPurchaseCountRequest: {
        ...events.eventProductRegisterPurchaseCountRequest,
        targetCount: parseInt(event.target.value),
      },
    });
  };

  return (
    <div className="product-register-option-container">
      <Container maxWidth="xl" sx={{ marginTop: "2em", display: "flex" }}>
        <div className="event-register-toggle-component">
          <ToggleComponent label="이벤트 기한" height={150}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "none", width: "100%" }}
              >
                <table
                  style={{
                    borderCollapse: "collapse",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <TableHead style={{ backgroundColor: "#F8F9FA" }}>
                    <TableRow>
                      <TableCell
                        className="cell"
                        style={{ width: "40%", textAlign: "center" }}
                      >
                        시작일자
                      </TableCell>
                      <TableCell
                        className="cell"
                        style={{ width: "40%", textAlign: "center" }}
                      >
                        마감일자
                      </TableCell>
                      <TableCell
                        className="cell"
                        style={{ width: "20%", textAlign: "center" }}
                      >
                        최대 참여 인원수
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{
                          padding: "8px 16px",
                          textAlign: "center",
                          fontFamily: "SUIT-Light",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: "100%" }}
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              adapterLocale="ko"
                            >
                              <DatePicker
                                className="event-date-picker"
                                value={
                                  events.eventProductRegisterDeadLineRequest
                                    ?.startLine || dayjs()
                                }
                                onChange={(date) => {
                                  if (date !== null) {
                                    setEvents({
                                      ...events,
                                      eventProductRegisterDeadLineRequest: {
                                        ...(events.eventProductRegisterDeadLineRequest ||
                                          {}),
                                        startLine: date,
                                      },
                                    });
                                  }
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          padding: "8px 16px",
                          textAlign: "center",
                          fontFamily: "SUIT-Light",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: "100%" }}
                          >
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              adapterLocale="ko"
                            >
                              <DatePicker
                                className="event-date-picker"
                                value={
                                  events.eventProductRegisterDeadLineRequest
                                    ?.deadLine || dayjs()
                                }
                                onChange={(date) => {
                                  if (date !== null) {
                                    setEvents({
                                      ...events,
                                      eventProductRegisterDeadLineRequest: {
                                        ...(events.eventProductRegisterDeadLineRequest ||
                                          {}),
                                        deadLine: date,
                                      },
                                    });
                                  }
                                }}
                              />
                            </LocalizationProvider>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="targetCount"
                          size="small"
                          value={
                            events.eventProductRegisterPurchaseCountRequest
                              ?.targetCount
                          }
                          fullWidth
                          onChange={handleEventTargetCountChange}
                        />
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

export default EventLimit;

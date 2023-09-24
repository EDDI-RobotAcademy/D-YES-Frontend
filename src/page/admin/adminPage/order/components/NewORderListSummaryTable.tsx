import React from "react";
import {
  TableContainer,
  Table,
  Paper,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import "../css/NewOrderListSummaryTable.css";
import { NewOrderSummaryInfo } from "page/order/entity/NewOrderSummaryInfo";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface ChartFormProps {
  orderList: NewOrderSummaryInfo[];
}

const NewOrderListSummaryTable: React.FC<ChartFormProps> = ({ orderList }) => {
  return (
    <div className="order-info-container">
      <div className="new-order-list">
        <h3>Recent Orders</h3>
        <div className="order-table">
          <TableContainer
            component={Paper}
            style={{ width: "100%", fontSize: "8px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ fontSize: "14px", width: "10%" }}>
                    번호
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontSize: "14px", width: "30%" }}
                    align="center"
                  >
                    상품명
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontSize: "14px", width: "20%" }}
                    align="center"
                  >
                    결제상태
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontSize: "14px", width: "20%" }}
                    align="center"
                  >
                    주문금액
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontSize: "14px", width: "20%" }}
                    align="center"
                  >
                    등록일자
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList.map((row) => (
                  <StyledTableRow key={row.productOrderId}>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      component="th"
                      scope="row"
                    >
                      {row.productOrderId}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      align="center"
                    >
                      {row.productName}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      align="center"
                    >
                      <Chip
                        label={
                          row.orderStatus === "SUCCESS_PAYMENT"
                            ? "PAID"
                            : "REFUND"
                        }
                        color={
                          row.orderStatus === "SUCCESS_PAYMENT"
                            ? "success"
                            : "error"
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      align="center"
                    >
                      {row.totalAmount}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      align="center"
                    >
                      {row.orderedTime.toString()}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default NewOrderListSummaryTable;

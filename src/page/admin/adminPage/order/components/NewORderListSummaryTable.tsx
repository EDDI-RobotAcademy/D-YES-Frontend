import React, { useState } from "react";
import {
  TableContainer,
  Table,
  Paper,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Chip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import "../css/NewOrderListSummaryTable.css";
import { NewOrderSummaryInfo } from "page/order/entity/NewOrderSummaryInfo";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: 0,
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

const ITEMS_PER_PAGE = 5;

const NewOrderListSummaryTable: React.FC<ChartFormProps> = ({ orderList }) => {
  const [page, setPage] = useState(1);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const displayData = orderList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  return (
    <div className="order-info-container">
      <div className="new-order-list">
        <h4>신규 주문 목록</h4>
        <div className="order-table-container">
          <TableContainer
            className="order-table"
            component={Paper}
            style={{ width: "100%", fontSize: "8px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    className="order-cell-style"
                    style={{
                      width: "10%",
                    }}
                  >
                    번호
                  </StyledTableCell>
                  <StyledTableCell
                    className="order-cell-style"
                    style={{
                      width: "30%",
                    }}
                    align="center"
                  >
                    상품명
                  </StyledTableCell>
                  <StyledTableCell
                    className="order-cell-style"
                    style={{
                      width: "20%",
                    }}
                    align="center"
                  >
                    결제상태
                  </StyledTableCell>
                  <StyledTableCell
                    className="order-cell-style"
                    style={{
                      width: "20%",
                    }}
                    align="center"
                  >
                    주문금액
                  </StyledTableCell>
                  <StyledTableCell
                    className="order-cell-style"
                    style={{
                      width: "20%",
                    }}
                    align="center"
                  >
                    등록일자
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayData.map((row) => (
                  <StyledTableRow key={row.productOrderId}>
                    <StyledTableCell className="order-cell-body-style" component="th" scope="row">
                      {row.productOrderId}
                    </StyledTableCell>
                    <StyledTableCell className="order-cell-body-style" align="center">
                      {row.productName}
                    </StyledTableCell>
                    <StyledTableCell className="order-cell-body-style" align="center">
                      <Chip
                        size="small"
                        label={row.orderStatus === "SUCCESS_PAYMENT" ? "PAID" : "REFUND"}
                        color={row.orderStatus === "SUCCESS_PAYMENT" ? "success" : "error"}
                      />
                    </StyledTableCell>
                    <StyledTableCell className="order-cell-body-style" align="center">
                      {row.totalAmount}
                    </StyledTableCell>
                    <StyledTableCell className="order-cell-body-style" align="center">
                      {row.orderedTime.toString()}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="pagination">
            <IconButton onClick={() => handleChangePage(page - 1)} disabled={page === 1}>
              <NavigateBeforeIcon />
            </IconButton>
            <span>
              Page {page} of {Math.ceil(orderList.length / ITEMS_PER_PAGE)}
            </span>
            <IconButton
              onClick={() => handleChangePage(page + 1)}
              disabled={page === Math.ceil(orderList.length / ITEMS_PER_PAGE)}
            >
              <NavigateNextIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderListSummaryTable;

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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { NewProductSummaryInfo } from "page/product/entity/NewProductSummaryInfo";
import "../css/NewProductListSummaryTable.css";

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
  productList: NewProductSummaryInfo[];
}

const ITEMS_PER_PAGE = 5;

const NewProductListSummaryTable: React.FC<ChartFormProps> = ({ productList }) => {
  const [page, setPage] = useState(1);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const displayData = productList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="product-info-container">
      <div className="new-product-list">
        <h4>신규 등록 상품</h4>
        <div className="product-table">
          <TableContainer
            className="product-table"
            component={Paper}
            style={{ width: "100%", fontSize: "8px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    className="product-cell-style"
                    style={{
                      width: "10%",
                    }}
                  >
                    번호
                  </StyledTableCell>
                  <StyledTableCell
                    className="product-cell-style"
                    style={{
                      width: "30%",
                    }}
                    align="center"
                  >
                    상품명
                  </StyledTableCell>
                  <StyledTableCell
                    className="product-cell-style"
                    style={{
                      width: "20%",
                    }}
                    align="center"
                  >
                    판매상태
                  </StyledTableCell>
                  <StyledTableCell
                    className="product-cell-style"
                    style={{
                      width: "20%",
                    }}
                    align="center"
                  >
                    농가
                  </StyledTableCell>
                  <StyledTableCell
                    className="product-cell-style"
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
                  <StyledTableRow key={row.productId}>
                    <StyledTableCell className="product-cell-body-style" component="th" scope="row">
                      {row.productId}
                    </StyledTableCell>
                    <StyledTableCell className="product-cell-body-style" align="center">
                      {row.productName}
                    </StyledTableCell>
                    <StyledTableCell className="product-cell-body-style" align="center">
                      <Chip
                        size="small"
                        label={row.productSaleStatus === "AVAILABLE" ? "SALE" : "STOP"}
                        color={row.productSaleStatus === "AVAILABLE" ? "success" : "error"}
                      />
                    </StyledTableCell>
                    <StyledTableCell className="product-cell-body-style" align="center">
                      {row.farmName}
                    </StyledTableCell>
                    <StyledTableCell className="product-cell-body-style" align="center">
                      {row.registrationDate.toString()}
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
              Page {page} of {Math.ceil(productList.length / ITEMS_PER_PAGE)}
            </span>
            <IconButton
              onClick={() => handleChangePage(page + 1)}
              disabled={page === Math.ceil(productList.length / ITEMS_PER_PAGE)}
            >
              <NavigateNextIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductListSummaryTable;

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
import { NewProductSummaryInfo } from "page/product/entity/NewProductSummaryInfo";
import "../css/NewProductListSummaryTable.css";

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
  productList: NewProductSummaryInfo[];
}

const NewProductListSummaryTable: React.FC<ChartFormProps> = ({
  productList,
}) => {
  return (
    <div className="product-info-container">
      <div className="new-product-list">
        <h3>Recent Products</h3>
        <div className="product-table">
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
                    판매상태
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ fontSize: "14px", width: "20%" }}
                    align="center"
                  >
                    농가
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
                {productList.map((row) => (
                  <StyledTableRow key={row.productId}>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      component="th"
                      scope="row"
                    >
                      {row.productId}
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
                          row.productSaleStatus === "AVAILABLE"
                            ? "SALE"
                            : "STOP"
                        }
                        color={
                          row.productSaleStatus === "AVAILABLE"
                            ? "success"
                            : "error"
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      align="center"
                    >
                      {row.farmName}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ fontSize: "14px" }}
                      align="center"
                    >
                      {row.registrationDate.toString()}
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

export default NewProductListSummaryTable;

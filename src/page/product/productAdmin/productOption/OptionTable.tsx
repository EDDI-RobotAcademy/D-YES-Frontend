import React from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../css/ProductPage.css";
import { useOptions } from "page/product/entity/useOptions";

interface OptionTableProps {
  optionRows: useOptions[];
  onChangeOption: (index: number, updatedOption: useOptions) => void;
  onDeleteOption: (index: number) => void;
  isEditMode: boolean;
}

const OptionTable: React.FC<OptionTableProps> = ({
  optionRows,
  onChangeOption,
  onDeleteOption,
  isEditMode,
}) => {
  const unitOption = [
    { value: "KG", label: "KG" },
    { value: "G", label: "G" },
    { value: "EA", label: "EA" },
  ];

  const saleStatus = [
    { value: "AVAILABLE", label: "판매중" },
    { value: "UNAVAILABLE", label: "판매중지" },
  ];

  // 기본적으로 하나의 빈 옵션을 추가하여 시작
  if (optionRows.length === 0) {
    optionRows.push({
      optionId: 0,
      optionName: "",
      optionPrice: 0,
      stock: 0,
      value: 0,
      unit: "",
      optionSaleStatus: "",
    });
  }

  return (
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
            {isEditMode && (
            <TableCell className="cell" style={{ textAlign: "center" }}>
              옵션 판매여부
            </TableCell>
            )}
            <TableCell style={{ textAlign: "center" }}>삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {optionRows.map((option, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  name="optionName"
                  size="small"
                  value={option.optionName}
                  fullWidth
                  onChange={(event) => {
                    const updatedOption = { ...option, optionName: event.target.value };
                    onChangeOption(index, updatedOption);
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="optionPrice"
                  size="small"
                  value={option.optionPrice || 0}
                  fullWidth
                  onChange={(event) => {
                    const updatedOption = { ...option, optionPrice: parseInt(event.target.value) };
                    onChangeOption(index, updatedOption);
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="stock"
                  size="small"
                  value={option.stock || 0}
                  fullWidth
                  onChange={(event) => {
                    const updatedOption = { ...option, stock: parseInt(event.target.value) };
                    onChangeOption(index, updatedOption);
                  }}
                />
              </TableCell>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    name="value"
                    size="small"
                    value={option.value || 0}
                    fullWidth
                    onChange={(event) => {
                      const updatedOption = { ...option, value: parseInt(event.target.value) };
                      onChangeOption(index, updatedOption);
                    }}
                  />
                  <Select
                    name="unit"
                    size="small"
                    value={option.unit}
                    onChange={(event) => {
                      const updatedOption = { ...option, unit: event.target.value };
                      onChangeOption(index, updatedOption);
                    }}
                    sx={{ minWidth: "70px" }}
                  >
                    {unitOption.map((unit, unitIndex) => (
                      <MenuItem key={unitIndex} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </TableCell>
              {isEditMode && (
                <TableCell>
                  <Select
                    name="optionSaleStatus"
                    size="small"
                    value={option.optionSaleStatus}
                    onChange={(event) => {
                      const updatedOption = { ...option, optionSaleStatus: event.target.value };
                      onChangeOption(index, updatedOption);
                    }}
                    sx={{ minWidth: "100px" }}
                  >
                    {saleStatus.map((status, statusIndex) => (
                      <MenuItem key={statusIndex} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              )}
              <TableCell>
                <IconButton
                  onClick={() => onDeleteOption(index)}
                  color="default"
                  aria-label="delete option"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </TableContainer>
  );
};

export default OptionTable;

import React from 'react';
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
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/ProductPage.css';
import { useOptions } from 'page/product/entity/useOptions';

interface OptionTableProps {
  optionRows: useOptions[];
  onChangeOption: (index: number, updatedOption: useOptions) => void;
  onDeleteOption: (index: number) => void;
}

const OptionTable: React.FC<OptionTableProps> = ({ optionRows, onChangeOption, onDeleteOption }) => {

  const unitOption = [
    { value: 'KG', label: 'KG' },
    { value: 'G', label: 'G' },
    { value: 'EA', label: 'EA' }
  ];

  // 기본적으로 하나의 빈 옵션을 추가하여 시작
  if (optionRows.length === 0) {
    optionRows.push({
      optionName: '',
      optionPrice: '',
      stock: '',
      value: '',
      unit: ''
    });
  }

  return (
    <TableContainer component={Paper}>
      <table>
        <TableHead style={{ backgroundColor: '#D0D0D0' }}>
          <TableRow>
            <TableCell className="cell" style={{ width: '40%', textAlign: 'center' }}>옵션명</TableCell>
            <TableCell className="cell" style={{ width: '25%', textAlign: 'center' }}>가격</TableCell>
            <TableCell className="cell" style={{ width: '15%', textAlign: 'center' }}>재고</TableCell>
            <TableCell className="cell" style={{ textAlign: 'center' }}>단위</TableCell>
            <TableCell style={{ textAlign: 'center' }}>삭제</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {optionRows.map((option, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  name="optionName"
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
                  value={option.optionPrice}
                  fullWidth
                  onChange={(event) => {
                    const updatedOption = { ...option, optionPrice: event.target.value };
                    onChangeOption(index, updatedOption);
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="stock"
                  value={option.stock}
                  fullWidth
                  onChange={(event) => {
                    const updatedOption = { ...option, stock: event.target.value };
                    onChangeOption(index, updatedOption);
                  }}
                />
              </TableCell>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  name="amount"
                  value={option.value}
                  fullWidth
                  onChange={(event) => {
                    const updatedOption = { ...option, amount: event.target.value };
                    onChangeOption(index, updatedOption);
                  }}
                />
                  <Select
                    name="unit"
                    value={option.unit}
                    onChange={(event) => {
                      const updatedOption = { ...option, unit: event.target.value };
                      onChangeOption(index, updatedOption);
                    }}
                  >
                    {unitOption.map((unit, unitIndex) => (
                      <MenuItem key={unitIndex} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </TableCell>
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

import { getFarmList } from "page/admin/api/AdminApi";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Farm } from "page/farm/entity/farm/Farm";

interface FarmSearchProps {
  open: boolean;
  onClose: () => void;
  onSelectFarm: (selectedFarm: Farm) => void;
  selectedFarmName: string
}

const FarmSearch: React.FC<FarmSearchProps> = ({ open, onClose, onSelectFarm }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [farmList, setFarmList] = useState<Farm[]>([]);
  const [filteredFarmList, setFilteredFarmList] = useState<Farm[]>([]);

  useEffect(() => {
    fetchFarmList();
  }, []);

  useEffect(() => {
    const filteredFarms = farmList.filter((farm) =>
      farm.farmName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("확인", filteredFarms);

    setFilteredFarmList(filteredFarms);
  }, [searchQuery, farmList]);

  const handleFarmSelect = (selectedFarm: Farm) => {
    onSelectFarm(selectedFarm);
    onClose();
  };

  const fetchFarmList = async () => {
    try {
      const fetchedFarmList = await getFarmList();
      setFarmList(fetchedFarmList);
    } catch (error) {
      console.error("농가 목록 불러오기 실패:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent style={{ width: "500px" }}>
        <TextField
          label="농가 이름 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">농가 이름</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFarmList.map((farm) => (
                <TableRow
                  key={farm.farmId}
                  onClick={() => handleFarmSelect(farm)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell align="center">{farm.farmId}</TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {farm.farmName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FarmSearch;
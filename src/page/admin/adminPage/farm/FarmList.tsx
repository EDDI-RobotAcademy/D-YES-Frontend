import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import { deleteFarm, fetchFarm, getFarmList } from "page/admin/api/AdminApi";
import { useQueryClient } from "react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { fetchProductList } from "page/product/api/ProductApi";
import { Farm } from "page/farm/entity/farm/Farm";
import { FarmInfoRead } from "page/farm/entity/farm/FarmInfoRead";
import { FarmBusinessRead } from "page/farm/entity/farm/FarmBusinessRead";
import useFarmReadStore from "page/farm/store/FarmReadStore";
import useFarmBusinessReadStore from "page/farm/store/FarmBusinessReadWtore";

const FarmList = () => {
  const [farmList, setFarmList] = useState([] as Farm[]);
  const queryClient = useQueryClient();
  const { setFarmRead } = useFarmReadStore();
  const { setBusinessRead } = useFarmBusinessReadStore();

  useEffect(() => {
    fetchFarmList();
  }, []);

  const fetchFarmList = async () => {
    try {
      const fetchedFarmList = await getFarmList();
      setFarmList(fetchedFarmList);
    } catch (error) {
      console.error("농가 리스트 불러오기 실패:", error);
    }
  };

  const handleDeleteClick = async (farmId: string) => {
    try {
      const farmList = await getFarmList();
      const farm = farmList.find((farm: Farm) => farm.farmId.toString() === farmId);

      if (farm) {
        const products = await fetchProductList();
        const hasRelatedProducts = products.some((product) => product.farmName === farm.farmName);

        if (hasRelatedProducts) {
          Swal.fire("경고", "농가에 등록된 상품이 있으므로 삭제할 수 없습니다.", "warning");
        } else {
          const result = await Swal.fire({
            title: "삭제하시겠습니까?",
            text: "삭제하면 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "예, 삭제합니다",
          });

          if (result.isConfirmed) {
            await deleteFarm(farmId);
            queryClient.invalidateQueries("farmList");
            await fetchFarmList();

            Swal.fire("삭제되었습니다!", "항목이 삭제되었습니다.", "success");
          }
        }
      } else {
        Swal.fire("오류!", "해당 농가를 찾을 수 없습니다.", "error");
      }
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
      Swal.fire("오류!", "데이터를 불러오는 중 오류가 발생했습니다.", "error");
    }
  };

  const handleFarmClick = async (farmId: string) => {
    try {
      const farmInfo = await fetchFarm(farmId);
      if (farmInfo !== null) {
        setFarmRead(farmInfo.farmInfoResponseForAdmin as unknown as FarmInfoRead);
        setBusinessRead(farmInfo.farmOperationInfoResponseForAdmin as FarmBusinessRead);
      } else {
        console.error("농가 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("농가 정보를 가져오는 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <div className="list-menu">
        <img className="farm-list-icon" alt="농가 목록" src="img/farm-list-icon.png" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            gutterBottom
            style={{
              fontSize: "16px",
              fontFamily: "SUIT-Medium",
              color: "#252525",
              marginBottom: "0px",
            }}
          >
            등록된 농가 목록
          </Typography>
          <Typography
            gutterBottom
            sx={{
              fontSize: "12px",
              fontFamily: "SUIT-Regular",
              color: "#252525",
            }}
          >
            * 등록되어 있는 농가 목록을 확인해주세요
          </Typography>
        </div>
      </div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        minHeight="158.8vh"
        paddingTop="32px"
        paddingBottom="20px"
        bgcolor="white"
        overflow="hidden" // 가로 스크롤 숨김
        border="solid 1px lightgray"
      >
        <Box flex="0"></Box>
        <Box bgcolor="white" flex="10" flexDirection="column" alignItems="center">
          <button
            onClick={fetchFarmList}
            style={{
              backgroundColor: "#4F72CA",
              border: "none",
              color: "white",
              padding: "6px 398px",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "2px",
              fontFamily: "SUIT-Light",
            }}
          >
            농가 목록 불러오기
          </button>
          <TableContainer
            component={Paper}
            style={{ width: "900px", borderRadius: "0px", fontFamily: "SUIT-ExtraBold" }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                textAlign: "center",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      width: "50px",
                      padding: "18px 16px",
                      textAlign: "center",
                      color: "#252525",
                      fontFamily: "SUIT-Medium",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    style={{
                      width: "300px",
                      padding: "8px 16px",
                      textAlign: "center",
                      color: "#252525",
                      fontFamily: "SUIT-Medium",
                    }}
                  >
                    농가 이름
                  </TableCell>
                  <TableCell
                    style={{
                      width: "500px",
                      padding: "8px 16px",
                      textAlign: "center",
                      color: "#252525",
                      fontFamily: "SUIT-Medium",
                    }}
                  >
                    농가 주소
                  </TableCell>
                  <TableCell
                    style={{
                      width: "50px",
                      padding: "18px 16px",
                      textAlign: "center",
                      color: "#252525",
                      fontFamily: "SUIT-Medium",
                    }}
                  >
                    삭제
                  </TableCell>
                </TableRow>
              </TableHead>
              <tbody>
                {farmList.map((farm) => (
                  <TableRow
                    key={farm.farmId}
                    onClick={() => handleFarmClick(farm.farmId.toString())}
                  >
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {farm.farmId}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {farm.farmName}
                    </TableCell>
                    <TableCell
                      style={{ padding: "8px 16px", textAlign: "center", fontFamily: "SUIT-Light" }}
                    >
                      {farm.farmAddress.address} {farm.farmAddress.addressDetail} (
                      {farm.farmAddress.zipCode})
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "8px 16px",
                        textAlign: "center",
                        fontFamily: "SUIT-Light",
                      }}
                    >
                      <IconButton
                        onClick={() => handleDeleteClick(farm.farmId.toString())}
                        color="default"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
};

export default FarmList;

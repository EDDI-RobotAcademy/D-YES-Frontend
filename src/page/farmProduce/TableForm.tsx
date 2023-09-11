import React, { useEffect, useState } from "react";
import { won } from "utility/filters/wonFilter";
import { FarmProducePriceList } from "entity/farmProduce/FarmProducePriceList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import "./css/TableForm.css";

interface TableFormProps {
  priceList: FarmProducePriceList[];
}

const TableForm: React.FC<TableFormProps> = ({ priceList }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  const transformedData: {
    [date: string]: { [farmProduceName: string]: number };
  } = {};

  const translateKorean: { [key: string]: string } = {
    cabbage: "양배추",
    carrot: "당근",
    cucumber: "오이",
    kimchiCabbage: "배추",
    onion: "양파",
    potato: "감자",
    welshOnion: "대파",
    youngPumpkin: "애호박",
  };

  priceList.forEach((product) => {
    product.priceList.forEach((priceData) => {
      for (const date in priceData) {
        if (!transformedData[date]) {
          transformedData[date] = {};
        }
        transformedData[date][product.farmProduceName] = priceData[date];
      }
    });
  });

  const priceTable = () => {
    const dateList = Object.keys(transformedData);
    const farmProduceNameList = Object.keys(transformedData[dateList[0]]);

    return (
      <div className="table-form">
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#252525" }}>
              <TableRow>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  농산물
                </TableCell>
                {dateList.map((date) => (
                  <TableCell
                    key={date}
                    style={{ color: "white", textAlign: "center" }}
                  >
                    {date.split("-").slice(1).join("/")}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {farmProduceNameList.map((farmProduceName) => (
                <TableRow key={farmProduceName}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ textAlign: "center" }}
                  >
                    {translateKorean[farmProduceName]}
                  </TableCell>
                  {dateList.map((date) => (
                    <TableCell key={date} style={{ textAlign: "right" }}>
                      {won(transformedData[date][farmProduceName])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return <div>{loading ? <p>Loading...</p> : priceTable()}</div>;
};

export default TableForm;

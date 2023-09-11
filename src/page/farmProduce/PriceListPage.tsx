import React, { useEffect, useState } from "react";
import { FarmProducePriceList } from "entity/farmProduce/FarmProducePriceList";
import { getFarmProducePriceList } from "./api/FarmProduceApi";
import { Switch, FormControlLabel } from "@mui/material";
import LineChart from "./LineChart";
import TableForm from "./TableForm";

import "./css/PriceListPage.css";

const PriceListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadedProducts, setLoadedProducts] = useState<FarmProducePriceList[]>(
    []
  );

  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getFarmProducePriceList();
        setLoadedProducts(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  const handleSwitchChange = () => {
    setShowTable(!showTable);
  };

  return (
    <div className="farm-produce-price-container">
      <h1>오늘부터 2주 후까지 예측된 가격을 확인해보세요</h1>
      <div className="switch-container">
        <FormControlLabel
          control={
            <Switch
              checked={showTable}
              onChange={handleSwitchChange}
              color="warning"
            />
          }
          label={showTable ? "테이블로 확인하기" : "차트로 확인하기"}
        />
      </div>
      {showTable ? (
        <div className="table-container">
          {!loading && <TableForm priceList={loadedProducts} />}
        </div>
      ) : (
        <div className="chart-container">
          {!loading && <LineChart priceList={loadedProducts} />}
        </div>
      )}
    </div>
  );
};

export default PriceListPage;

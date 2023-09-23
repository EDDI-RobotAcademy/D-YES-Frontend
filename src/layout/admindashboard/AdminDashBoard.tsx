import React from "react";
import "./css/AdminDashBoard.css";
import { useEffect, useState } from "react";
import NewProductListSummaryTable from "../../page/admin/adminPage/product/components/NewProductListSummaryTable";
import NewProductListSummaryChart from "../../page/admin/adminPage/product/components/NewProductListSummaryChart";
import { fetchNewProductList } from "../../page/product/api/ProductApi";
import { NewProductManagemantInfo } from "page/product/entity/NewProductManagemantInfo";
import { NewProductSummaryInfo } from "page/product/entity/NewProductSummaryInfo";

const AdminDashBoard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadedProductsInfo, setLoadedProductsInfo] =
    useState<NewProductSummaryInfo[]>();
  const [loadedProductsManagementInfo, setLoadedProductsManagementInfo] =
    useState<NewProductManagemantInfo[]>();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchNewProductList();
        setLoadedProductsInfo(response.productInfoResponseForAdminList);
        setLoadedProductsManagementInfo(response.registeredProductCountList);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="admin-bash-board-container">
      <div className="new-product-info-container">
        {!loading && (
          <NewProductListSummaryTable productList={loadedProductsInfo || []} />
        )}
        {!loading && (
          <NewProductListSummaryChart
            productDataList={loadedProductsManagementInfo || []}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashBoard;

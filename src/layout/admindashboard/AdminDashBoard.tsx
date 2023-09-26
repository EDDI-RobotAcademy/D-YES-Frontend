import React from "react";
import "./css/AdminDashBoard.css";
import { useEffect, useState } from "react";
import NewProductListSummaryTable from "../../page/admin/adminPage/product/components/NewProductListSummaryTable";
import NewProductListSummaryChart from "../../page/admin/adminPage/product/components/NewProductListSummaryChart";
import { fetchNewProductList } from "../../page/product/api/ProductApi";
import { NewProductManagemantInfo } from "page/product/entity/NewProductManagemantInfo";
import { NewProductSummaryInfo } from "page/product/entity/NewProductSummaryInfo";
import { NewOrderSummaryInfo } from "page/order/entity/NewOrderSummaryInfo";
import { fetchNewOrderList } from "page/order/api/OrderApi";
import { NewOrderManagemantInfo } from "page/order/entity/NewOrderManagemantInfo";
import NewOrderListSummaryTable from "page/admin/adminPage/order/components/NewOrderListSummaryTable";
import NewOrderListSummaryChart from "page/admin/adminPage/order/components/NewOrderListSummaryChart";
import AdminStatisticsList from "./AdminStatisticsList";

const AdminDashBoard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadedProductsInfo, setLoadedProductsInfo] = useState<NewProductSummaryInfo[]>();
  const [loadedProductsManagementInfo, setLoadedProductsManagementInfo] =
    useState<NewProductManagemantInfo[]>();
  const [loadedOrdersInfo, setLoadedOrdersInfo] = useState<NewOrderSummaryInfo[]>();
  const [loadedOrdersManagementInfo, setLoadedOrdersManagementInfo] =
    useState<NewOrderManagemantInfo[]>();

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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchNewOrderList();
        setLoadedOrdersInfo(response.orderInfoResponseForAdminList);
        setLoadedOrdersManagementInfo(response.createdOrderCountList);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="admin-bash-board-container">
      <div className="statistics-info-container">
        <AdminStatisticsList />
      </div>
      <div className="new-product-info-container">
        {!loading && <NewProductListSummaryTable productList={loadedProductsInfo || []} />}
        {!loading && (
          <NewProductListSummaryChart productDataList={loadedProductsManagementInfo || []} />
        )}
      </div>
      <div className="new-order-info-container">
        {!loading && <NewOrderListSummaryTable orderList={loadedOrdersInfo || []} />}
        {!loading && <NewOrderListSummaryChart orderDataList={loadedOrdersManagementInfo || []} />}
      </div>
    </div>
  );
};

export default AdminDashBoard;

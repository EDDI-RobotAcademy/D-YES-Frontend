import { Outlet } from "react-router-dom";

import Footer from "layout/footer/Footer";
import Header from "layout/navigation/Header";
import Header2nd from "layout/navigation/Header2nd";
import Sidemenu from "layout/sidemenu/Sidemenu";
import AdminHeader from "layout/navigation/AdminHeader";
import "./layout/css/AdminLayout.css";

export function UserLayout() {
  return (
    <>
      <Header />
      <Header2nd />
      <Outlet />
      <Footer />
    </>
  );
}

export function AdminLayout() {
  return (
    <>
      <div className="admin-main-container">
        <div className="side-menu-container">
          <Sidemenu />
        </div>
        <div className="side-board-container">
          <AdminHeader />
          <Outlet />
        </div>
      </div>
    </>
  );
}

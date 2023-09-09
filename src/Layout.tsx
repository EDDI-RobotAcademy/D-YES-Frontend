import { Outlet } from "react-router-dom";

import Footer from "layout/footer/Footer";
import Header from "layout/navigation/Header";
import Header2nd from "layout/navigation/Header2nd";
import Sidemenu from "layout/sidemenu/Sidemenu";

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
      <Sidemenu>
        <Outlet />
      </Sidemenu>
    </>
  );
}

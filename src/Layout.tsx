import { Outlet } from "react-router-dom";

import Footer from "layout/footer/Footer";
import Header from "layout/navigation/Header";
import Header2nd from "layout/navigation/Header2nd";

export default function Layout() {
  return (
    <div>
      <Header />
      <Header2nd />
      <Outlet />
      <Footer />
    </div>
  );
}

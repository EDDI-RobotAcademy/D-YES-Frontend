import React from "react";
import FarmRegister from "./farm/FarmRegister";
import FarmList from "./farm/FarmList";

const FarmRegisterPage = () => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, marginLeft: "80px", marginRight: "30px", marginTop: "20px", marginBottom: "20px" }}>
        <FarmRegister />
      </div>
      <div style={{ flex: 1, marginLeft: "30px", marginTop: "20px", marginBottom: "20px" }}>
        <FarmList />
      </div>
    </div>
  );
};

export default FarmRegisterPage;

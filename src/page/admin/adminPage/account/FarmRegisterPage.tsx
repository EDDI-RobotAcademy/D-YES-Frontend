import React, { useState } from "react";
import FarmRegister from "../farm/FarmRegister";
import FarmList from "../farm/FarmList";

import "./css/FarmRegisterPage.css";
import { FarmRead } from "entity/farm/FarmRead";

const FarmRegisterPage = () => {
  const [selectedFarm, setSelectedFarm] = useState<FarmRead | null>(null);

  return (
    <div className="farm-register-container">
      <div className="farm-register-box">
        <div style={{ display: "flex", backgroundColor: "#f0f0f0" }}>
          <div className="farm-register">
            <FarmRegister selectedFarm={selectedFarm} setSelectedFarm={setSelectedFarm} />
          </div>
          <div className="farm-list">
            <FarmList setSelectedFarm={setSelectedFarm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmRegisterPage;

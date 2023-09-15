import FarmRegister from "./FarmRegister";
import FarmList from "./FarmList";
import "./css/FarmRegister.css"

const FarmRegisterPage = () => {

  return (
    <div className="farm-register-container">
      <div className="farm-register-box">
        <div style={{ display: "flex", backgroundColor: "#f0f0f0" }}>
          <div className="farm-register">
            <FarmRegister />
          </div>
          <div className="farm-list">
            <FarmList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmRegisterPage;
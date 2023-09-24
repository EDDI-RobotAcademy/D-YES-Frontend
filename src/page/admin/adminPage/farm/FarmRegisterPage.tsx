import FarmRegister from "./FarmRegister";
import FarmList from "./FarmList";
import "./css/FarmRegister.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "layout/navigation/AuthConText";
import { useEffect } from "react";
import { toast } from "react-toastify";

const FarmRegisterPage = () => {
  const navigate = useNavigate();
  const { checkAdminAuthorization } = useAuth();
  const isAdmin = checkAdminAuthorization();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("권한이 없습니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="farm-container">
      <div className="farm-register-box">
        <div style={{ display: "flex", backgroundColor: "white" }}>
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

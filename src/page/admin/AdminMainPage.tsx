import { useAuth } from "layout/navigation/AuthConText";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminMainPage = () => {
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

  return <div>AdminMainPage</div>;
};

export default AdminMainPage;

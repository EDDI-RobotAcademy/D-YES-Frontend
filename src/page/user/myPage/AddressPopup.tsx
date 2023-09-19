import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { registerAddress } from "../api/UserApi";
import "./css/AddressPopup.css";
import AddressRegister from "./components/AddressRegister";

interface AddressPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddressPopup: React.FC<AddressPopupProps> = ({ isOpen, onClose }) => {

  return (
    <div>
      {/* 팝업이 열려 있는 경우에만 팝업을 표시 */}
      {isOpen && (
        <div className="popup-container">
          <div className="popup-content">
            <AddressRegister />
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPopup;

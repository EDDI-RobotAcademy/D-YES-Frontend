import React from "react";
import "./css/AddressPopup.css";
import AddressRegister from "./components/AddressRegister";
import AddressList from "./components/AddressList";

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
            <AddressList />
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPopup;

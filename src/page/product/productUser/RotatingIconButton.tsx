import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface RotatingIconButtonProps {
  up: string;
  down: string;
  onToggle: () => void;
}

const RotatingIconButton: React.FC<RotatingIconButtonProps> = ({ up, down, onToggle }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
    onToggle();
  };

  return (
    <button className="toggle-button" onClick={handleToggle}>
      <span className="toggle-button-text">{isToggled ? up : down}</span>
      <span className={`toggle-button-icon ${isToggled ? "toggle-button-rotate" : ""}`}>
        <KeyboardArrowDownIcon />
      </span>
    </button>
  );
};

export default RotatingIconButton;

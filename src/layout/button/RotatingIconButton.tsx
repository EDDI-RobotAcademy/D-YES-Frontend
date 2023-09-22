import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "./css/RotatingIconButton.css";

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
    <button className="rotating-toggle-button" onClick={handleToggle}>
      <span className="rotating-toggle-button-text">{isToggled ? up : down}</span>
      <span
        className={`rotating-toggle-button-icon ${
          isToggled ? "rotating-toggle-button-rotate" : ""
        }`}
      >
        <KeyboardArrowDownIcon />
      </span>
    </button>
  );
};

export default RotatingIconButton;

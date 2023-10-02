import React, { useState, useRef, useEffect } from "react";
import "../../css/ProductPage.css";

interface ToggleComponentProps {
  label: string;
  children: React.ReactNode;
  height: number;
}

const ToggleComponent: React.FC<ToggleComponentProps> = ({
  label,
  children,
  height,
}) => {
  const [isInputVisible, setInputVisible] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isInputVisible ? height : 0);
    }
  }, [isInputVisible, height]);

  return (
    <div>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => {
          setInputVisible(!isInputVisible);
        }}
        style={{
          width: "100%",
          height: "40px",
          fontFamily: "SUIT-Medium",
          fontSize: "16px",
          color: "#252525",
          border: "solid 1px",
          borderColor: "#d3d3d3",
          borderBottom: "none",
          backgroundColor: "#F8F9FA",
        }}
      >
        {isInputVisible ? label : label}
      </button>
      <div
        className={`input-container ${isInputVisible ? "active" : ""}`}
        style={{ height: contentHeight + "px", overflow: "hidden" }}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};

export default ToggleComponent;

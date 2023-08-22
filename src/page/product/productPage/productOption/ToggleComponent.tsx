import React, { useState, useRef, useEffect } from 'react';
import '../css/ProductPage.css';

interface ToggleComponentProps {
  label: string;
  children: React.ReactNode;
  height: number;
}

const ToggleComponent: React.FC<ToggleComponentProps> = ({ label, children, height }) => {
  const [isInputVisible, setInputVisible] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isInputVisible ? height : 0); 
    }
  }, [isInputVisible, height]);

  const handleButtonClick = () => {
    setInputVisible(!isInputVisible);
  };
  
  return (
    <div>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        style={{
          width: '100%',
          height: '40px',
          fontWeight: 'normal',
          border: 'none',
          backgroundColor: '#D0D0D0' 
        }}
      >
        {isInputVisible ? label : label}
      </button>
      <div
        className={`input-container ${isInputVisible ? 'active' : ''}`}
        style={{ height: contentHeight + 'px', overflow: 'hidden' }}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
}

export default ToggleComponent;

import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { useOptions } from "page/product/entity/useOptions";

interface OptionInputProps {
  onAddOption: (option: useOptions) => void;
}

const OptionInput: React.FC<OptionInputProps> = ({ onAddOption }) => {
  const [option, setOption] = useState<useOptions>({
    optionId: 0,
    optionName: "",
    optionPrice: 0,
    stock: 0,
    value: 0,
    unit: "",
    optionSaleStatus: "",
  });

  const handleAddOption = () => {
    onAddOption(option);
    setOption({
      optionId: 0,
      optionName: "",
      optionPrice: 0,
      stock: 0,
      value: 0,
      unit: "",
      optionSaleStatus: "",
    });
  };

  return (
    <Box className="btn-add-container">
      <Button
        onClick={handleAddOption}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          borderRadius: "0px",
        }}
      >
        추가
      </Button>
    </Box>
  );
};

export default OptionInput;

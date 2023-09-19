import { Box, Container, InputLabel, TextField, Button } from "@mui/material";
import { UserAddress } from "page/order/entity/UserAddress";
import { registerAddress } from "page/user/api/UserApi";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

declare global {
  interface Window {
    daum: any;
  }
}

interface IAddr {
  address: string;
  zonecode: string;
}

const AddressRegister = () => {
  const queryClient = useQueryClient();
  const [isDefault, setIsDefault] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [userAddress, setUserAddress] = useState<UserAddress>({
    address: "",
    zipCode: "",
    addressDetail: "",
  });

  const mutation = useMutation(registerAddress, {
    onSuccess: (data) => {
      queryClient.setQueryData("address", data);
      console.log("주소 확인", data);
    },
  });

  const handleDefaultChange = () => {
    setIsDefault((prev) => !prev);
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    if (cleanedValue.length <= 11) {
      const formattedValue = cleanedValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      setContactNumber(formattedValue);
    }
  };

  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (data: IAddr) {
        setUserAddress((prev) => ({
          ...prev, // 이전 객체의 모든 속성을 복사
          // 주소, 우편번호 업데이트
          address: data.address,
          zipCode: data.zonecode,
        }));

        localStorage.setItem("address", data.address);
        localStorage.setItem("zipCode", data.zonecode);
        localStorage.getItem("addressDetail");
        document.getElementById("addrDetail")?.focus();
      },
    }).open();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const target = event.target as typeof event.target & {
        elements: {
          receiver: { value: string };
        };
      };

      const { receiver } = target.elements;

      const data = {
        receiver: receiver.value,
        contactNumber: contactNumber,
        userToken: localStorage.getItem("userToken") || "",
        addressBookOption: isDefault ? "DEFAULT_OPTION" : "NON_DEFAULT_OPTION",
        address: {
          address: userAddress.address,
          zipCode: userAddress.zipCode,
          addressDetail: userAddress.addressDetail,
        },
      };
      console.log("데이터", data);
      await mutation.mutateAsync(data);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("다른 배송지를 기본 배송지로 설정해주세요");
      } else {
        // 다른 오류 처리
        console.error("오류 발생:", error);
      }
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={1} p={2}>
          <div>
            <div>
              <TextField
                label="이름"
                name="receiver"
                inputProps={{ name: "receiver" }}
                sx={{ borderRadius: "4px", marginRight: "8px" }}
              />
              <TextField
                label="연락처"
                value={contactNumber}
                onChange={handleContactNumberChange}
                sx={{ borderRadius: "4px" }}
              />
            </div>
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "25px" }}
            >
              <TextField
                id="address"
                name="address"
                label="주소"
                variant="outlined"
                fullWidth
                value={userAddress.address}
                InputProps={{
                  onClick: onClickAddr,
                  style: {
                    fontFamily: "SUIT-light",
                  },
                }}
              />
              <Button
                className="mapage-btn"
                variant="outlined"
                onClick={onClickAddr}
                style={{
                  fontSize: "14px",
                  color: "orange",
                  height: "56px",
                  padding: "0 40px",
                  borderColor: "orange",
                }}
              >
                검색
              </Button>
            </div>
            <div>
              <TextField
                id="zipNo"
                fullWidth
                variant="outlined"
                sx={{ paddingTop: "24px", marginBottom: "3px" }}
                value={userAddress.zipCode}
                InputProps={{
                  style: {
                    fontFamily: "SUIT-light",
                  },
                }}
              >
                우편번호
              </TextField>
            </div>
            <div>
              <TextField
                id="addressDetail"
                fullWidth
                variant="outlined"
                sx={{ paddingTop: "24px", marginBottom: "10px" }}
                value={userAddress.addressDetail}
                InputProps={{
                  style: {
                    fontFamily: "SUIT-light",
                  },
                }}
                onChange={(event) => {
                  setUserAddress((prev) => ({ ...prev, addressDetail: event.target.value }));
                }}
              >
                상세주소
              </TextField>
            </div>
            <div className="default-option">
              <label>
                <input type="checkbox" checked={isDefault} onChange={handleDefaultChange} />
                기본 배송지로 설정
              </label>
            </div>
            <Button type="submit">주소지 등록</Button>
          </div>
        </Box>
      </form>
    </Container>
  );
};

export default AddressRegister;

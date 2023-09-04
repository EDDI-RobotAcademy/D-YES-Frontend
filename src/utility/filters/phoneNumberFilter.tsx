import React from "react";

const phoneNumberFilter = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return phoneNumber;
};

interface PhoneNumberFormatterProps {
  phoneNumber: string;
}

const PhoneNumberFormatter: React.FC<PhoneNumberFormatterProps> = ({ phoneNumber }) => {
  const phoneNumberFormat = phoneNumberFilter(phoneNumber);

  return <div>{phoneNumberFormat}</div>;
};

export default PhoneNumberFormatter;

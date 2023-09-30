import { InquiryReadInquiryInfo } from "./InquiryReadInquiryInfo";
import { InquiryReadReplyInfo } from "./InquiryReadReplyInfo";
import { InquiryReadUserInfo } from "./InquiryReadUserInfo";

export type InquiryDetail = {
  inquiryReadUserResponse: InquiryReadUserInfo;
  inquiryReadInquiryInfoResponse: InquiryReadInquiryInfo;
  replyResponse: InquiryReadReplyInfo;
};

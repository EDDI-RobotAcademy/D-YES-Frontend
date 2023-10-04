import React from "react";

import "./css/Footer.css";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const goToInquiryRegister = () => {
    navigate("/inquiry/register");
  };

  return (
    <div className="footer-container">
      <div className="footer-inner">
        <div className="flex footer-group-list">
          <div>
            <h4 className="headline">
              투투마켓 고객센터&nbsp;
              <span className="headline-content">070-1234-5678</span>
            </h4>
            <div className="space-1"></div>
            <div className="flex flex-table">
              <div>
                <div className="table-style">
                  <div className="flex table-col">
                    <p className="title-width">월-목요일</p>
                    <div>11:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</div>
                  </div>
                  <div className="flex table-col">
                    <p className="title-width">금요일</p>
                    <div>09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</div>
                  </div>
                  <div className="flex table-col">
                    <p className="title-width">토·일·공휴일</p>
                    <div>휴무</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex button-style">
            <button className="flex button-detail-1" onClick={goToInquiryRegister}>
              <div className="button-text-1">
                <div className="button-text-1">
                  <div style={{ minWidth: "60px", textAlign: "center" }}>
                    <p>문의하기</p>
                  </div>
                </div>
              </div>
            </button>
            <button className="flex button-detail-2">
              <div className="button-text-2">자주 묻는 질문</div>
            </button>
          </div>
        </div>
        <div className="space-2"></div>
        <hr className="hr-1" />
        <div className="detail-info">
          <p>
            상호명 : 주식회사 투투마켓 &nbsp;|&nbsp; 대표 : 정다운 &nbsp;|&nbsp; 사업자등록번호 :
            123-45-67890 &nbsp;|&nbsp; 소재지 : 서울특별시 어딘가
          </p>
          <p>
            통신판매업 신고번호 : 2023-대한민국-0101 &nbsp;|&nbsp; 제휴 및 납품 문의 :
            biz@toto.co.kr
          </p>
        </div>
        <div className="flex copyright-container">
          <div className="copyright-detail">
            <div className="service-btn">
              <span className="mouseover">서비스 이용약관</span>
              <span className="mouseover">개인정보 처리방침</span>
            </div>
          </div>
          <span className="copyright-content">
            Copyright ⓒ 2023 주식회사 투투마켓 All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

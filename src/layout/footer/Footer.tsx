import React from "react";

import "./css/Footer.css";

const Footer: React.FC = () => {
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
                    <p className="content-font">11:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</p>
                  </div>
                  <div className="flex table-col">
                    <p className="title-width">금요일</p>
                    <p className="content-font">09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</p>
                  </div>
                  <div className="flex table-col">
                    <p className="title-width">토·일·공휴일</p>
                    <p className="content-font">휴무</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex button-style">
            <button className="flex button-detail-1">
              <p className="button-text-1">문의하기</p>
            </button>
            <button className="flex button-detail-2">
              <p className="button-text-2">자주 묻는 질문</p>
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
              <a className="mouseover">서비스 이용약관</a>
              <a className="mouseover">개인정보 처리방침</a>
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

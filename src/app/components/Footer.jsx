import React from 'react';
import './css/Footer.css';

const Footer = () => {
  return (

    <div className="max_width_container">
    <div className="main-footer-container">
      <div className="inner">
        <div style={{ width: '100%' }}>
          <div className="service_area">
            <div style={{width:'3%'}}></div>


            <div className="menu_box">
              <strong className="menu_title">이용안내</strong>
              <ul className="menu_list">
                <li className="menu_item" style={{ padding: '10px' }}></li>
                <li className="menu_item">
                  <a href="/support" className="menu_link">Kream 가이드라인</a>
                </li>
                <li className="menu_item">
                  <a href="/support" className="menu_link">고객센터 이용안내</a>
                </li>
                <li className="menu_item">
                  <a href="/support" className="menu_link">이벤트 참여 안내</a>
                </li>
                <li className="menu_item">
                  <a href="/support" className="menu_link">서비스 운영 정책 안내</a>
                </li>
              </ul>
            </div>
            <div style={{width:'3%'}}></div>
            <div className="menu_box">
              <strong className="menu_title">고객지원</strong>
              <ul className="menu_list">
                <li className="menu_item" style={{ padding: '10px' }}></li>
                <li className="menu_item">
                  <a href="/support/faqs" className="menu_link">안전결제 안내</a>
                </li>
                <li className="menu_item">
                  <a href="/support/faqs" target="_blank" className="menu_link">반품/교환 정책 안내</a>
                </li>
                <li className="menu_item">
                  <a href="/support/faqs" target="_blank" className="menu_link">구매자 보호 안내</a>
                </li>
                <li className="menu_item">
                  <a href="/support/faqs" target="_blank" className="menu_link">개인정보 보호 안내</a>
                </li>
              </ul>
            </div>
            <div></div>
            
            
           
            <div className="customer_service">
              <strong className="service_title">
                고객센터
                <a style={{marginLeft:'10px'}}>
                  1588 - 1588
                </a>
              </strong>
              <div className="service_time">
                <dl className="time_box">
                  <dt className="time_term">
                    운영시간 평일 10:00 - 18:00 
                    <br/>
                    (토∙일, 공휴일 휴무)
                    <br/>점심시간 평일 13:00 - 14:00
                  </dt>
                </dl>
              </div>
              
              <div className="service_btn_box">
              <a href="/support/inquiries"className="btn_solid_small">
                1:1 문의하기
              </a>
              </div>
              <div className="service_btn_box">
                <a href="/support/faqs" className="btn_solid_small">
                  자주 묻는 질문
                </a>
              </div>
            </div>
            
            <div></div>
            <div></div>
          </div>
        </div>
        <br/>
        <div className="corporation_area">
          <ul className="term_list">
            <li className="term_item">
              <a href="https://www.kreamcorp.com/" target="_blank" rel="noopener noreferrer" className="term_link">회사소개</a>
            </li>
            <li className="term_item">
              <a href="https://recruit.kreamcorp.com/" target="_blank" rel="noopener noreferrer" className="term_link">인재채용</a>
            </li>
            <li className="term_item">
              <a href="https://www.kreamcorp.com/contact.html" target="_blank" rel="noopener noreferrer" className="term_link">제휴제안</a>
            </li>
            <li className="term_item">
              <a href="#" className="term_link">이용약관</a>
            </li>
            <li className="term_item privacy">
              <a href="#" className="term_link">개인정보처리방침</a>
            </li>
          </ul>

          <div className="business_info">
            <div className="info_list">
              <dl className="info_item">
                <dt className="business_title">
                  세인트크림 주식회사 · 대표 노종문
                  <span className="blank" style={{marginLeft:'10px'}}></span>
                  사업자등록번호 : 000-000-00000
                  <span className="blank" style={{marginLeft:'10px'}}>사업자정보확인</span>
                  <span className="blank" style={{marginLeft:'10px'}}></span>
                  통신판매업 : 제 2024-ccc-0001호
                  <span className="blank" style={{marginLeft:'10px'}}></span>
                  사업장소재지 : 서울특별시 마포구 백범로 한국ICT인재개발원, 지하 1층
                  <span className="blank"></span>
                  호스팅 서비스 : 네이버 클라우드 ㈜
                </dt>
              </dl>
            </div>
          </div>
        </div>
        <div className="notice_guarantee">
          <p className="title">한국ICT은행 채무지급보증 안내</p>
          <p className="description">
            당사는 고객님의 현금 결제 금액에 대해 한국ICT은행과 채무지급보증 계약을 체결하여 안전거래를 보장하고 있습니다.
            <a href="#" className="link_guarantee">서비스가입 사실 확인</a>
          </p>
        </div>
        <div className="notice_area">
          <p className="notice">
            세인트크림(주)는 통신판매 중개자로서 통신판매의 당사자가 아닙니다. 본 상품은 개별판매자가 등록한 상품으로 상품, 상품정보, 거래에 관한 의무와 책임은 각 판매자에게 있습니다. 단, 이용약관 및 정책, 기타 거래 체결 과정에서 고지하는 내용 등에 따라 검수하고 보증하는 내용에 대한 책임은 세인트크림(주)에 있습니다.
          </p>
          <p className="copyright">© SAINT KREAM Corp.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Footer;
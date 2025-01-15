"use client";
import React, { useState } from 'react';
import './orderdetaildelivery.css';


const OrderDetail = () => {

// const Router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  
  // 모달 열기/닫기 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModal2 = () => setIsModal2Open(true);
  const closeModal2 = () => setIsModal2Open(false);



   const handleContactClick = () => {
     // open-chat 이벤트 발생 시킴 -> room_id: 999 . 임시번호이고, 실제 roomid 나 관리자 id가 파라미터로 가야함.
     window.dispatchEvent(new CustomEvent('open-chat', { detail: { room_id: 123, host_id: 123} }));
   };

  // const handleChatClick = () => {
  //   Router.push("/chat"); // 버튼 클릭시 이동함
  // };

  return (
    <div className="order-detail">
      {/* 헤더 */}
      <div className="order-header">
        
        <h1 className="order-title" style={{ fontSize: 20 }}>주문 상세</h1>
      </div>
      <div className="order-info2">
            <h3 className="order-date" style={{color:'black'}}>2024.12.25</h3>
            <span className="order-number">주문번호 000000000000</span>
      </div>

      {/* 결제 섹션 */}
      <section className="payment-section">
        <div className="order-selection2">
          <h2 style={{ fontSize: 20 }}>배송 중</h2>
          <p>물건이 배송 중이에요.</p>
        </div>
        <div className="product-info">
          <div className="product-img"></div>
          <div className="product-details">
            <p className="product-name">상품이름</p>
            <p className="product-price">80,000원</p>
          </div>
          <button  className="cancel-btn" onClick={openModal2}>거래 취소하기</button>
        </div>
      </section>


      <h2 style={{fontSize:20}}>결제정보</h2>
            <section className="sale-info">
        <div className="sale-row">
          <div className="sale-item">
            <span2>상품 금액</span2>
            <span2>80,000원</span2>
          </div>
          <div className="vertical-bar"></div> {/* 수직 바 추가 */}
          <div className="sale-item">
            <span2>결제수단</span2>
            <span2 className="bold">카카오뱅크</span2>
          </div>
        </div>
        <div className="sale-row">
          <div className="sale-item">
            <span2>배송비</span2>
            <span2 >+3,000원</span2>
            <br></br>
            <span2 className="bold">결제금액</span2>
            <span2 className="bold">83,000원</span2>
          </div>
        </div>
      </section>

      {/* 배송지정보 */}
      <h2 style={{ fontSize: 20 }}>배송지 정보</h2>
      <section className="transaction-info">
      <h3 style={{ fontSize: 18, marginBottom: 20 }}>홍길동</h3>
        <div className="transaction-details">
          <p>
             010-1111-22222
          </p>
          <p>
             (02494)서울 동대문구 어쩌구로 11길 000동 000호
          </p>
        </div>
      </section>



      {/* 거래정보 */}
      <h2 style={{ fontSize: 20 }}>거래정보</h2>
      <section className="transaction-info">
      <div className="order-header2">
        <h3 className="order-number2" style={{ fontSize: 18 }}>주문번호 00000000</h3>
        <p className="transaction-date" style={{textAlign:'right'}}>24년 12월 04일 08:50</p>
        </div>
        <div className="transaction-details">
          <p>
            <strong>판매자</strong> 판매자이름
          </p>
          <p>
            <strong>거래방법</strong> 일반택배(선불)
          </p>
          <p>
            <strong>운송장</strong>
            <button className="register-btn" >
              롯데택배 000000000000000
            </button>
          </p>
        </div>
      </section>

      {/* 모달 창 */}
      {/* {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✖</button>
            <h2>운송장 등록</h2>
            <div className="modal-form">
              <label className='modal-form2'>택배사</label>
              <select>
                <option>선택하세요</option>
                <option>CJ</option>
                <option>우체국</option>
              </select>

              <label>운송장 번호</label>
              <input type="text" placeholder="운송장 번호를 입력하세요" />
            </div>
            <button className="modal-submit">운송장 등록하기</button>
          </div>
        </div>
      )} */}

      {/* 모달 창 */}
      {isModal2Open && (
        <div className="modal-overlay2">
          <div className="modal-content2">
            <button className="modal-close2" onClick={closeModal2}>✖</button>
            <h2>거래 취소하기</h2>
            <div className="modal-form2">
              <label className='modal-form3'>거래 취소 사유</label>
              <select>
              <option>선택하세요</option>
                <option>"상품이 마음에 들지 않아서 구매를 취소합니다."</option>
                <option>"상품 상태가 설명과 다르거나 하자가 있어서 거래를 취소합니다."</option>
                <option>"판매자와 연락이 되지 않거나 상품 발송이 지연되어 거래를 취소합니다."</option>
                <option>"이미 다른 곳에서 같은 상품을 구매해서 주문을 취소합니다."</option>
                <option> "판매자가 약속한 가격이나 조건을 변경하여 거래를 취소합니다."</option>
              </select>
            </div>
            <button className="modal-submit2">등록하기</button>
          </div>
        </div>
      )}

<div className="action-buttons">
  <button className="chat-btn" onClick={handleContactClick}>채팅하기</button>
</div>
    </div>

    
  );
};

export default OrderDetail;

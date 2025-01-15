"use client";
import React, { useEffect, useState } from 'react';
import './orderdetail.css';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '../../../store/authStore';


const OrderDetail = () => {
  const [price, setPrice] = useState(null);
  const [isDataSent, setIsDataSent] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [orderData, setOrderData] = useState(null); // 서버에서 받은 주문 데이터
  const [buyerData, setBuyerData] = useState(null); // 서버에서 받은 구매고객 데이터
  const [sellerData, setSellerData] = useState(null); // 서버에서 받은 판매고객 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const searchParams = useSearchParams();

  const title = sessionStorage.getItem("productName"); // 저장된 이름 복원
  const sell_price = searchParams.get('productPrice');
  const pwr_id = searchParams.get('productId');
  const img = searchParams.get('productImg');
  const method = searchParams.get('method');
  const seller_id = searchParams.get('sellerId');
  console.log("셀러아이디서치파람", seller_id);

  const user = useAuthStore((state) => state.user);
  const member_id = user.member_id;

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const priceFromUrl = queryParams.get('price');
    setPrice(priceFromUrl);
  }, []);


  // 모달 열기/닫기 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModal2 = () => setIsModal2Open(true);
  const closeModal2 = () => setIsModal2Open(false);



  const handleContactClick = () => {
    // open-chat 이벤트 발생 시킴 -> room_id: 999 . 임시번호이고, 실제 roomid 나 관리자 id가 파라미터로 가야함.
    window.dispatchEvent(new CustomEvent('open-chat', { detail: { room_id: 123, host_id: 123 } }));
  };

  // const handleChatClick = () => {
  //   Router.push("/chat"); // 버튼 클릭시 이동함
  // };

  // 데이터 전송 및 다시 가져오기 함수
  const sendData = async () => {
    try {
      // 로컬 스토리지에서 전송 여부 확인
      const isSent = localStorage.getItem(`order_${pwr_id}`);
      if (isSent === 'true') {
        console.log('데이터가 이미 전송되었습니다.');
        setIsDataSent(true);
        return;
      }

      // 랜덤한 trans_id 생성
      const trans_id = Math.floor(Math.random() * 1000000); // 6자리 랜덤 번호

      // method 값에 따라 trans_method 설정
      const trans_method = method === '1' ? '택배거래' : method === '2' ? '직거래' : null;

      // 서버로 데이터 전송
      await axios.post('http://localhost:8080/api/transaction/settransdetails', {
        trans_id: trans_id, // 주문번호
        trans_price: sell_price, // 판매 가격
        pwr_id: pwr_id, // 게시글 ID
        buyer_id: member_id, // 구매자 ID
        trans_method: trans_method, // 거래 방법
        seller_id: seller_id,
      });

      // 데이터 전송 성공 시 로컬 스토리지에 저장
      localStorage.setItem(`order_${pwr_id}`, 'true');
      setIsDataSent(true);
    } catch (err) {
      console.error('데이터 전송:', err);
      setError('데이터 전송 실패');
    }
  };

  // 주문내역 조회
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/transaction/gettransdetails?pwr_id=${pwr_id}`);
      setOrderData(response.data.data);
      setIsDataFetched(true);
      console.log("주문 데이터 조회 완료:", response.data.data);
    } catch (error) {
      console.error("주문 데이터 조회 실패:", error);
      setError("주문 데이터 조회에 실패했습니다.");
    }
  };

  // 구매고객 조회
  const fetchBuyerData = async () => {
    try {
      console.log(member_id);
      const response = await axios.get(`http://localhost:8080/members/getmemberdetail?member_id=${member_id}`);
      setBuyerData(response.data.data);
      console.log("구매고객 데이터 조회 완료:", response.data.data);
    } catch (error) {
      console.error("구매고객 데이터 조회 실패:", error);
      setError("구매고객 데이터 조회에 실패했습니다.");
    }
  };

  // 판매고객 조회
  const fetchSellerData = async () => {
    try {
      console.log("판매고객 아이디", seller_id);
      const response = await axios.get(`http://localhost:8080/members/getmemberdetail?member_id=${seller_id}`);
      setSellerData(response.data.data);
      console.log("판매고객 데이터 조회 완료:", response);
    } catch (error) {
      console.error("판매고객 데이터 조회 실패:", error);
      setError("판매고객 데이터 조회에 실패했습니다.");
    }
  };

  // 판매 완료 업데이트
  const postUpdate = async () => {
    try {

      const response = await axios.post('http://localhost:8080/api/salespost/updatestatus', {
        pwr_id: pwr_id, // 게시글 ID
      });
      console.log(response);

    } catch (err) {
      console.error('데이터 전송:', err);
      setError('데이터 전송 실패');
    }

  };

  // useEffect(() => {
  //   // 페이지 로드 시 데이터 전송 및 조회
  //   sendData();
  //   fetchOrderData();
  //   fetchBuyerData();
  //   fetchSellerData();
  //   postUpdate();
  // }, []);

  useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        await sendData(); // 데이터 전송
        await fetchOrderData(); // 주문 데이터 조회
        await fetchBuyerData(); // 구매자 데이터 조회
        await fetchSellerData(); // 판매자 데이터 조회
        await postUpdate(); // 업데이트 작업
      } catch (error) {
        console.error("데이터 처리 중 오류 발생:", error);
      }
    };

    fetchDataSequentially(); // 비동기 함수 호출
  }, []);

  function formatDate(dateString) {
    // 입력된 날짜 문자열을 Date 객체로 변환
    const date = new Date(dateString);

    // 연도 계산 (2자리로 변환)
    const year = (date.getFullYear() % 100).toString().padStart(2, '0');
    // 월 계산 (1부터 시작하므로 1을 더함)
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // 일 계산
    const day = date.getDate().toString().padStart(2, '0');
    // 시간 계산
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // 원하는 형식으로 조합
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  }

  const formattedDate = formatDate(orderData?.trans_date);

  useEffect(() => {
    // 새로고침 플래그 확인
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      // 새로고침이 아직 수행되지 않았다면
      localStorage.setItem("hasRefreshed", "true"); // 새로고침 플래그 설정
      window.location.reload(); // 새로고침
    } else {
      // 새로고침 후 플래그 초기화
      localStorage.removeItem("hasRefreshed");
    }
  }, []);

  return (
    <div className="order-detail">
      {/* 헤더 */}
      <div className="order-header">

        <h1 className="order-title" style={{ fontSize: 20 }}>주문 상세</h1>
      </div>
      <div className="order-info2">
        <h3 className="order-date" style={{ color: 'black' }}>{orderData?.trans_date || '로딩 중...'}</h3>
        <span className="order-number">주문번호 {orderData?.trans_id || '로딩 중...'}</span>
      </div>

      {/* 결제 섹션 */}
      <h2 style={{ fontSize: 20 }}>결제 완료</h2>
      <section className="payment-section">
        <div className="order-selection2">
          <p>{buyerData?.nickname || '로딩 중'}님 결제를 완료했어요.</p>
        </div>
        <div className="product-info">
          <div className="product-img"><img src={`http://localhost:8080/images/${img}`} /></div>
          <div className="product-details">
            <p className="product-name">{title}</p>
          </div>
          <button className="cancel-btn" onClick={openModal2}>거래 취소하기</button>
        </div>
      </section>


      <h2 style={{ fontSize: 20 }}>구매정보</h2>
      <section className="sale-info">
        <div className='seller_name'><span className="bold" style={{ marginRight: "10px" }}>판매자</span><span>{sellerData?.nickname}</span></div>
        <div className="sale-row">
          <div className="sale-item">
            <span2></span2>
            <span2 className="bold" style={{ marginRight: "10px" }}>상품명</span2>
            <span>{title}</span>
            {/* <span2>정산 계좌</span2>
            <span2 className="bold">카카오뱅크 33330000000000 홍길동</span2> */}
          </div>
          <div>
            <span2 className="bold">금액</span2>
            <span>{Number(sell_price).toLocaleString()}원</span>
          </div>
          <div className="sale-item" style={{ width: "80px", height: "80px" }}>
            <div className="product-img"><img style={{ width: "80px", height: "80px" }} src={`http://localhost:8080/images/${img}`} /></div>
          </div>
        </div>
        {/* <div className="sale-row">
          <div className="sale-item">
            <span2>정산예정금액</span2>
            <span2 className="bold">{Number(sell_price).toLocaleString()}원</span2>
          </div>
        </div> */}
      </section>


      {/* 거래정보 */}
      <h2 style={{ fontSize: 20 }}>거래정보</h2>
      <section className="transaction-info">

        <div className="order-header2">
          <h3 className="order-number2" style={{ fontSize: 18 }}>주문번호 {orderData?.trans_id || '로딩 중...'}</h3>
          <p className="transaction-date" style={{ textAlign: 'right' }}>{formattedDate || '거래 날짜를 불러오는 중입니다...'}</p>

        </div>
        <div className="transaction-details">
          <p>
            <strong>구매자</strong>{buyerData?.nickname || '로딩 중'}
          </p>
          <p>
            <strong>거래방법</strong>{orderData?.trans_method || '로딩 중'}
          </p>

          {/* 택배거래일 경우에만 운송장 관련 정보 표시 */}
          {orderData?.trans_method === "택배거래" ? (
            <p>
              <strong>운송장</strong>
              <span>운송장 번호 없음</span>
              {/* <button className="register-btn" onClick={openModal}>
              운송장 등록하기
            </button> */}
            </p>
          ) : (
            <p><strong>운송장</strong> 운송장이 필요하지 않은 거래 방식입니다.</p>
          )}
        </div>
      </section>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>✖</button>
            <h2>운송장 등록</h2>
            <div className="modal-form">
              <label className='modal-form2'>택배사</label>
              <select id="courierSelect">
                <option>선택하세요</option>
                <option>CJ</option>
                <option>우체국</option>
              </select>

              <label>운송장 번호</label>
              <input id="trackingNumber" type="text" placeholder="운송장 번호를 입력하세요" />
            </div>
            <button
              className="modal-submit"
              onClick={() => {
                const courier = document.getElementById('courierSelect').value;
                const trackingNumber = document.getElementById('trackingNumber').value;

                if (courier === "선택하세요" || !trackingNumber) {
                  alert("택배사와 운송장 번호를 입력해주세요.");
                  return;
                }

                // 여기에서 서버로 운송장 정보 전송 가능
                console.log("택배사:", courier, "운송장 번호:", trackingNumber);

                // 등록 완료 알림
                alert("운송장 등록이 완료되었습니다.");

                // 모달 닫기
                closeModal();
              }}
            >운송장 등록하기</button>
          </div>
        </div>
      )}

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
        {/* <button className="register-btn2" onClick={openModal}>
          운송장 등록
        </button> */}
      </div>
    </div>


  );
};

export default OrderDetail;
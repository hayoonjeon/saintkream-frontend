"use client";
import React, { useEffect, useState } from 'react';
import './orderdetailpreparing.css';
import { useSearchParams } from 'next/navigation';
import useAuthStore from '../../../store/authStore';
import axios from 'axios';


const OrderDetail = () => {

  // const Router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const searchParams = useSearchParams();

  const title = searchParams.get('productName');
  const sell_price = searchParams.get('productPrice');
  const pwr_id = searchParams.get('productId');
  const img = searchParams.get('productImg');
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [orderData, setOrderData] = useState(null); // 서버에서 받은 주문 데이터
  const [buyerData, setBuyerData] = useState(null); // 서버에서 받은 구매고객 데이터
  const [buyerId, setBuyerId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [accounts, setAccounts] = useState(null);
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL}/api/address`;
  const API_URL = `${process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL}/api/accounts`;
  const defaultAddress = addresses.find((address) => address.isDefault === true);


  const user = useAuthStore((state) => state.user);
  console.log(user.member_id);
  const member_id = user.member_id;





  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // 주문 데이터 가져오기
        const response = await axios.get(`http://localhost:8080/api/transaction/gettransdetails?pwr_id=${pwr_id}`);
        const orderData = response.data.data;
        setOrderData(orderData);
        console.log("오더데이타", orderData);

        // 구매자 데이터 가져오기
        if (orderData?.buyer_id) {
          const member_id = orderData.buyer_id;
          const response = await axios.get(`http://localhost:8080/members/getmemberdetail?member_id=${member_id}`);
          setBuyerData(response.data.data);
          console.log("구매고객 데이터 조회 완료:", response.data.data);
        }

        // 구매자 주소 가져오기
        try {
          const member_id = orderData.buyer_id;
          const response = await axios.get(`${API_BASE_URL}/list`, {
            params: { member_id: member_id },
          });
          setAddresses(Array.isArray(response.data) ? response.data : []);
          console.log("어드레스데이타: ", response.data);
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
          setAddresses([]); // 오류 발생 시 빈 배열로 초기화
        }

        // 판매자 계좌 목록 가져오기
        try {
          const response = await fetch(`${API_URL}?memberId=${member_id}`);
          if (!response.ok) {
            throw new Error("계좌 목록 조회 실패");
          }
          const data = await response.json();

          console.log("계좌목록가져오기데이터", data);

          // 기본 계좌만 필터링
          const defaultAccounts = data.find((item) => item.isDefault === '1');

          // 상태를 갱신
          setAccounts(defaultAccounts || null); // 기본 계좌가 없으면 null

          return defaultAccounts;
        } catch (error) {
          console.error("계좌 목록 조회 중 오류 발생:", error);
          setAccounts([]);
          return [];
        }

      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("데이터를 가져오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [pwr_id]);

  // 모달 열기/닫기 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModal2 = () => setIsModal2Open(true);
  const closeModal2 = () => setIsModal2Open(false);

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

  const handleContactClick = () => {
    // open-chat 이벤트 발생 시킴 -> room_id: 999 . 임시번호이고, 실제 roomid 나 관리자 id가 파라미터로 가야함.
    window.dispatchEvent(new CustomEvent('open-chat', { detail: { room_id: 123, host_id: 123 } }));
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
        <h3 className="order-date" style={{ color: 'black' }}>{orderData?.trans_date}</h3>
        <span className="order-number">주문번호 {orderData?.trans_id}</span>
      </div>

      {/* 결제 섹션 */}
      <h2 style={{ fontSize: 20 }}>판매 완료</h2>
      <section className="payment-section">
        <div className="order-selection2">
          <p>배송 준비 중이에요.</p>
        </div>
        <div className="product-info">
          <div className="product-img"><img src={`http://localhost:8080/images/${img}`} alt='상품이미지' style={{ width: "50px", height: "50px", borderRadius: "10px" }} /></div>
          <div className="product-details">
            <p className="product-name">{title}</p>
            <p className="product-price">{Number(orderData?.trans_price).toLocaleString()}원</p>
          </div>
          <button className="cancel-btn" onClick={openModal2}>거래 취소하기</button>
        </div>
      </section>


      <h2 style={{ fontSize: 20 }}>정산정보</h2>
      <section className="sale-info">
        <div className="sale-row">
          <div className="sale-item">
            <span2>상품 금액</span2>
            <span2>{Number(orderData?.trans_price).toLocaleString()}원</span2>
            <br></br><br />
            <div className="sale-item">
              <span2>배송비</span2>
              <span2>금액포함</span2>
            </div>
          </div>
          <div className="vertical-bar"></div> {/* 수직 바 추가 */}
          <div className="sale-item-account">
            <span2>기본 정산 계좌</span2>
            {accounts ? (
              <>
                <div style={{ marginTop: "10px" }}></div>
                <span2>은행명</span2>
                <span2>{accounts.bankName}</span2>
                <div style={{ marginTop: "10px" }}></div>
                <span2>예금주</span2>
                <span2>{accounts.accountHolderName}</span2>
              </>
            ) : (
              <p>기본 정산 계좌 정보가 없습니다.</p>
            )}
          </div>
        </div>
        <div className="sale-row2">
          <div className="sale-item">
            <span2>결제 금액</span2>
            <span2 >{Number(orderData?.trans_price).toLocaleString()}원</span2>
            <br></br>
            <span2 className="bold">정산 금액</span2>
            <span2 className="bold">{Number(orderData?.trans_price).toLocaleString()}원</span2>
          </div>
          <div className="sale-item">
            <div style={{ textAlign: "right" }}>
              <span2 className="bold">계좌번호</span2>
            </div>
            <span className="bold">{accounts ? accounts.accountNumber : "계좌번호 없음"}</span>
          </div>
        </div>
      </section>

      {/* 배송지정보 */}
      <h2 style={{ fontSize: 20 }}>배송지 정보</h2>
      <section className="transaction-info">
        {defaultAddress ? (
          <>
            <h3 style={{ fontSize: 18, marginBottom: 20 }}>{defaultAddress.name}</h3>
            <div className="transaction-details">
              <p>
                {defaultAddress.phone}
              </p>
              <p>
                ({defaultAddress.zipcode}) {defaultAddress.address} {defaultAddress.detailAddress}
              </p>
            </div>
          </>
        ) : (
          <p>기본 배송지가 설정되지 않았습니다.</p>
        )}
      </section>



      {/* 거래정보 */}
      <h2 style={{ fontSize: 20 }}>거래정보</h2>
      <section className="transaction-info">
        <div className="order-header2">
          <h3 className="order-number2" style={{ fontSize: 18 }}>주문번호 {orderData?.trans_id}</h3>
          <p className="transaction-date" style={{ textAlign: 'right' }}>{formattedDate}</p>
        </div>
        <div className="transaction-details">
          <p>
            <strong>구매자</strong> {buyerData?.nickname}
          </p>
          <p>
            <strong>거래방법</strong> {orderData?.trans_method}
          </p>

          {/* 운송장 정보: 택배거래일 경우에만 표시 */}
          {orderData?.trans_method === "택배거래" && (
            <p>
              <strong>운송장</strong>
              <button className="register-btn" onClick={openModal}>
                운송장 등록하기
              </button>
            </p>
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
                <option>"상품 상태가 설명과 다르거나 하자가 있어서 거래를 취소합니다."</option>
                <option>"구매자와 연락이 닿지 않거나 상품 발송이 어려워 거래를 취소합니다."</option>
                <option>"이미 다른 곳에서 같은 상품을 판매해서 주문을 취소합니다."</option>
                <option> "구매자가 약속한 가격이나 조건을 변경하여 거래를 취소합니다."</option>
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

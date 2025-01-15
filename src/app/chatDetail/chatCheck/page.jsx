import React from 'react';
import './styles.css'; // 스타일 시트 경로가 정확한지 확인하세요.

const ChatCheck = ({ room_id }) => {
  return (
    <div className="chat-check-container">
      <br /><br /><br />
      <br /><br /><br />
      <div className="chat-check-header">
        <div style={{display:'flex', justifyContent:'center'}}>
          <div className='content_paper'>
            <div>상담번호코드 <a>1234 </a>회원 <a>( {room_id} )</a> 의 신고이력
              <p style={{marginBottom:'0px'}}>0 건</p>
            </div>
          </div>
        </div>
      </div>
      <br /><br />
      <br /><br />
      <br /><br />
      <br /><br />
      <br /><br />
      <div className="chat-check-body">
        <ul className="left-align">
          <li>-  거래 사기가 99%는 선입금에서 발생합니다.</li>
          <li>-  <a style={{ color: 'black' }}>'Saint Kream PAY' </a>와 함께라면 더이상</li>
          <li>-  불안한 마음으로 거래하지 않아도 돼요.</li>
        </ul>

        <ul className="left-align">
          <li>-  거래 물품을 안전하게 받을때까지</li>
          <li>-  <a style={{ color: 'black' }}>Saint Kream </a> 에서 결제액을 안전하게 보관하며,</li>
          <li>-  구매 확정 후 <a style={{ color: 'black' }}>3일 이내 </a>에 정산해 드려요.</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatCheck;
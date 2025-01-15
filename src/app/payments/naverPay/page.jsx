"use client"
import React, { useEffect } from 'react';

const NaverPayButton = () => {
  useEffect(() => {
    // 네이버페이 JavaScript SDK 로드
    const script = document.createElement('script');
    script.src = 'https://nsp.pay.naver.com/sdk/js/naverpay.min.js';
    script.async = true;
    script.onload = () => {
      // 네이버페이 객체 생성
      window.oPay = window.Naver.Pay.create({
        mode: 'development', // development or production
        clientId: 'HN3GGCMDdTgGUfl0kFCo', // ClientId
        chainId: 'VG5DTmJWRk1BaDZ' // ChainId
      });
    };
    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    // 네이버페이 결제창 호출
    if (window.oPay) {
      window.oPay.open({
        merchantPayKey: '20241205TwZ68b',
        productName: '전하윤 배채우기',
        productCount: '1',
        totalPayAmount: '290000',
        taxScopeAmount: '290000',
        taxExScopeAmount: '0',

        returnUrl: 'http://localhost:3000/orderdetail'

      });
    } else {
      console.error('Naver Pay is not initialized.');
    }
  };

  return (
    <div>
      <button id="naverPayBtn" onClick={handlePayment}>
        네이버페이 결제 버튼
      </button>
    </div>
  );
};

export default NaverPayButton;

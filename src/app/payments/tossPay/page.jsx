'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TossPayButton = () => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => setIsSdkLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isSdkLoaded) {
      console.error('TossPayments SDK가 로드되지 않았습니다.');
      return;
    }

    const clientKey = 'test_ck_oEjb0gm23PJxvDOP0jAkrpGwBJn5';
    const tossPayments = window.TossPayments(clientKey);

    try {
      const response = await axios.post('/api/tossPay', {
        orderId: 'order-id-1234',
        amount: 50000,
        orderName: '테스트 상품',
      });

      const { successUrl, failUrl } = response.data;

      tossPayments.requestPayment('카드', {
        amount: 50000,
        orderId: 'order-id-1234',
        orderName: '테스트 상품',
        successUrl,
        failUrl,
      });
    } catch (error) {
      console.error('결제 요청 실패:', error);
    }
  };

  return (
    <button onClick={handlePayment} disabled={!isSdkLoaded}>
      {isSdkLoaded ? '토스 결제하기' : 'SDK 로드 중...'}
    </button>
  );
};

export default TossPayButton;

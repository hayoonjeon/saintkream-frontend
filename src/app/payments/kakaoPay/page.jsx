"use client";

import React, { useState } from "react";
import axios from "axios";

const KakaoPay = () => {
  const [payUrl, setPayUrl] = useState("");


  //카카오 결제 요청 함수(임시)
  const handlePayment = async () => {
    try {
      const quantity = 1; // 수량
    const pricePerItem = 2200; // 상품 단가
    const totalAmount = quantity * pricePerItem; // 총 금액

    const vatAmount = Math.floor(totalAmount / 1.1 * 0.1); // 부가세 계산

    const response = await axios.post("/api/kakaoPay", {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      item_name: "초코파이",
      quantity: quantity,
      total_amount: totalAmount, // 계산된 총 금액
      vat_amount: vatAmount, // 부가세 계산
      tax_free_amount: totalAmount - vatAmount, // 면세 금액
      approval_url: "http://localhost:3000/orderdetail",
      fail_url: "http://localhost:3000/kakaoPay/fail",
      cancel_url: "http://localhost:3000/kakaoPay/cancel",
      });

      console.log(response.data);
      setPayUrl(response.data.next_redirect_pc_url); // 결제 URL 설정// 결제 URL 설정
    } catch (error) {
      console.error("결제 요청 에러:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>카카오페이 결제 테스트</h1>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        결제하기
      </button>
      {payUrl && (
        <div style={{ marginTop: "20px" }}>
          <a href={payUrl} target="_blank" rel="noopener noreferrer">
            결제 페이지로 이동
          </a>
        </div>
      )}
    </div>
  );
};

export default KakaoPay;

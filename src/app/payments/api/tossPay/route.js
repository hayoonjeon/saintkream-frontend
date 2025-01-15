import { NextResponse } from 'next/server';

export async function POST(request) {
  const { orderId, amount, orderName } = await request.json();

  // 성공 및 실패 페이지 URL 설정
  const successUrl = 'http://localhost:3000/orderdetail?price=1000'; // 성공 시 이동할 페이지
  const failUrl = 'http://localhost:3000/payment/fail';       // 실패 시 이동할 페이지

  return NextResponse.json({
    successUrl,
    failUrl,
  });
}

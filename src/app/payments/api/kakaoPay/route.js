import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      partner_order_id,
      partner_user_id,
      item_name,
      quantity,
      total_amount,
      tax_free_amount,
      approval_url,
      cancel_url,
      fail_url,
    } = body;

    const response = await axios.post(
      "https://kapi.kakao.com/v1/payment/ready",
      {
        cid: "TC0ONETIME", // 테스트용 가맹점 CID
        partner_order_id,
        partner_user_id,
        item_name,
        quantity,
        total_amount,
        tax_free_amount: tax_free_amount || 0,
        approval_url,
        cancel_url,
        fail_url,
      },
      {
        headers: {
          Authorization: `KakaoAK 1a5d6d1f27c3709bbfd84088e2c9ef8d`, // 'KakaoAK ' 포함
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("카카오페이 API 호출 에러:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({
        message: "결제 준비 API 호출 실패",
        error: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}

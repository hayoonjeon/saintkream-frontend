import React, { useEffect, useState } from 'react';
import { Button, Typography, Grid, Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
function CustomPage({ nextButton, setNextButton, data }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const router = useRouter(); // 페이지 이동을 위한 history 객체 사용
  const [payUrl, setPayUrl] = useState("");
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };
  sessionStorage.setItem("productName", data.title); // 긴 이름 저장
  const queryParams = new URLSearchParams({
    // productName: data.title,
    productPrice: data.sell_price,
    productId: data.pwr_id, // 추가로 전달하고 싶은 데이터
    productImg: data.fileList[0]?.fileName, // 추가로 전달하고 싶은 데이터
    method: nextButton, // nextButton 값 추가
    sellerId: data.member_id,
    supCategory: data.sup_category,
    subCategory: data.sub_category,
  });

  console.log("쿼리파람스", queryParams.toString());

  const getButtonStyles = (payment) => {
    const defaultStyles = {
      color: '#000',
      bgcolor: '#f0f0f0',
      '&:hover': { bgcolor: '#e0e0e0' },
    };
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

    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment';
      script.onload = () => setIsSdkLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, []);


    useEffect(() => {
      if (payUrl) {
        window.location.href = payUrl; // payUrl이 설정되면 자동으로 리디렉션 .  카카오페이용 gettransdetails
      }
    }, [payUrl]); // payUrl이 변경될 때마다 실행


    if (selectedPayment === payment) {
      switch (payment) {
        case '카카오페이':
          return { bgcolor: '#FFE812', color: '#000', '&:hover': { bgcolor: '#FFD700' } };
        case '네이버페이':
          return { bgcolor: '#03C75A', color: '#fff', '&:hover': { bgcolor: '#02B45F' } };
        case '토스페이':
          return { bgcolor: '#1B64F2', color: '#fff', '&:hover': { bgcolor: '#1657C9' } };
        default:
          return defaultStyles;
      }
    }
    return defaultStyles;
  };

  // 결제 프로세스 실행 함수
  const executePayment = async () => {
    if (!selectedPayment) return; // 결제 수단이 선택되지 않았다면 아무 행동도 취하지 않음

    switch (selectedPayment) {
      case '카카오페이':
        console.log('카카오페이로 결제를 진행합니다.');
        // setNextButton(3)
        try {
          const quantity = 1; // 수량
          const pricePerItem = data.sell_price; // 상품 단가
          const totalAmount = quantity * pricePerItem; // 총 금액
          const vatAmount = Math.floor(totalAmount / 1.1 * 0.1); // 부가세 계산
          const response = await axios.post("./payments/api/kakaoPay", {
            cid: "TC0ONETIME",
            partner_order_id: "partner_order_id",
            partner_user_id: "partner_user_id",
            item_name: data.title,
            quantity: quantity,
            total_amount: totalAmount, // 계산된 총 금액
            vat_amount: vatAmount, // 부가세 계산
            tax_free_amount: totalAmount - vatAmount, // 면세 금액
            approval_url: `http://localhost:3000/orderdetail?${queryParams.toString()}`, // 쿼리 파라미터로 데이터 전달,
            fail_url: "http://localhost:3000/payments/kakaoPay/fail",
            cancel_url: "http://localhost:3000/payments/kakaoPay/cancel",
          });
          console.log(response.data);
          setPayUrl(response.data.next_redirect_pc_url); // 결제 URL 설정// 결제 URL 설정

        } catch (error) {
          console.error("결제 요청 에러:", error);
        }
        break;
      case '네이버페이':
        console.log('네이버페이로 결제를 진행합니다.');
        // setNextButton(4)
        // 네이버페이 결제창 호출
        if (window.oPay) {
          window.oPay.open({
            merchantPayKey: '20241205TwZ68b',
            productName: data.title,
            productCount: '1',
            totalPayAmount: data.sell_price,
            taxScopeAmount: data.sell_price,
            taxExScopeAmount: '0',
            returnUrl: `http://localhost:3000/orderdetail?${queryParams.toString()}` // 쿼리 파라미터로 데이터 전달
          });
        } else {
          console.error('Naver Pay is not initialized.');
        }
        break;
      case '토스페이':
        console.log('토스페이로 결제를 진행합니다.');
        // setNextButton(5)

        if (!isSdkLoaded) {
          console.error('TossPayments SDK가 로드되지 않았습니다.');
          return;
        }
        const clientKey = 'test_ck_oEjb0gm23PJxvDOP0jAkrpGwBJn5';
        const tossPayments = window.TossPayments(clientKey);
        try {
          const response = await axios.post('./payments/api/tossPay', {
            orderId: 'order-id-1234',
            amount: data.sell_price,
            orderName: data.title,
          });
          const { failUrl } = response.data;
          tossPayments.requestPayment('카드', {
            amount: data.sell_price,
            orderId: 'order-id-1234',
            orderName: data.title,
            successUrl: `http://localhost:3000/orderdetail?${queryParams.toString()}`, // 쿼리 파라미터로 데이터 전달
            failUrl,
          });
        } catch (error) {
          console.error('결제 요청 실패:', error);

        };

        break;
      default:
        console.error('지원하지 않는 결제 수단입니다.');
        break;
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 500, margin: 'auto', bgcolor: '#fff' }}>
      {/* 제목  나중에 여기서 나온 nextButton 변수값으로  직거래, 택배거래 구분필요함*/}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        {nextButton === 1 ? "택배거래로 구매" : nextButton === 2 ? ("직거래로 구매") : null}
      </Typography>

      {/* 판매 정보 */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="left">
          <Grid item xs={4}>
            <Box
              sx={{
                width: '60px',
                height: '60px',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}
            >
              <img
                src={`http://localhost:8080/images/${data.fileList[0]?.fileName}`}
                alt="판매 아이콘"
                style={{
                  width: '60px',
                  height: '60px',
                  border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={7} >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {data.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              {Number(data.sell_price).toLocaleString()}원
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 결제 수단 */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, height: '400px' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
          결제 수단
        </Typography>
        <Grid container spacing={1} justifyContent="left">
          {['카카오페이', '네이버페이', '토스페이'].map((payment) => (
            <Grid item xs={5.5} key={payment}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handlePaymentSelect(payment)}
                sx={{
                  ...getButtonStyles(payment),
                  boxShadow: 'none',
                  transition: 'none',
                }}
              >
                {payment}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* 최종 결제 금액 */}
      <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              최종 결제 금액
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">{Number(data.sell_price).toLocaleString()}원</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 다음 버튼 */}
      <Button
        variant="contained"
        fullWidth
        disabled={!selectedPayment}
        onClick={executePayment} // 결제 실행 함수 연결
        sx={{
          height: '56px',
          fontWeight: 'bold',
          bgcolor: selectedPayment ? '#000' : '#ccc',
          color: selectedPayment ? '#fff' : '#888',
          border: 'none',
          '&:hover': {
            bgcolor: selectedPayment ? '#111' : '#ccc',
          },
        }}
      >
        다음
      </Button>

    </Box>
  );
}

export default CustomPage;
"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';

const faqs = [
  { id: "1", question: "의류 거래 시 안전하게 결제하는 방법", answer: "의류 거래 시 안전하게 결제를 하기 위해서는 신뢰할 수 있는 결제 시스템을 이용하는 것이 중요합니다. 예를 들어, PayPal, Stripe 또는 기타 검증된 결제 게이트웨이를 사용하면 불법적인 카드 사용이나 사기로부터 보호받을 수 있습니다. 또한, 거래 전에 판매자의 평판을 확인하고, 가능하다면 보호된 거래를 제공하는 플랫폼을 통해 거래하는 것이 좋습니다. 이러한 플랫폼들은 일반적으로 구매자와 판매자 양쪽의 안전을 보장하기 위한 조치를 취하고 있습니다." },
  { id: "2", question: "상품의 정품 여부를 어떻게 확인할 수 있나요?", answer: "상품의 정품 여부를 확인하기 위해 여러 방법이 있습니다. 가장 확실한 방법은 제품에 대한 인증서를 판매자로부터 요청하는 것입니다. 공식 판매자나 유통업체는 제품의 정품 인증서나 보증서를 제공할 수 있습니다. 또한, 제품의 일련 번호를 제조사의 웹사이트에 입력하여 검증 받을 수도 있습니다. 시장에는 정품을 모방한 가짜 제품이 많기 때문에, 제품 구매 전에 판매자의 리뷰를 철저히 확인하고, 가격이 너무 저렴하다면 의심해 보는 것이 중요합니다." },
  { id: "3", question: "배송은 어떻게 진행되나요?", answer: "배송 절차는 판매자의 위치와 구매자의 위치에 따라 달라집니다. 대부분의 온라인 상점은 배송 옵션을 여러 가지 제공하며, 일반적으로 표준, 급행, 그리고 당일 배송 등이 있습니다. 주문 후, 온라인 시스템을 통해 추적 번호가 제공되어, 구매자는 실시간으로 자신의 상품 위치를 추적할 수 있습니다. 배송 과정 중에 문제가 발생한 경우, 고객 서비스에 연락하여 해결을 요청할 수 있습니다. 이 과정에서 구매자의 주소와 연락처 정보가 정확해야 지연 없이 배송이 이루어집니다." },
  { id: "4", question: "반품 또는 교환 정책은 무엇인가요?", answer: "반품 및 교환 정책은 판매하는 상점에 따라 상이합니다. 대부분의 경우, 상품을 구매한 후 14일 내에는 반품이 가능하며, 제품이 미사용 상태이고, 원래 포장 상태를 유지하고 있어야 합니다. 일부 상점은 무료 반품을 지원하지만, 일부는 반품 시 배송비를 구매자가 부담해야 할 수도 있습니다. 교환을 원할 경우에는, 판매자에게 먼저 연락을 취하여 교환 가능 여부를 확인해야 하며, 때로는 색상이나 사이즈만 변경이 가능할 수도 있습니다." },
  { id: "5", question: "판매자가 된다면 어떤 이점이 있나요?", answer: "판매자가 되면 상품을 직접 시장에 내놓고 판매할 수 있는 기회를 가질 수 있습니다. 이는 추가 수익을 창출할 수 있는 좋은 방법입니다. 또한, 자신의 브랜드를 구축하고, 고객과 직접적인 관계를 맺을 수 있으며, 비즈니스를 확장하는 데 도움이 됩니다. 온라인 플랫폼을 통해 판매하면 전 세계 어디서든 고객에게 도달할 수 있어, 시장의 한계를 뛰어넘을 수 있습니다. 또한, 판매 플랫폼은 판매자를 위한 다양한 마케팅 도구와 분석 도구를 제공하여, 비즈니스 결정을 더 잘 내릴 수 있도록 지원합니다." },
  { id: "6", question: "구매자 보호 프로그램은 무엇인가요?", answer: "구매자 보호 프로그램은 온라인 구매 시 발생할 수 있는 다양한 문제에 대해 보상을 제공하는 프로그램입니다. 예를 들어, 제품이 설명과 다르거나, 제품이 도착하지 않았을 경우, 또는 제품에 하자가 있을 경우 이 프로그램을 통해 환불 또는 교환을 요청할 수 있습니다. 이 프로그램은 구매자의 신뢰를 증진시키고, 안전한 거래 환경을 제공하기 위해 설계되었습니다. 대부분의 주요 온라인 거래 플랫폼에서는 이러한 보호 프로그램을 운영하고 있으며, 이는 구매자가 보다 안심하고 거래할 수 있게 합니다." },
  { id: "7", question: "개인정보 보호는 어떻게 이루어지나요?", answer: "개인정보 보호는 데이터 보호 법률과 규정에 따라 이루어집니다. 우리는 사용자의 개인 정보를 매우 중요하게 생각하며, 이를 안전하게 보호하기 위해 최신의 보안 기술과 절차를 사용합니다. 사용자의 데이터는 암호화되어 안전하게 저장되며, 제3자와의 불필요한 공유는 엄격하게 제한됩니다. 또한, 사용자는 언제든지 자신의 개인정보에 접근하여 수정하거나 삭제를 요청할 수 있습니다. 정기적인 보안 검토와 감사를 통해 데이터 보호 수준을 지속적으로 향상시키고 있습니다." }
];


const FaqPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const handleClickOpen = (faq) => {
    setSelectedFaq(faq);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2 style={{ color: '#333', borderBottom: '3px solid black', paddingBottom: '10px', textAlign: 'left' }}>자주 묻는 질문</h2>
      <div>
        {faqs.map((faq) => (
          <div key={faq.id} style={{ padding: '5px 0', borderBottom: '1px solid #ccc' }}>
            <Button onClick={() => handleClickOpen(faq)} style={{ textDecoration: 'none', color: 'black', textTransform: 'none', width: '100%', justifyContent: 'left' }}>
              {faq.question}
            </Button>
          </div>
        ))}
        {selectedFaq && (
          <Dialog
            open={open}
            onClose={handleClose}
            BackdropProps={{
              style: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'  // 투명도를 0.4로 설정하여 오버레이를 밝게 만듭니다.
              }
            }}
          >
            <DialogTitle>{selectedFaq.question}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedFaq.answer}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default FaqPage;

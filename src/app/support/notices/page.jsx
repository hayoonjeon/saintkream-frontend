"use client"
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';


const notices = [
  {
    id: 1,
    text: "Saint Kream 가이드라인에 대한 안내",
    answer: `Saint Kream은 모든 사용자가 안전하고 공정한 거래 환경에서 활동할 수 있도록 설계된 중요한 규정 모음입니다.<br/>
  이 가이드라인은 플랫폼 사용자에게 명확한 행동 기준을 제시하며, 상품의 진위 여부를 확인하는<br/>  방법과 같은 중요한 절차를 포함하여 거래의 투명성과 신뢰성을 보장합니다.<br/><br/>
  
  <strong>가이드라인에는 다음과 같은 핵심 요소들이 포함되어 있습니다.</strong><br/><br/><br/>
  
  1. <strong>상품 상태 확인 절차:</strong> 모든 상품이 거래되기 전에 상품의 상태와 설명이 정확한지 검증되어야 합니다. 이는 판매자가 제공한 정보와 실제 상품의 상태가 일치하는지 확인하는 과정을 포함합니다. 판매자는 상품의 상태를 사진과 설명을 통해 투명하게 공개해야 하며, 구매자는 이를 근거로 상품을 평가할 수 있습니다. 이 과정은 모든 사용자가 만족할 수 있는 거래를 촉진하기 위해 필수적입니다.
<br/><br/>
  
  2. <strong>소비자 보호 프로토콜:</strong> 구매자는 모든 거래에서 보호받을 권리가 있으며, Saint Kream은 이를 위해 다양한 소비자 보호 조치를 시행합니다. 이에는 돈을 환불받을 수 있는 명확한 기준과 절차, 제품 하자 발견 시 보상 정책, 그리고 고객 서비스 접근성 향상이 포함됩니다.<br/><br/>
  
  3. <strong>분쟁 해결 메커니즘:</strong> 거래 과정에서 발생할 수 있는 분쟁을 해결하기 위한 명확한 지침과 절차가 마련되어 있습니다. 이는 분쟁 해결을 위한 중립적인 중재 과정을 포함하여, 양 당사자 간의 공정한 해결을 추구합니다.<br/><br/>
  
  4. <strong>규칙 준수 강조:</strong> 모든 사용자는 이러한 가이드라인을 준수해야 하며, 위반 시에는 서비스 이용 제한, 계정 정지, 또는 법적 조치가 취해질 수 있습니다. 이는 플랫폼 내에서의 거래 안전을 유지하고, 모든 사용자가 공정하게 대우받을 수 있는 환경을 보장하기 위해 필수적입니다.
  <br/><br/><br/><br/>`
  },
  {
    id: 2,
    text: "Saint Kream 고객센터 이용안내",
    answer: `Saint Kream은 모든 사용자가 편리하고 신속하게 지원받을 수 있도록 효율적인 고객 지원 시스템을 운영합니다.<br/> 전화 지원 대신, 우리는 모든 고객의 문의 사항을 1대1 채팅을 통해 처리합니다. <br/>이 시스템을 통해 사용자는 언제 어디서나 직접적이고 개인화된 지원을 받을 수 있습니다.<br/><br/>
    
    <strong>1대1 채팅 지원:</strong> 우리의 1대1 채팅 서비스를 통해, 고객님은 실시간으로 전문 상담원과 대화를 나눌 수 있습니다. 이 서비스는 모든 사용자가 즉시 해결책을 제공받을 수 있도록 설계되었습니다. 문의사항이 있을 경우, 플랫폼 내에서 쉽게 채팅 지원을 요청하고, 빠른 답변을 받을 수 있습니다.<br/><br/>
  
    <strong>자주 묻는 질문(FAQ):</strong> 자주 묻는 질문 섹션은 사용자가 일반적인 문의 사항에 대한 답변을 신속하게 찾아볼 수 있도록 구성되어 있습니다. 이 섹션은 주기적으로 업데이트되어 최신 정보를 반영하며, 다양한 주제에 대한 상세한 해답을 제공합니다.<br/><br/>
  
    <strong>고객센터 공지사항:</strong> 최신의 서비스 업데이트, 정책 변경 사항, 그리고 기타 중요한 정보들은 고객센터 공지사항을 통해 공유됩니다. 공지사항은 사용자가 Saint Kream의 모든 새로운 개발사항에 쉽게 접근할 수 있도록 돕습니다.<br/><br/>
  
    우리의 목표는 모든 사용자가 만족스러운 거래 경험을 할 수 있도록 지원하는 것입니다. 어떤 문의나 필요가 있으시면 언제든지 1대1 채팅을 통해 저희에게 연락 주세요.`
  },{
    id: 3,
    text: "Saint Kream 이벤트 참여방법 안내",
    answer: `Saint Kream에서는 다양한 온라인 이벤트를 정기적으로 개최하여, 사용자 여러분께 즐거움과 가치를 제공합니다. 모든 이벤트는 우리 웹사이트의 공식 이벤트 페이지를 통해 자세히 안내드리고 있습니다.<br/><br/>
  
    <strong>참여 방법 및 조건:</strong> 각 이벤트는 특정 기간 동안만 진행되며, 참여 조건은 이벤트마다 다를 수 있습니다. 이벤트에 따라 다양한 상품,<br/> 할인 혜택, 또는 기타 전용 혜택이 제공됩니다. 참여 방법에는 다음과 같은 옵션이 포함될 수 있습니다.<br/><br/>
    - 온라인 등록: 이벤트 페이지에서 직접 등록을 통해 참여하실 수 있습니다.<br/><br/>
    - 제품 구매: 이벤트에 참여하기 위해 특정 제품을 구매하시는 경우, 자동으로 이벤트에 참여하게 됩니다.<br/><br/>
    - 소셜 미디어 참여: Facebook, Instagram 등의 소셜 미디어 플랫폼을 통해 특별한 과제를 완료하거나 게시물을 공유함으로써 참여할 수 있습니다.<br/><br/><br/>
  
    <strong>제휴된 파트너사 참여:</strong> 특별한 경우, Saint Kream과 제휴된 파트너사를 통해 이벤트에 참여할 수도 있습니다.<br/> 이러한 파트너십을 통해 더욱 풍부한 경험과 혜택을 제공하고자 합니다.<br/><br/>
  
    모든 이벤트의 참여 방법 및 조건은 공식 페이지에서 상세히 확인하실 수 있습니다. 많은 참여를 통해 다양한 혜택을 경험하시기 바랍니다.`
  },
  {
    id: 4,
    text: "Saint Kream 서비스 운영정책 업데이트",
    answer: `Saint Kream은 최근 운영정책을 개정하여, 서비스 이용 조건과 개인정보 보호 방침을 강화하였습니다. 이러한 변경 사항은 사용자의 데이터 보호를 강화하고, 사용자 경험을 개선하기 위해 도입되었습니다.<br/><br/>
  
    <strong>주요 업데이트 내용은 다음과 같습니다</strong><br/><br/><br/>
    - <strong>개인정보 보호 강화:</strong> 사용자의 개인정보 보호를 위한 새로운 기준과 프로토콜이 도입되었습니다. 이는 데이터 보안을 강화하고, 사용자 정보의 무단 접근을 방지하기 위한 조치입니다.<br/><br/>
    - <strong>사용자 데이터의 안전한 처리:</strong> 모든 사용자 데이터는 최신 보안 기술을 사용하여 처리되며, 이는 정보 유출 위험을 최소화하고, 데이터 무결성을 유지합니다.<br/><br/>
    - <strong>사용자 경험 개선:</strong> 플랫폼 내에서의 사용자 인터페이스(UI)와 사용자 경험(UX)이 개선되어, 보다 직관적이고 효율적인 서비스 이용이 가능해졌습니다.<br/><br/><br/>
  
    모든 변경 사항은 이미 우리 플랫폼에 적용되었으며, 사용자 여러분은 새로운 정책에 따라 서비스를 이용하시게 됩니다. 정책의 자세한 내용을 확인하고 싶으시면, 공식 웹사이트의 고객 지원 센터에 문의해 주시기 바랍니다. 이 변경은 모든 사용자가 보다 안전하고 편리하게 Saint Kream을 이용할 수 있도록 도와줍니다.`
  }
  
];
const NoticesPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const handleClickOpen = (notice) => {
    setSelectedNotice(notice);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2 style={{ color: '#333', borderBottom: '3px solid black', paddingBottom: '10px', textAlign: 'left' }}>공지사항</h2>
      <div>
        {notices.map((notice) => (
          <div key={notice.id} style={{ padding: '5px 0', borderBottom: '1px solid #ccc' }}>
            <Button onClick={() => handleClickOpen(notice)} style={{ textDecoration: 'none', color: 'black', textTransform: 'none', width: '100%', justifyContent: 'left' }}>
              {notice.text}
            </Button>
          </div>
        ))}
        {selectedNotice && (
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            BackdropProps={{
              style: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'  // 투명도를 0.1로 설정하여 오버레이를 밝게 만듭니다.
              }
            }}
          >
            <DialogTitle>{selectedNotice.text}</DialogTitle>
            <DialogContent>
              <div dangerouslySetInnerHTML={{ __html: selectedNotice.answer }} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};


export default NoticesPage;
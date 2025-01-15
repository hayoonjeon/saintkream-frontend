import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const MarketingConsent = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "60%",
          height: "80%",
          margin: "auto",
          marginTop: "5%",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          outline: "none",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" style={{ marginBottom: "20px", fontWeight: "bold", textAlign: "left" }}>
          <strong>광고성 정보 수신 동의</strong>
        </Typography>
        <Typography variant="body2" style={{ lineHeight: "1.5", whiteSpace: "pre-line", textAlign: "left" }}>
          <strong>제 1 조 (목적)</strong><br />
          본 동의서는 회사가 회원에게 제공하는 광고성 정보의 수신에 대한 회원의 동의를 명확히 하기 위하여 작성되었습니다.<br /><br />
          
          <strong>제 2 조 (광고성 정보의 내용)</strong><br />
          회원은 회사로부터 다음과 같은 광고성 정보를 수신하는 데 동의합니다:<br />
          - 신제품 또는 신서비스 출시 정보<br />
          - 할인 및 프로모션 정보<br />
          - 회원 전용 이벤트 정보<br />
          - 기타 마케팅 및 상업적 정보<br /><br />

          <strong>제 3 조 (수신 방법)</strong><br />
          회원은 회사로부터 이메일, SMS, 모바일 알림, 소셜 미디어 메시지 등의 방법으로 광고성 정보를 수신할 수 있습니다.<br /><br />

          <strong>제 4 조 (동의의 철회)</strong><br />
          회원은 언제든지 수신 동의를 철회할 수 있습니다. 동의를 철회하고자 할 때는 회사가 제공하는 수신 동의 철회 방법을 이용하여 철회할 수 있습니다.<br /><br />

          <strong>제 5 조 (개인정보의 보호)</strong><br />
          회사는 광고성 정보 제공을 목적으로만 개인정보를 사용하며, 해당 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 회사는 관련 법령에 따라 개인정보를 안전하게 관리할 의무가 있습니다.<br /><br />

          기타 자세한 사항은 회사 웹사이트의 고객센터를 통해 확인하실 수 있습니다.
        </Typography>
        <Button
          onClick={onClose}
          style={{
            marginTop: "20px",
            backgroundColor: "#333",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "5px",
          }}
        >
          닫기
        </Button>
      </Box>
    </Modal>
  );
};

export default MarketingConsent;

import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const Terms = ({ open, onClose }) => {
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
        <Typography variant="h6" sx={{ marginBottom: "20px", fontWeight: "bold", textAlign: "left" }}>
          서비스 이용약관
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: "1.5", whiteSpace: "pre-line", textAlign: "left" }}>
          <strong>제 1 조 (목적)</strong><br />
          본 약관은 KREAM 서비스(이하 "서비스")를 이용함에 있어 회원과 회사 간의 권리, 의무 및 서비스 이용 조건을 명확히 하여 양 당사자의 권리를 보호하고 의무를 명확히 하는 것을 목적으로 합니다. 이 약관은 서비스에 대한 접근 및 사용 조건을 규정함으로써 이용자의 이익을 보호하고 최적의 서비스를 제공하기 위한 기준을 설정합니다.<br /><br />

          <strong>제 2 조 (용어의 정의)</strong><br />
          1. "서비스"란 회사가 제공하는 KREAM 웹사이트 및 모바일 앱을 통한 모든 상품 및 서비스를 의미합니다.<br />
          2. "회원"이란 본 약관에 동의하고 서비스를 이용하는 모든 사용자를 의미합니다.<br />
          3. "콘텐츠"란 서비스를 통해 접근 가능한 텍스트, 그래픽, 로고, 이미지, 비디오 클립, 다운로드 가능한 파일, 데이터 컴파일 및 소프트웨어를 포함한 모든 자료를 의미합니다.<br /><br />

          <strong>제 3 조 (서비스 이용)</strong><br />
          1. 회원은 서비스를 자유롭게 이용할 수 있으며, 이에 대한 자세한 서비스 이용 방법은 서비스 내 제공됩니다.<br />
          2. 회원은 서비스 이용 시 본 약관 뿐만 아니라 관련 법령, 서비스 이용안내 및 주의사항을 준수하여야 합니다.<br />
          3. 회원은 서비스 이용을 통해 얻은 정보를 개인적 목적으로만 사용할 수 있으며, 상업적 목적으로 사용할 경우 사전에 회사와의 서면 계약을 요구합니다.<br /><br />

          <strong>제 4 조 (이용 제한)</strong><br />
          1. 회원은 서비스 이용 중 발생하는 모든 행위와 그 결과에 대한 책임을 집니다.<br />
          2. 회사는 법적 분쟁이 예상되는 경우나 타인의 권리를 침해하는 경우 서비스 이용을 제한할 수 있습니다.<br />
          3. 회원이 서비스의 운영을 방해하는 행위를 할 경우, 예고 없이 서비스 이용을 중단할 수 있습니다.<br /><br />

          <strong>제 5 조 (회원의 의무)</strong><br />
          회원은 서비스 이용 시 다른 회원의 서비스 이용에 지장을 주는 행위를 하여서는 안 됩니다. 또한 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 복제, 배포, 방송 기타 방법에 의해 상업적으로 이용하거나 제3자에게 제공하는 행위도 금지됩니다.<br />
          회원은 서비스 이용 중 발견된 버그 및 오류, 기타 운영상의 문제를 회사에 즉시 보고해야 하며, 이를 악용하거나 공개하지 않아야 합니다.<br /><br />

          <strong>제 6 조 (회사의 의무)</strong><br />
          회사는 법령과 본 약관에 의거하여 지속적이고, 안정적인 서비스 제공을 위해 최선을 다합니다. 또한 회원의 개인정보 보호를 위해 개인정보 처리방침을 철저히 준수합니다.<br /><br />

          <strong>제 7 조 (계약 해지 및 이용 제한)</strong><br />
          회원이 서비스 이용 계약을 해지하고자 할 경우, 회원은 언제든지 서비스 내 제공되는 메뉴를 이용하여 이용 계약 해지 신청을 할 수 있습니다. 회사는 관련 법령이 정하는 바에 따라 회원의 이용 계약 해지 요청을 즉시 처리하여야 합니다.<br /><br />

          <strong>제 8 조 (분쟁 해결)</strong><br />
          본 약관의 해석에 관한 분쟁이 발생할 경우 대한민국 법령을 준거법으로 하며, 분쟁이 해결되지 않을 때는 서울중앙지방법원을 관할 법원으로 합니다.<br /><br />

          기타 자세한 사항은 회사 웹사이트의 고객센터를 통해 확인하실 수 있습니다.
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            mt: "20px",
            backgroundColor: "#333",
            color: "white",
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

export default Terms;

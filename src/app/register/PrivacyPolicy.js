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
        <Typography variant="h6" style={{ marginBottom: "20px", fontWeight: "bold", textAlign: "left" }}>
          <strong>개인정보 수집 및 이용 동의</strong>
        </Typography>
        <Typography variant="body2" style={{ lineHeight: "1.5", whiteSpace: "pre-line", textAlign: "left" }}>
          <strong>제 1 조 (개인정보의 수집 및 이용 목적)</strong><br />
          회사는 다음과 같은 목적을 위해 개인정보를 수집하고 이용합니다:<br />
          - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산<br />
          - 회원 관리<br />
          회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지<br />
          - 마케팅 및 광고에 활용<br />
          이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공<br /><br />

          <strong>제 2 조 (수집하는 개인정보의 항목)</strong><br />
          회사는 회원가입, 상담, 서비스 신청을 위해 아래와 같은 개인정보를 수집하고 있습니다:<br />
          - 필수항목: 이름, 로그인ID, 비밀번호, 휴대전화번호, 이메일, 접속 로그, 쿠키, 접속 IP 정보<br />
          - 선택항목: 주소, 결제 정보(결제 서비스 이용 시)<br /><br />

          <strong>제 3 조 (개인정보의 보유 및 이용 기간)</strong><br />
          회원의 개인정보는 회원가입 시점부터 서비스 이용 계약 해지 시까지 보유 및 이용됩니다. 다만, 관련 법령에 따른 정보보유 사유가 있을 경우 관련 법령에 따라 보유합니다.<br />
          - 계약 또는 청약철회 등에 관한 기록: 5년 보유<br />
          - 대금결제 및 재화 등의 공급에 관한 기록: 5년 보유<br />
          - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보유<br /><br />

          <strong>제 4 조 (개인정보의 파기절차 및 방법)</strong><br />
          회원의 개인정보는 원칙적으로 서비스 이용 계약 해지 후 지체 없이 파기합니다. 파기절차 및 방법은 다음과 같습니다:<br />
          - 파기절차<br />
          회원이 서비스 이용 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.<br />
          - 파기방법<br />
          전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다. 종이 문서에 기록된 개인정보는 분쇄기로 분쇄하거나 소각합니다.<br /><br />

          <strong>제 5 조 (개인정보 제공)</strong><br />
          회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 이용자의 사전 동의가 있는 경우나 법률의 특별한 규정이 있는 경우에 한하여 예외로 합니다.<br /><br />

          <strong>제 6 조 (이용자의 권리와 그 행사방법)</strong><br />
          - 정보주체는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.<br />
          - 개인정보의 오류 등이 있을 경우 정보주체는 그 정정을 요구할 수 있으며, 회사는 정정을 완료할 때까지 해당 개인정보를 이용하지 않습니다.<br /><br />

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

export default Terms;

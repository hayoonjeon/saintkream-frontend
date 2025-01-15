"use client";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import "./findpw.css"; // 외부 CSS 파일 임포트
import axios from "axios";
import { useRouter } from "next/navigation";

const FindPasswordPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true); 
  const [open, setOpen] = useState(false);
  const [isAuthCompleted, setIsAuthCompleted] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isAuthCodeBtnDisabled, setIsAuthCodeBtnDisabled] = useState(true);

  const phoneInputRef = useRef(null);

  useEffect(() => {
    // 페이지 로드 시 포커스를 휴대폰 번호 입력창으로 이동
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 7) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else {
      value = value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
    }
    setPhone(value);

    // 버튼 활성화 조건 확인
    setIsAuthCodeBtnDisabled(value.length < 13);
  };

  const handleAuthCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAuthCode(value);

    // 인증번호 입력 시 버튼 활성화
    setIsAuthCodeBtnDisabled(value.length !== 6); // 인증번호는 6자리
  };

  const handleSendPhoneAuth = async () => {
    if (!phone) {
      alert("휴대전화 번호를 입력하세요.");
      return;
    }
    console.log("phone:" + phone);
    try {
      const response = await axios.post('http://localhost:8080/members/send-phone-auth', null, {
        params: { phone: phone },
      });
      alert(response.data.message); // 성공 메시지 표시
    } catch (error) {
      console.error("휴대폰 인증 요청 오류:", error);
      alert("휴대폰 인증 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(value);
    setIsEmailValid(emailRegex.test(value));
    console.log("email 정규식 체크 : "+ emailRegex.test(value) );
    // 버튼 활성화 조건 확인
    setIsBtnDisabled(!(value && phone.length === 13));
  };

  const handleFindPassword = () => {
    console.log("비밀번호 찾기 실행! 입력한 번호:", phone, "이메일:", email);
    // 실제 로직 추가 가능
  };

  const handleVerifyPhoneAuth = async () => {
    if (!authCode) {
      alert("인증번호를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/members/verify-phone-auth', null, {
        params: { phone: phone, code: authCode },
      });

      alert(response.data.message); // 성공 메시지
      setIsAuthCompleted(true);
      const emailResponse = await axios.post('http://localhost:8080/members/find-email-by-phone', null, {
        params: { phone: phone },
      });

      alert(`가입된 이메일: ${emailResponse.data.email}`); // 이메일 표시
    } catch (error) {
      alert("인증번호 검증에 실패했습니다. 다시 시도해주세요.");
    }
  };



  const handleVerifyEmail = async () => {
    console.log("-----");
    if (!isAuthCompleted) {
      alert("휴대폰 인증이 필요합니다.")
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/members/match-phone-email', null, {
        params: { phone: phone, email: email },
      });
      alert(`메세지: ${response.data.message}`); // 이메일 표시
      setOpen(true);
    } catch (error) {
      alert("인증번호 검증에 실패했습니다. 다시 시도해주세요.");
    }
  }

  const handleClose = () => setOpen(false);
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    // 비밀번호가 일치하면 처리
    console.log('새 비밀번호:', password);
    const response = await fetch(`http://localhost:8080/members/updatePasswordByEmail`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          email: email,
          password: confirmPassword,
      }),
  });
  const data = await response.json();
    console.log("response:", data);
    alert(`비밀번호 변경 성공했습니다.`); // 이메일 표시
    router.push("/login");
    
    handleClose();
  };

  return (<>
    <div className="background_container">
      <div className="container">
        <div className="paper_card">
          <Typography variant="h4" className="title">
            비밀번호 찾기
          </Typography>
          <hr className="separator" />
          <Typography variant="body2" className="description">
            등록하신 휴대폰 번호와 이메일을 입력하시면, <br />
            휴대폰으로 임시 비밀번호를 전송해 드립니다.
          </Typography>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <label className="label">휴대폰 번호</label>
            <TextField
              variant="standard"
              fullWidth
              placeholder="가입하신 휴대폰 번호"
              value={phone}
              onChange={handlePhoneChange}
              inputRef={phoneInputRef}
              className="textField"
            />
            <label className="label">인증번호</label>
            <TextField
              variant="standard"
              fullWidth
              placeholder="인증번호 입력"
              value={authCode}
              onChange={handleAuthCodeChange}
              className="textField"
              disabled={!phone}
            />
            <label className="label">이메일 주소</label>
            <TextField
              variant="standard"
              fullWidth
              placeholder="예) kream@kream.co.kr"
              value={email}
              onChange={handleEmailChange}
              className="textFieldEmail"
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSendPhoneAuth}
              className={`button ${isAuthCodeBtnDisabled ? "buttonDisabled" : "buttonEnabled"}`}
              style={{ marginTop: "10px" }}
            >
              휴대폰 인증 요청
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={!phone}
              onClick={handleVerifyPhoneAuth}
              className={`button ${isAuthCodeBtnDisabled ? "buttonDisabled" : "buttonEnabled"}`}
              style={{ marginTop: "10px" }}
            >
              인증번호 확인
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={!isEmailValid}
              onClick={handleVerifyEmail}
              className={`button `}
              style={{ marginTop: "10px", height: "45px", background : "black" ,color : "white" }}
            >
              이메일 확인
            </Button>
          </form>
        </div>
      </div>
    </div>
    {
      open && <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 24,
          minWidth: 300
        }}
      >
        <Typography variant="h6" gutterBottom>
          비밀번호 변경
        </Typography>

        {/* 비밀번호 입력란 */}
        <TextField
          label="새 비밀번호"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />

        {/* 비밀번호 확인 입력란 */}
        <TextField
          label="비밀번호 확인"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
          error={!passwordMatch}
          helperText={passwordMatch ? '' : '비밀번호가 일치하지 않습니다.'}
        />

        {/* 제출 버튼 */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          style={{ marginTop: '10px',backgroundColor:"black" }}
        >
          비밀번호 변경
        </Button>
      </Box>
    </Modal>
    }

    </>
  );
};

export default FindPasswordPage;

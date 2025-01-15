"use client";
import { Button, TextField, Typography } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import "./findid.css"; // 외부 CSS 파일 임포트
import axios from "axios";
import { useRouter } from "next/navigation";

const FindEmailPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isAuthCodeBtnDisabled, setIsAuthCodeBtnDisabled] = useState(true);
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

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
    console.log("length"+value.length);
    console.log("length"+ value.length < 13);
    // 버튼 활성화 조건 확인
    setIsAuthCodeBtnDisabled(value.length < 13); // 13자리가 되어야 버튼 활성화
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

    try {
      const response = await axios.post(`${LOCAL_API_BASE_URL}/members/send-phone-auth`, null, {
        params: { phone: phone },
      });
      alert(response.data.message); // 성공 메시지 표시
    } catch (error) {
      console.error("휴대폰 인증 요청 오류:", error);
      alert("휴대폰 인증 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleVerifyPhoneAuth = async () => {
    if (!authCode) {
      alert("인증번호를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(`${LOCAL_API_BASE_URL}/members/verify-phone-auth`, null, {
        params: { phone: phone, code: authCode },
      });

      alert(response.data.message); // 성공 메시지

      const emailResponse = await axios.post(`${LOCAL_API_BASE_URL}/members/find-email-by-phone`, null, {
        params: { phone: phone },
      });

      alert(`가입된 이메일: ${emailResponse.data.email}`); // 이메일 표시
      router.push("/login");
    } catch (error) {
      alert("인증번호 검증에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="background_container">
      <div className="container">
        <div className="paper_card">
          <Typography variant="h4" className="title">
            이메일 아이디 찾기
          </Typography>
          <hr className="separator" />
          <Typography variant="body2" className="description">
            등록하신 휴대폰 번호를 입력하면 <br />
            이메일 주소의 일부를 알려드립니다.
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
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindEmailPage;

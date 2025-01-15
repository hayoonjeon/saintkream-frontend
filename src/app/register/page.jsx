"use client"
import { Button, Checkbox, FormControlLabel, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import Terms from './Terms';
import MarketingPolicy from './MarketingPolicy';
import PrivacyPolicy from './PrivacyPolicy';
import { useRouter } from 'next/navigation';
import './register.css'; // Import the CSS file

const RegisterPage = () => {
  const router = useRouter();
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const API_URL = `${LOCAL_API_BASE_URL}/members/register`;
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [authCode, setAuthCode] = useState(""); // 인증번호 입력값
  const [isPhoneVerified, setIsPhoneVerified] = useState(false); // 인증 완료 여부

  const initUser = {
    nickname : "",
    name: "",
    email: "",
    tel_no: "",
    password: "",
    confirmPassword: ""
  };

  const [user, setUser] = useState(initUser);
  const [agreements, setAgreements] = useState({
    all: false,
    age: false,
    terms: false,
    privacy: false,
    optionalPrivacy: false,
    optionalMarketing: false
  });

  // const isRegisterDisabled = !user.name || !user.email || !user.tel_no || !user.password || user.password !== user.confirmPassword || !agreements.age || !agreements.terms || !agreements.privacy;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'nickname') {
      setIsNicknameChecked(false); // 닉네임 수정 시 중복 확인 상태 초기화
    }
    if (name === 'email') {
      setIsEmailChecked(false); // 이메일 수정 시 중복 확인 상태 초기화
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 7) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else {
      value = value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
    }
    setUser(prev => ({ ...prev, tel_no: value }));
  };

  const handleVerifyPhoneAuth = async () => {
    if (!authCode) {
      alert("인증번호를 입력하세요.");
      return;
    }
  
    try {
      const response = await axios.post(`${LOCAL_API_BASE_URL}/members/verify-phone-auth`, null, {
        params: { phone: user.tel_no, code: authCode },
      });
      alert(response.data.message);
      setIsPhoneVerified(true); // 인증 성공
    } catch (error) {
      console.error("인증번호 검증 오류:", error);
      alert("인증번호 검증에 실패했습니다. 다시 시도해주세요.");
      setIsPhoneVerified(false); // 인증 실패
    }
  };

  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    if (name === "all") {
      setAgreements({
        all: checked,
        age: checked,
        terms: checked,
        privacy: checked,
        optionalPrivacy: checked,
        optionalMarketing: checked
      });
    } else {
      setAgreements(prev => ({
        ...prev,
        [name]: checked,
        all: prev.age && prev.terms && prev.privacy && checked // 모두 동의 업데이트
      }));
    }
  };

  const handleCheckNickname = async () => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/members/check-nickname`, {
        params: { nickname: user.nickname }
      });
      if (response.data) {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameChecked(true); // 닉네임 중복 확인 성공
      } else {
        alert("이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(false);
      }
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      alert("닉네임 확인 중 문제가 발생했습니다.");
      setIsNicknameChecked(false);
    }
  };

const handleCheckEmail = async () => {
  try {
    const response = await axios.get(`${LOCAL_API_BASE_URL}/members/check-email`, {
      params: { email: user.email }
    });
    if (response.data) {
      alert("사용 가능한 이메일입니다.");
      setIsEmailChecked(true); // 이메일 중복 확인 성공
    } else {
      alert("이미 사용 중인 이메일입니다.");
      setIsEmailChecked(false);
    }
  } catch (error) {
    console.error("이메일 중복 확인 오류:", error);
    alert("이메일 확인 중 문제가 발생했습니다.");
    setIsEmailChecked(false);
  }
};

const handleSendPhoneAuth = async () => {
  if (!user.tel_no) {
    alert("휴대전화 번호를 입력하세요.");
    return;
  }

  try {
    const response = await axios.post(`${LOCAL_API_BASE_URL}/members/send-phone-auth`, null, {
      params: { phone: user.tel_no },
    });
    alert(response.data.message); // 성공 메시지 표시
  } catch (error) {
    console.error("휴대폰 인증 요청 오류:", error);
    alert("휴대폰 인증 요청에 실패했습니다. 다시 시도해주세요.");
  }
};

const goServer = async () => {
  console.log("회원가입 데이터:", user); // 요청 데이터 확인

  try {
    const response = await axios.post(API_URL, user, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("서버 응답 알려줘!!!!:", response.data); // 서버 응답 데이터 확인

    // 응답 메시지 확인
    if (response.data.message === "회원가입 성공") {
      alert(response.data.message); // 성공 메시지 표시
      router.push("/login"); // 로그인 페이지로 이동
    } else {
      alert(response.data.message); // 실패 메시지 표시
    }
  } catch (error) {
    console.error("회원가입 요청 중 오류:", error.response?.data || error.message);
    alert("회원가입 요청에 실패했습니다. 다시 시도해주세요.");
  }
};

  const [openModal, setOpenModal] = useState(false);
  const [openMarketingPolicy, setOpenMarketingPolicy] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);

  return (
    <div className="register-container">
      <Paper elevation={0} className="register-paper">
        <Typography variant="h5" component="h1" className="register-title">
          회원가입
        </Typography>
        <form className="register-form">
          <label className="register-label">닉네임</label>
          <div className="input-group">
            <TextField variant="standard"
              name='nickname'
              value={user.nickname}
              onChange={handleChange}
              type="text"
              placeholder="닉네임을 입력하세요"
              className="text-field"
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#ffffff", // 원하는 바탕색 설정
                },
                "& .Mui-focused .MuiInputBase-root": {
                  backgroundColor: "#f0f0f0", // 포커스 시 바탕색 설정
                },
              }}
            />
            <Button
              type="button"
              variant="outlined"
              className="action-button"
              onClick={handleCheckNickname}
            >
              중복 확인
            </Button>
          </div>

          <label className="register-label">이메일 주소</label>
          <div className="input-group">
            <TextField variant="standard"
              name='email'
              value={user.email}
              onChange={handleChange}
              type="email"
              placeholder="예) ict@ict.com"
              className="text-field"
            />
            <Button
              type="button"
              variant="outlined"
              className="action-button"
              onClick={handleCheckEmail}
            >
              중복 확인
            </Button>
          </div>

          <label className="register-label">휴대전화 번호</label>
          <div className="input-group">
          <TextField
                variant="standard"
                name="tel_no"
                value={user.tel_no}
                onChange={handlePhoneChange}
                type="tel"
                disabled={!isNicknameChecked || !isEmailChecked}
                placeholder="010-1234-5678"
                className="text-field-phone"
              />
             <Button
                  type="button"
                  variant="outlined"
                  className="action-button tell_btn"
                  onClick={handleSendPhoneAuth}
                >
                  휴대폰 인증 요청
                </Button>
              </div>

               {/* 인증번호 입력 및 검증 */}
                <div className="input-group">
                  <TextField
                    variant="standard"
                    name="authCode"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    type="text"
                    placeholder="인증 번호를 입력하세요"
                    disabled={!user.tel_no}
                    className="text-field-phone"
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    className="action-button tell_btn"
                    onClick={handleVerifyPhoneAuth}
                    disabled={!user.tel_no || isPhoneVerified}
                  >
                    인증번호 확인
                  </Button>
                </div>     
          <label className="register-label">비밀번호</label>
          <TextField variant="standard"
            name='password'
            value={user.password}
            onChange={handleChange}
            type="password"
            placeholder="비밀번호를 입력하세요"
            disabled={!isNicknameChecked || !isEmailChecked}
            className="password-field"
          />
          <label className="register-label">비밀번호 확인</label>
          <TextField variant="standard"
            name='confirmPassword'
            value={user.confirmPassword}
            onChange={handleChange}
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            disabled={!isNicknameChecked || !isEmailChecked}
            className="confirm-password-field"
          />
          {user.password !== user.confirmPassword && user.confirmPassword && (
            <Typography className="password-error">
              비밀번호를 확인해주세요.
            </Typography>
          )}

          <div className="agreements-section">
            <FormControlLabel
              control={
                <Checkbox
                  name="all"
                  checked={agreements.all}
                  onChange={handleAgreementChange}
                  className="agreement-checkbox"
                />
              }
              label={<span className="agreements-label">모두 동의합니다</span>}
            />
            <div>
              <Typography variant="caption" className="agreements-caption">
                선택 동의항목 포함
              </Typography>
            </div>
            <div className="agreements-options">
              <FormControlLabel
                control={
                  <Checkbox
                    name="age"
                    checked={agreements.age}
                    onChange={handleAgreementChange}
                    className="agreement-checkbox"
                  />
                }
                label={<span className="agreement-label">[필수] 만 14세 이상입니다</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="terms"
                    checked={agreements.terms}
                    onChange={handleAgreementChange}
                    className="agreement-checkbox"
                  />
                }
                label={
                  <span className="agreement-label">
                    [필수] 이용약관 동의
                    <Button
                      onClick={() => setOpenModal(true)}
                      className="policy-button"
                    >
                      내용 보기
                    </Button>
                  </span>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="privacy"
                    checked={agreements.privacy}
                    onChange={handleAgreementChange}
                    className="agreement-checkbox"
                  />
                }
                label={
                  <span className="agreement-label">
                    [필수] 개인정보 수집 및 이용 동의
                    <Button
                      onClick={() => setOpenPrivacyPolicy(true)}
                      className="policy-button"
                    >
                      내용 보기
                    </Button>
                  </span>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="optionalMarketing"
                    checked={agreements.optionalMarketing}
                    onChange={handleAgreementChange}
                    className="agreement-checkbox"
                  />
                }
                label={
                  <span className="agreement-label">
                    [선택] 광고성 정보 수신 동의
                    <Button
                      onClick={() => setOpenMarketingPolicy(true)}
                      className="policy-button"
                    >
                      펼치기
                    </Button>
                  </span>
                }
              />
            </div>
          </div>
          <Button
            fullWidth
            variant='contained'
            // disabled={isRegisterDisabled}
            disabled={
              !agreements.age || // 만 14세 이상 동의 여부
              !agreements.terms || // 이용약관 동의 여부
              !agreements.privacy || // 개인정보 수집 동의 여부
              !isNicknameChecked || // 닉네임 중복 확인이 완료되지 않았을 때 비활성화
              !isEmailChecked || // 이메일 중복 확인이 완료되지 않았을 때 비활성화
              !isPhoneVerified || // 휴대폰 인증 여부
              !user.password ||
              user.password !== user.confirmPassword
            }
            className={`register-button ${user.password == user.confirmPassword ? 'disabled' : ''}`}
            onClick={goServer}>
            가입하기
          </Button>
          <Terms open={openModal} onClose={() => setOpenModal(false)} />
          <MarketingPolicy open={openMarketingPolicy} onClose={() => setOpenMarketingPolicy(false)} />
          <PrivacyPolicy open={openPrivacyPolicy} onClose={() => setOpenPrivacyPolicy(false)} />
        </form>
      </Paper>
    </div>
  );
};

export default RegisterPage;
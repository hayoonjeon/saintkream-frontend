"use client";
import { createTheme, ThemeProvider, TextField } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import './login.css';
import styles from './login.module.css'; // CSS 모듈 import
// zustand store 호출
import useAuthStore from "../../../store/authStore";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {
  const LOCAL_API_BASE_URL = "http://localhost:8080";
  const API_URL = `${LOCAL_API_BASE_URL}/members/login`;
  const router = useRouter(); // useRouter 초기화
  const { login } = useAuthStore(); // zustand login 함수 가져오기
  //const { user } = useAuthStore(); // zustand login 함수 가져오기

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  // 로그인 처리
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  // 로그인 요청 처리 -- 일반로그인
  const handleLogin = async () => {
    setIsLoading(true); // 로딩 상태 활성화
    try {
      const response = await axios.post(API_URL, credentials); // API 호출
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // JWT 토큰 저장
        alert("일반회원 로그인 성공!");
        //login(response.data.data, response.data.token); // Zustand에 사용자 정보 저장


        // 사용자 정보 저장
        const user = {
          member_id: response.data.data.member_id,
          email: response.data.data.email,
          nickname: response.data.data.nickname,
          name: response.data.data.name,
          tel_no: response.data.data.tel_no,
        };
        console.log("닉네임 확인:", user.nickname); // 로그로 닉네임 확인  
        login(user, response.data.token); // Zustand에 사용자 정보 저장


        router.push("/"); // 리디렉션
      } else {
        alert(response.data.message); // 실패 메시지 표시
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패. 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };
  //로그아웃 처리  -- 헤더탑에서 완료됨
  // const handleLogout = () => {
  //   localStorage.removeItem("token"); // 토큰 제거
  //   setIsLoggedIn(false); // 상태 업데이트
  //   alert("로그아웃되었습니다.");
  //   window.location.reload(); // 페이지 리로드 또는 라우팅
  // };

  // URL 쿼리 파라미터에서 토큰 확인 후 처리
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    // INACTIVE=1 쿼리가 있으면 탈퇴된 계정 안내
    const inactive = searchParams.get("INACTIVE");
    if (inactive === "1") {
      alert("탈퇴된 계정입니다. 더 이상 로그인할 수 없습니다.");
      return;
    }

   //로그아웃 처리  -- 현재 안되는거같음..
    const handleLogout = () => {
     localStorage.removeItem("token"); // 토큰 제거
     setIsLoggedIn(false); // 상태 업데이트
    alert("로그아웃되었습니다.");
     window.location.reload(); // 페이지 리로드 또는 라우팅
   };  


    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const provider = searchParams.get("provider");
    const member_id = searchParams.get("member_id");
    const adv_agree = searchParams.get("adv_agree");
    // const nickname = searchParams.get("nickname");

    if (token && username && email && name) {
      alert("로그인 성공");
      // 사용자 정보 생성
      const user = {
        username, email, name, provider, member_id, adv_agree

      };
      localStorage.setItem("token", token); // JWT 토큰 저장
      login(user, token); // Zustand 상태에 저장
      router.push("/"); // 홈으로 이동
    }
  }, [login, router]);

  // 이메일 입력 필드에 대한 참조 생성
  const emailInputRef = useRef(null);
  useEffect(() => {
    // 페이지 로드 시 이메일 입력 필드에 포커스
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);
  // 네이버 로그인
  const handleNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  };
  // 카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };
  // 구글 로그인
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // TextField 커스텀
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInput-underline:before': {
            borderBottom: '2px solid #ccc', // 비활성 상태의 border
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #000000', // 호버 상태의 border
          },
          '& .MuiInput-underline:after': {
            borderBottom: '3px solid #000000', // 포커스 상태의 border
          },
        },
      },
    },
  },
});
  return (
    <div className="loginbackground_container">
      <div className="loginall_container">
        <div className="paper_card">
          <div className={styles.container}>
            <div className={styles.maxwidth_contain}>
              <img
                src="./images/HY_logo.png"
                alt="Logo"
                className={styles.logo}
              />

              <form
                className={styles.formContainer}
              >
                <label
                  className={styles.label}
                >
                  이메일 주소
                </label>
                <ThemeProvider theme={theme}>
                  <TextField
                    variant="standard"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    type="text"
                    placeholder="예) ict@ict.com"
                    inputRef={emailInputRef}
                    className={styles.textField}
                  />
                </ThemeProvider>
                <label
                  className={styles.label}
                >
                  비밀번호
                </label>
                <ThemeProvider theme={theme}>
                  <TextField
                    variant="standard"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    className={styles.textField}
                  />
                </ThemeProvider>
                {/* 로그인 버튼 */}
                <button
                  fullWidth
                  variant="contained"
                  disabled={!credentials.email || !credentials.password || isLoading}
                  onClick={handleLogin}
                  className={credentials.email || credentials.password ? `${styles.loginButton} ${styles.loginButtonDisabled}` : styles.loginButton}
                >
                  {isLoading ? "로그인 중..." : "로그인 버튼"}
                </button>

                <div
                  className={styles.linkContainer}
                >
                  <a href="/register" className={styles.link}>
                    회원가입
                  </a>
                  <a>|</a>
                  <a href="/findid" className={styles.link}>
                    아이디 찾기
                  </a>
                  <a>|</a>
                  <a href="/findpw" className={styles.link}>
                    비밀번호 찾기
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleNaverLogin}
                  className={`${styles.snsLoginButton} ${styles.snsLoginButtonNaver}`}
                >
                  <img
                    src="./images/HY_naverlogo.png"
                    alt=""
                  />
                  네이버로 로그인
                </button>
                <button
                  type="button"
                  onClick={handleKakaoLogin}
                  className={`${styles.snsLoginButton} ${styles.snsLoginButtonKakao}`}
                >
                  <img
                    src="./images/HY_kakaologo.png"
                    alt=""
                  />
                  카카오로 로그인
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`${styles.snsLoginButton} ${styles.snsLoginButtonGoogle}`}
                >

                  <img
                    src="./images/HY_googlelogo.png"
                    alt=""
                  />
                  구글로 로그인
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
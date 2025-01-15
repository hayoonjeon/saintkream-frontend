"use client";
import { usePathname } from "next/navigation";
import MyPageSideNav from "../components/MyPageSideNav";
import "./myPageLoginInfo.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import useAuthStore from "../../../store/authStore";
import axios from "axios";

function Page(props) {
    const pathname = usePathname();
    const { user, login } = useAuthStore();
    const [phone, setPhone] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [advAgree, setAdvAgree] = useState(null); // 광고성 정보 수신 기본값 false
    const LOCAL_API_BASE_URL = "http://localhost:8080";

    /** 
     * 1. 회원 정보 통합으로 가져오기
     */
    useEffect(() => {
        const fetchMemberInfo = async () => {
            
            if (!user?.email) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${LOCAL_API_BASE_URL}/members/userInfo`, {
                    params: { email: user.email }, // 서버에서 회원 식별
                });
                if (response.data) {
                    // 휴대폰 번호 설정
                    setPhone(response.data.tel_no || "");
                    // 광고성 정보 수신 여부 설정 (1 -> true, 0/null -> false)
                   setAdvAgree(response.data.adv_agree === 1 || response.data.adv_agree === "1");
                    //setAdvAgree(response.data.adv_agree === 1 );
                    // 전역 상태(Zustand)에도 필요한 정보 업데이트
                    login({
                        ...user,
                        phone: response.data.tel_no,
                    });
                }
            } catch (error) {
                console.error("회원 정보를 가져오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
                console.log("Updated advAgree:", advAgree);
            }
        };

        fetchMemberInfo();
    }, [user?.email, login]);

    /** 
     * 2. 비밀번호 변경 시 기존 비밀번호 확인
     */
    const handlePasswordChange = async (value) => {
        setOldPassword(value);
        if (!value) {
            setPasswordMessage("");
            setIsPasswordError(false);
            return;
        }
        try {
            const response = await axios.post(`${LOCAL_API_BASE_URL}/members/check-password`, {
                email: user.email,
                oldPassword: value,
            });
            if (response.data) {
                setIsPasswordError(false);
                setPasswordMessage("비밀번호가 확인되었습니다.");
            } else {
                setIsPasswordError(true);
                setPasswordMessage("비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error("비밀번호 확인 오류:", error);
            setIsPasswordError(true);
            setPasswordMessage("서버 오류로 요청이 실패했습니다.");
        }
    };

    /** 
     * 3. 광고성 정보 수신 토글
     */
    const toggleSwitch = async () => {
        const newAdvAgree = !advAgree; // 기존 값을 토글
        try {
            const response = await fetch(`${LOCAL_API_BASE_URL}/members/updateAdvAgree`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    member_id: user.member_id,
                    adv_agree: newAdvAgree ? 1 : 0,
                }),
            });
            const result = await response.json();

            if (response.ok && result.success) {
                setAdvAgree(newAdvAgree);
            } else {
                alert("광고성 정보 수신 상태 업데이트에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("서버와의 통신에 문제가 발생했습니다.");
        }
    };

    /** 
     * 4. 휴대폰 인증 관련 함수들
     */
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length <= 3) {
            // do nothing
        } else if (value.length <= 7) {
            value = value.slice(0, 3) + "-" + value.slice(3);
        } else {
            value = value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
        }
        setPhone(value);
    };

    const handleSendPhoneAuth = async () => {
        if (!phone) {
            alert("휴대전화 번호를 입력하세요.");
            return;
        }
        try {
            const response = await axios.post(`${LOCAL_API_BASE_URL}/members/send-phone-auth`, null, {
                params: { phone },
            });
            alert(response.data.message);
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
                params: { phone, code: authCode },
            });
            alert(response.data.message);
            setIsPhoneVerified(true);
        } catch (error) {
            console.error("인증번호 검증 오류:", error);
            alert("인증번호 검증에 실패했습니다. 다시 시도해주세요.");
            setIsPhoneVerified(false);
        }
    };

    /** 
     * 5. 로딩 상태
     */
    if (loading || advAgree === null) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="myPageLoginInfo">
            <div className="container my lg">
                <MyPageSideNav currentPath={pathname} />
                <div className="content_area my-page-content">
                    <div className="my_profile">
                        <div className="content_title border">
                            <div className="main_title">
                                <h3>로그인 정보</h3>
                            </div>
                        </div>

                        <div className="profile_info">
                            {/* 내 계정 */}
                            <div className="profile_group first">
                                <h4 className="group_title">내 계정</h4>
                                {/* 이메일 */}
                                <div className="unit">
                                    <h5 className="title">이메일 주소</h5>
                                    <div className="unit_content">
                                        <p className="desc email">{user?.email || "정보 없음"}</p>
                                        <button type="button" className="btn btn_modify outlinegrey small">
                                            변경불가
                                        </button>
                                    </div>
                                </div>
                                {/* 비밀번호 */}
                                <div className="unit">
                                    <h5 className="title">비밀번호</h5>
                                    <div className="unit_content">
                                        <input
                                            type="password"
                                            placeholder="이전 비밀번호 입력"
                                            value={oldPassword}
                                            onChange={(e) => handlePasswordChange(e.target.value)}
                                            className={`desc password ${isPasswordError ? "input-error" : ""}`}
                                        />
                                        <div className="unit_content" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="새로운 비밀번호 입력"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="desc password"
                                                style={{ flex: 1 }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="btn btn_modify outlinegrey small"
                                                style={{ whiteSpace: "nowrap", top: "10px" }}
                                            >
                                                {showNewPassword ? "숨기기" : "보기"}
                                            </button>
                                        </div>
                                        <div style={{ alignSelf: "flex-end", marginTop: "50px" }}>
                                            <div style={{ alignSelf: "flex-end" }}>
                                                <button
                                                    type="button"
                                                    style={{top: "55px"}}
                                                    className="btn btn_modify outlinegrey small"
                                                    onClick={async () => {
                                                        if (!newPassword.trim()) {
                                                            alert("새로운 비밀번호를 입력하세요.");
                                                            return;
                                                        }
                                                        const userConfirmed = window.confirm("새로운 비밀번호로 변경하시겠습니까?");
                                                        if (userConfirmed) {
                                                            try {
                                                                const response = await fetch(`${LOCAL_API_BASE_URL}/members/updatePassword`, {
                                                                    method: "POST",
                                                                    headers: {
                                                                        "Content-Type": "application/json",
                                                                    },
                                                                    body: JSON.stringify({
                                                                        member_id: user.member_id,
                                                                        password: newPassword,
                                                                    }),
                                                                });
                                                                if (!response.ok) {
                                                                    throw new Error("비밀번호 변경에 실패했습니다.");
                                                                }
                                                                const result = await response.json();
                                                                if (result.success) {
                                                                    alert("비밀번호가 성공적으로 변경되었습니다.");
                                                                } else {
                                                                    alert("비밀번호 변경 중 문제가 발생했습니다.");
                                                                }
                                                            } catch (error) {
                                                                console.error(error);
                                                                alert("서버와의 통신에 문제가 발생했습니다.");
                                                            }
                                                        } else {
                                                            alert("비밀번호 변경이 취소되었습니다.");
                                                        }
                                                    }}
                                                    disabled={oldPassword === "" || isPasswordError || !newPassword.trim()}
                                                >
                                                    저장
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* 메시지 표시 */}
                                    {passwordMessage && (
                                        <p
                                            style={{
                                                color: isPasswordError ? "red" : "green",
                                                marginTop: "5px",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {passwordMessage}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 개인 정보 (휴대폰번호) */}
                            <div className="profile_group">
                                <h4 className="group_title">개인 정보</h4>
                                <div className="unit">
                                    <h5 className="title">휴대폰 번호</h5>
                                    <div className="unit_content">
                                        <input type="text" value={phone} onChange={handlePhoneChange} className="desc" />
                                        <button
                                            type="button"
                                            className="btn btn_modify outlinegrey small"
                                            onClick={handleSendPhoneAuth}
                                            disabled={isPhoneVerified}
                                        >
                                            인증 요청
                                        </button>
                                    </div>
                                    {/* 인증번호 입력 및 확인 */}
                                    <div className="unit_content" style={{ marginTop: "10px" }}>
                                        <input
                                            type="text"
                                            value={authCode}
                                            onChange={(e) => setAuthCode(e.target.value)}
                                            placeholder="인증번호 입력"
                                            disabled={!phone}
                                            className="desc"
                                        />{" "}
                                        <button
                                            type="button"
                                            className="btn btn_modify outlinegrey small"
                                            onClick={handleVerifyPhoneAuth}
                                            disabled={!phone || isPhoneVerified}
                                        >
                                            인증 확인
                                        </button>
                                    </div>
                                    {/* 번호 수정 */}
                                    {isPhoneVerified && (
                                        <div className="unit_content" style={{ marginTop: "25px" }}>
                                            <button
                                                type="button"
                                                className="btn btn_modify outlinegrey small"
                                                onClick={async () => {
                                                    try {
                                                        const response = await fetch(`${LOCAL_API_BASE_URL}/members/updatePhone`, {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                            },
                                                            body: JSON.stringify({
                                                                member_id: user.member_id,
                                                                tel_no: phone,
                                                            }),
                                                        });
                                                        const result = await response.json();

                                                        if (response.ok && result.success) {
                                                            alert("휴대폰 번호가 성공적으로 변경되었습니다.");
                                                        } else {
                                                            alert("휴대폰 번호 변경에 실패했습니다.");
                                                        }
                                                    } catch (error) {
                                                        console.error(error);
                                                        alert("서버와의 통신에 문제가 발생했습니다.");
                                                    }
                                                }}
                                            >
                                                번호 수정
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 광고성 정보 수신 */}
                            <div className="profile_group">
                                <h4 className="group_title">광고성 정보 수신</h4>
                                <div className="unit unit--toggle" style={{ paddingBottom: "8px" }}>
                                    <div className="unit_content">
                                        <p className="desc my-profile__term-desc">
                                            <span>개인 정보 수집 및 이용 동의</span>
                                            <button type="button" className="btn">
                                                내용보기
                                            </button>
                                        </p>
                                        {advAgree === null ? (
                                            <div>스위치 로딩 중...</div>
                                        ) : (
                                            <div
                                                className={`base-switch ${advAgree ? "is-active" : ""}`}
                                                onClick={toggleSwitch}
                                                style={{
                                                    "--75b83bce": "#e4e4e4",
                                                    "--30d0adec": "#fff",
                                                    "--6d656928": "#222222",
                                                }}
                                            >
                                                <div className="circle"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Link href="/myPageLoginInfoWithdrawal" className="btn_withdrawal">
                                회원 탈퇴
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;

"use client";
import Link from "next/link";
import MyPageSideNav from "../components/MyPageSideNav";
import "./myPageLoginInfoWithdrawal.css";
import { useState } from "react";
import axios from "axios"; // 비밀번호 검증 및 탈퇴 요청에 사용
import useAuthStore from "../../../store/authStore";
import { useRouter } from "next/navigation";


function Page(props) {
    const [isChecked, setIsChecked] = useState(false); // 체크박스 상태 관리
    const [oldPassword, setOldPassword] = useState(""); // 이전 비밀번호 입력값
    const [isPasswordError, setIsPasswordError] = useState(false); // 비밀번호 에러 상태
    const [passwordMessage, setPasswordMessage] = useState("");   // 비밀번호 에러 메시지
    const { user, login, logout } = useAuthStore();
    const LOCAL_API_BASE_URL = "http://localhost:8080";
    const router = useRouter(); // Next.js 전용 useRouter 훅

    // 체크박스 상태 변경
    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    // 이전 비밀번호 입력 변경 시
    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
        // 상태 초기화
        setIsPasswordError(false);
        setPasswordMessage("");
    };

    // 탈퇴 버튼 클릭 시 로직
    const handleWithdrawal = async (e) => {
        e.preventDefault(); // a 태그 클릭 시 페이지 이동 방지 (or use button)
        if (!isChecked) {
            alert("회원탈퇴 안내에 동의해야 탈퇴가 가능합니다.");
            return;
        }

        if (!oldPassword.trim()) {
            alert("이전 비밀번호를 입력하세요.");
            return;
        }

        try {
            // 1) 이전 비밀번호 검증
            const checkResponse = await axios.post(`${LOCAL_API_BASE_URL}/members/check-password`, {
                email: user.email, // 실제 로그인된 사용자 이메일 사용
                oldPassword: oldPassword,
            });

            if (!checkResponse.data) {
                // 비밀번호 불일치
                setIsPasswordError(true);
                setPasswordMessage("이전 비밀번호가 일치하지 않습니다.");
                return;
            }

            // 2) 비밀번호 일치 시, 탈퇴 로직
            const withdrawResponse = await axios.post(`${LOCAL_API_BASE_URL}/members/withdraw`, {
                member_id: user.member_id, // 실제 로그인된 사용자 이메일
            });

            // 서버 응답 예시에 따라 처리 (성공/실패)
            if (withdrawResponse.data.success) {
                alert("회원 탈퇴가 완료되었습니다.");
                // TODO: 탈퇴 완료 후 메인 페이지로 이동 etc.
                         // 여기서 user 상태 초기화
                // Zustand에서 login({}) 또는 null 등으로 비워줌
                login({}); // 혹은 login(null); 등 원하는 형태로 초기화
                logout();

                // 이후 홈("/") 페이지로 이동
                router.push("/");
            } else {
                alert("회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
            }

        } catch (error) {
            console.error("탈퇴 처리 중 오류:", error);
            alert("서버와의 통신에 문제가 발생했습니다.");
        }
    };

    return (
        <div className="myPageLoginInfoWithdrawal">
            <div className="container my lg">
                <MyPageSideNav />
                <div className="content_area my-page-content">
                    <div className="my_withdrawal">
                        <div className="content_title">
                            <div className="main_title">
                                <h3>회원탈퇴</h3>
                            </div>
                        </div>
                        {/* 타이틀 끝 */}
                        <div className="content">
                            <div className="withdrawal_wrap">
                                <div>
                                    <h4 className="withdrawal_title">
                                        회원탈퇴에 앞서 아래 내용을 반드시 확인해 주세요.
                                    </h4>

                                    {/* --- 기존 안내 사항(생략) --- */}
                                    <div className="withdrawal_terms" >
                                        <div className="terms_box" >
                                            <h5 className="terms_title" >
                                                <div className="checkbox_item"  >
                                                    <input id="title0" type="checkbox" name="" className="blind" />
                                                    <label htmlFor="title0" className="check_label" >
                                                        <span className="label_txt" >Saint Kream을 탈퇴하면 회원 정보 및 서비스 이용 기록이 삭제됩니다.</span>
                                                    </label>
                                                </div>
                                            </h5>
                                            <div className="terms_detail" >
                                                <ul className="terms_list" >
                                                    <li className="terms_item" > 내 프로필, 거래내역(구매/판매), 관심상품 등 사용자의 모든 정보가 사라지며 재가입 하더라도 복구가 불가능합니다. </li>
                                                    <li className="terms_item" > 탈퇴 14일 이내 재가입할 수 없으며, 탈퇴 후 동일 이메일로 재가입할 수 없습니다 </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="terms_box" >
                                            <h5 className="terms_title" >
                                                <div className="checkbox_item"  >
                                                    <input id="title1" type="checkbox" name="" className="blind" />
                                                    <label htmlFor="title1" className="check_label" >
                                                        <span className="label_txt" >관련 법령 및 내부 기준에 따라 별도 보관하는 경우에는 일부 정보가 보관될 수 있습니다.</span>
                                                    </label>
                                                </div>
                                            </h5>
                                            <div className="terms_detail" >
                                                <h6 className="terms_subtitle" > 1. 전자상거래 등 소비자 보호에 관한 법률 </h6>
                                                <ul className="terms_list" >
                                                    <li className="terms_item" > 계약 또는 청약철회 등에 관한 기록: 5년 보관 </li>
                                                    <li className="terms_item" > 대금결제 및 재화 등의 공급에 관한 기록: 5년 보관 </li>
                                                    <li className="terms_item" > 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 보관 </li>
                                                </ul>
                                            </div>
                                            <div className="terms_detail" >
                                                <h6 className="terms_subtitle" > 2. 통신비밀보호법 </h6>
                                                <ul className="terms_list" >
                                                    <li className="terms_item" > 접속 로그 기록: 3개월 보관 </li>
                                                </ul>
                                            </div>
                                            <div className="terms_detail" >
                                                <h6 className="terms_subtitle" > 3. 내부 기준에 따라 별도 보관 </h6>
                                                <ul className="terms_list" >
                                                    <li className="terms_item" > 부정이용 방지를 위해 이름, 이메일(로그인ID), 휴대전화번호, CI/DI: 3년 보관 </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="terms_box" >
                                            <h5 className="terms_title" >
                                                <div className="checkbox_item"  >
                                                    <input id="title2" type="checkbox" name="" className="blind" />
                                                    <label htmlFor="title2" className="check_label" >
                                                        <span className="label_txt" >Saint Kream 탈퇴가 제한된 경우에는 아래 내용을 참고하시기 바랍니다.</span>
                                                    </label>
                                                </div>
                                            </h5>
                                            <div className="terms_detail" >
                                                <ul className="terms_list" >
                                                    <li className="terms_item" > 진행 중인 거래(판매/구매)가 있을 경우: 해당 거래 종료 후 탈퇴 가능 </li>
                                                    <li className="terms_item" > 이용 정지 상태인 경우: 이용 정지 해제 후 탈퇴 가능 </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="withdrawal_check">
                                        <div className="checkbox_item">
                                            <input
                                                id="check1"
                                                type="checkbox"
                                                className="blind"
                                                checked={isChecked}
                                                onChange={toggleCheckbox}
                                            />
                                            <label htmlFor="check1" className="check_label_on">
                                                {isChecked ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        className="ico-close icon sprite-icons"
                                                    >
                                                        <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        className="ico-uncheck icon sprite-icons"
                                                    >
                                                        <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm16 400c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352c8.8 0 16 7.2 16 16v352z" />
                                                    </svg>
                                                )}
                                                <span className="label_txt_on">
                                                    회원탈퇴 안내를 모두 확인하였으며 탈퇴에 동의합니다.
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* (추가) 이전 비밀번호 입력 */}
                                    <div style={{ marginTop: "20px" }}>
                                        <label>이전 비밀번호 확인</label>
                                        <input
                                            type="password"
                                            value={oldPassword}
                                            onChange={handleOldPasswordChange}
                                            placeholder="현재 비밀번호 입력"
                                            style={{
                                                display: "block",
                                                marginTop: "5px",
                                                padding: "8px",
                                                width: "300px",
                                            }}
                                        />
                                        {isPasswordError && (
                                            <p style={{ color: "red", marginTop: "5px" }}>{passwordMessage}</p>
                                        )}
                                    </div>

                                    <div className="withdrawal_btn_box">
                                        {/* 탈퇴하기 버튼 */}
                                        <a
                                            href="#"
                                            onClick={handleWithdrawal}
                                            className={`btn outlinegrey medium ${isChecked ? "" : "disabled"}`}
                                            style={{
                                                pointerEvents: isChecked ? "auto" : "none",
                                                opacity: isChecked ? 1 : 0.5,
                                            }}
                                        >
                                            탈퇴하기
                                        </a>
                                        {/* 취소하기 버튼 */}
                                        <Link href="/myPageLoginInfo" className="btn solid medium">
                                            취소하기
                                        </Link>
                                    </div>
                                    <div className="layer_withdrawal layer lg" style={{ display: "none" }}>
                                        <div className="layer-background" >
                                        </div>
                                        <div className="layer_container" >
                                            <a href="#" className="btn_layer_close">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="ico-close icon sprite-icons">
                                                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                                </svg>
                                            </a>
                                            <div className="layer_header">
                                                <h2 className="title"> 정말 탈퇴하시겠습니까? </h2>
                                            </div>
                                            <div className="layer_content" >
                                                <p className="withdrawal_desc">탈퇴하기 클릭 시 바로 탈퇴 처리됩니다.<br />탈퇴 후 14일 이내 재가입할 수 없으며,<br />재가입 시 동일 이메일을 사용할 수 없습니다.</p>
                                                <div className="withdrawal_btn_box"  >
                                                    <button type="button" className="btn solid medium" > 취소하기 </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="layer_withdrawal layer lg" style={{ display: "none" }} >
                                        <div className="layer-background" >
                                        </div>
                                        <div className="layer_container" >
                                            <a href="#" className="btn_layer_close"  >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="ico-close icon sprite-icons">
                                                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                                </svg>
                                            </a>
                                            <div className="layer_header" >
                                                <h2 className="title"  > 회원 탈퇴가 완료되었습니다. </h2>
                                            </div>
                                            <div className="layer_content" >
                                                <p className="withdrawal_desc"  >그동안 서비스를 이용해 주셔서 감사합니다.<br />14일 후 KREAM을 다시 이용할 수 있습니다.</p>
                                                <div className="withdrawal_btn_box"  >
                                                    <button type="button" className="btn outlinegrey medium" > 확인 </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="layer_withdrawal layer lg" style={{ display: "none" }}>
                                        <div className="layer-background" >
                                        </div>
                                        <div className="layer_container" >
                                            <a href="#" className="btn_layer_close"  >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="ico-close icon sprite-icons">
                                                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                                </svg>
                                            </a>
                                            <div className="layer_header" >
                                                <h2 className="title"  >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="ico-close icon sprite-icons">
                                                        <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                                    </svg> 탈퇴 불가한 회원입니다. </h2>
                                            </div>
                                            <div className="layer_content" >
                                                <p className="withdrawal_desc unable_desc"  >아래 사유가 확인되어 탈퇴가 제한됩니다.</p>
                                                <ul className="withdrawal_list"  ></ul>
                                                <div className="withdrawal_btn_box"  >
                                                    <button type="button" className="btn outlinegrey medium"> 확인 </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Page;
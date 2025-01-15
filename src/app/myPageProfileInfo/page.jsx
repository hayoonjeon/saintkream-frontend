"use client";
import { usePathname } from 'next/navigation';
import MyPageSideNav from '../components/MyPageSideNav';
import './myPageProfileInfo.css';
import { useEffect, useRef, useState } from 'react';
import useAuthStore from "../../../store/authStore";
import axios from 'axios';

function Page(props) {
    const pathname = usePathname();

    const API_BASE_URL = "http://localhost:8080"; // 백엔드 서버 URL
    const { user, login } = useAuthStore(); // Zustand에서 user 가져오기

    const [isEditing, setIsEditing] = useState(false); // 프로필 변경 상태 관리
    const [editingField, setEditingField] = useState(null); // 현재 수정 중인 필드
    
    // const [profileName, setProfileName] = useState(localStorage.getItem("profileName") || user?.nickname || "사용자 닉네임"); // 로컬스토리지에서 가져옴
    //const [userName, setUserName] = useState(localStorage.getItem("userName") || user?.name || "사용자 이름"); // 로컬스토리지에서 가져옴
    //const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || user?.profile_image || "/images/JH_userImg.png"); // 로컬스토리지에서 가져옴
    const [profileName, setProfileName] = useState(user?.nickname || "사용자 닉네임"); // 초기값 설정
    const [userName, setUserName] = useState(user?.name || "사용자 이름");
    const [profileImage, setProfileImage] = useState(user?.profile_image || "/images/JH_userImg.png");    

    const profileNameInputRef = useRef(null);
    const userNameInputRef = useRef(null);
    const fileInputRef = useRef(null); // 파일 입력 ref 추가


    useEffect(() => {
        if (user) {
            // 로그인한 사용자의 상태에 따라 닉네임 초기화
            setProfileName(user.nickname || "사용자 닉네임");
            setUserName(user.name || "사용자 이름");
             //setProfileImage(user.profile_image || "/images/JH_userImg.png");
             if (user.profile_image) {
                setProfileImage(user.profile_image.startsWith("http")
                    ? user.profile_image // 절대 경로 그대로 사용
                    : `${API_BASE_URL}${user.profile_image}`); // 상대 경로 처리
            } else {
                setProfileImage("/images/JH_userImg.png"); // 기본 이미지
            }
        }
    }, [user]); // user 상태가 변경될 때 실행
    

    // 로컬 스토리지에 데이터 저장 함수
    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, value);
    };

    const handleEditClick = (field) => {
        setIsEditing(true);
        setEditingField(field); // 수정 중인 필드 설정
        if (field === "profileName") {
            setTimeout(() => profileNameInputRef.current?.focus(), 0);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false); // 수정 상태 종료
        setEditingField(null); // 수정 중인 필드 초기화
    };

    const handleSaveClick = async () => {
        if (editingField === "profileName") {
            try {
                const response = await axios.put(`${API_BASE_URL}/members/update-nickname`, {
                    email: user.email, // 사용자 이메일
                    newNickname: profileName, // 새로운 닉네임
                });

                if (response.status === 200 && response.data.status === "success") {
                    // saveToLocalStorage("profileName", profileName); // 로컬스토리지에 저장
                    login({ ...user, nickname: profileName }, user.token); // Zustand 상태 업데이트
                    alert("닉네임이 성공적으로 변경되었습니다.");
                } else {
                    alert("닉네임 변경 실패: " + response.data.message);
                }
            } catch (error) {
                console.error("닉네임 변경 중 오류:", error);
                alert("닉네임 변경 중 오류가 발생했습니다.");
            }
        }

        setIsEditing(false); // 수정 상태 종료
        setEditingField(null); // 수정 중인 필드 초기화
    };

    // 서버에서 최신 유저 정보를 가져오는 함수
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/members/get-profile`, {
                params: { email: user?.email },
            });

            if (response.data.status === "success") {
                const userData = response.data.user;
                const absoluteImageUrl = `${userData.profile_image}`; // 절대 경로로 변환

                saveToLocalStorage("profileName", userData.nickname);
                saveToLocalStorage("userName", userData.name);
                saveToLocalStorage("profileImage", absoluteImageUrl);

                setProfileName(userData.nickname);
                setUserName(userData.name);
                setProfileImage(absoluteImageUrl);

                login({ ...user, ...userData, profile_image: absoluteImageUrl }, user.token);
                alert("프로필 정보가 성공적으로 업데이트되었습니다.");
            } else {
                console.error("프로필 정보를 가져오지 못했습니다.");
            }
        } catch (error) {
            console.error("프로필 정보 로드 중 오류:", error);
        }
    };


    useEffect(() => {
        if (user && user.email) {
            fetchUserData(); // 유저가 유효할 경우 데이터 가져오기

        } else {
            console.error("로그인이 필요합니다.");
        }
    }, [user]);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!user || !user.email) {
            alert("로그인이 필요합니다.");
            return;
        }

        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            alert("지원되지 않는 파일 형식입니다. JPG, PNG, GIF 파일만 업로드할 수 있습니다.");
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert("파일 크기가 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", user.email);

        try {
            const response = await axios.post(`${API_BASE_URL}/members/upload-profile-image`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.status === "success") {
                const imageUrl = response.data.imageUrl.startsWith("http")
                ? response.data.imageUrl
                : `${API_BASE_URL}${response.data.imageUrl}`;



                setProfileImage(imageUrl);
                login({ ...user, profile_image: imageUrl }, user.token);
                alert("프로필 이미지가 성공적으로 변경되었습니다.");
            } else {
                alert("이미지 업로드 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("이미지 업로드 중 오류:", error);
            alert("이미지 업로드 중 오류가 발생했습니다.");
        }
    };

    const handleImageDelete = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/members/delete-profile-image`, { email: user.email });

            if (response.data.status === "success") {
                const defaultImage = "/images/JH_userImg.png";
                saveToLocalStorage("profileImage", defaultImage);
                setProfileImage(defaultImage);
                login({ ...user, profile_image: defaultImage }, user.token);
                alert("프로필 이미지가 기본값으로 초기화되었습니다.");
            } else {
                alert("이미지 삭제 실패: " + response.data.message);
            }
        } catch (error) {
            console.error("이미지 삭제 중 오류:", error);
            alert("이미지 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className='myPageProfileInfo'>
            <div className='container my lg'>
                <MyPageSideNav currentPath={pathname} />
                <div className='content_area my-page-content'>
                    <div className='my_profile'>
                        <div className='content_title border'>
                            <div className='main_title'>
                                <h3>프로필 관리</h3>
                            </div>
                        </div>
                        <div className='user_profile'>
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept='image/*'
                                onChange={handleImageChange}
                            />
                            <div className='profile_thumb'>
                                <img
                                    //src={`http://localhost:8080${profileImage}`}
                                    src={
                                        profileImage.startsWith("http") // profileImage가 절대 경로인지 확인
                                            ? profileImage // 이미 절대 경로라면 그대로 사용
                                            : `${API_BASE_URL}${profileImage}` // 상대 경로라면 BASE_URL 추가
                                    }
                                    alt="사용자 이미지"
                                    className="thumb_img"
                                />
                            </div>
                            <div className='profile_detail'>
                                <strong className='name'>{profileName}</strong>
                                <div className='profile_btn_box'>
                                    <button
                                        type="button"
                                        className='btn outlinegrey small'
                                        onClick={() => fileInputRef.current?.click()}
                                    > 이미지 변경 </button>
                                    <button
                                        type="button"
                                        className='btn outlinegrey small'
                                        onClick={handleImageDelete}
                                    > 삭제 </button>
                                </div>
                            </div>
                        </div>
                        <div className='profile_info'>
                            <div className='profile_group first'>
                                <h4 className='group_title'>프로필 정보</h4>
                                {isEditing && editingField === "profileName" ? (
                                    <div className="modify name">
                                        <div className="input_box">
                                            <h6 className="input_title">프로필 이름</h6>
                                            <div className="input_item">
                                                <input
                                                    ref={profileNameInputRef}
                                                    type="text"
                                                    value={profileName}
                                                    onChange={(e) => setProfileName(e.target.value)}
                                                    placeholder="나만의 프로필 이름"
                                                    autoComplete="off"
                                                    maxLength="25"
                                                    className="input_txt"
                                                />
                                            </div>
                                        </div>
                                        <div className="modify_btn_box">
                                            <button
                                                type="button"
                                                className="btn outlinegrey medium"
                                                onClick={handleCancelClick}
                                            >
                                                취소
                                            </button>
                                            <button
                                                type="button"
                                                className="btn solid medium"
                                                onClick={handleSaveClick}
                                            >
                                                저장
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='unit'>
                                        <h5 className='title'>프로필 이름</h5>
                                        <div className='unit_content'>
                                            <p className='desc desc_modify'>{profileName}</p>
                                            <button
                                                type='button'
                                                className='btn btn_modify outlinegrey small'
                                                onClick={() => handleEditClick("profileName")}
                                            >
                                                변경
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
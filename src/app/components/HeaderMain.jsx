"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './css/HeaderMain.css';
import Page from '../chat/page';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '../../../store/authStore';
import axios from 'axios';

const HeaderMain = () => {
  // 휘주 수정본 구역 시작
  const [showNotification, setShowNotification] = useState(false); // 알림 상태
  const { searchKeyword, setSearchKeyword, setKeyword, setCategory, user } = useAuthStore(); // Zustand에서 검색 상태 관리
  const [showSearchBar, setShowSearchBar] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 휘주 수정본 구역 끝
  const [isChatOpen, setChatOpen] = useState(false); // 채팅 사이드바 상태 관리
  const [initialRoomId, setInitialRoomId] = useState(null); // 초기 room_id 상태
  const [initialhostId, setInitialHostId] = useState(null); // 초기 글쓴이 아이디, 관리자, 판매자 공통 로직
  const [initialguestId, setInitialGuestId] = useState(null); // 초기 판매자 아이디, 관리자, 판매자 공통 로직 (거꾸로되어잇음 ㅠ)
  const [messages, setMessages] = useState([]); // 초기값을 빈 배열로 설정
  const [chats,setChats]=useState(null);
  const [chatTitle,setChatTitle]= useState(null);
  const [hostname,setHostName]=useState(null);
  const [chatPrice,setChatPrice]=useState(null);
  
 // OpenChat 이벤트 리스너
useEffect(() => {
  const handleOpenChat = async (event) => {
    try {
      const { room_id, guest_id, host_id, messages, title, host_name, price } = event.detail;

      // 데이터 설정
      await fetchChatRooms(); // 목록 먼저 가져오기
      setInitialRoomId(room_id);
      setInitialGuestId(guest_id);
      setInitialHostId(host_id);
      setMessages(messages || []); // 메시지 데이터
      setChatTitle(title || "제목 없음");
      setHostName(host_name || "알 수 없음");
      setChatPrice(price || null);

      // 모든 데이터가 준비된 후 열기
      setChatOpen(true);
    } catch (error) {
      console.error("채팅 열기 중 오류 발생:", error);
    }
  };

  window.addEventListener("open-chat", handleOpenChat);
  return () => window.removeEventListener("open-chat", handleOpenChat);
}, []);


// 사이드바 닫기
const closeChat = () => {
  setChatOpen(false);
  setInitialRoomId(null);
  setInitialGuestId(null);
  setInitialHostId(null);
  setMessages([]);
  setChatTitle(null);
  setHostName(null);
  setChatPrice(null);
};
  const toggleChat = () => {
    setChatOpen(true);
    fetchChatRooms();
  };

  const imgStyle = {
    marginTop: '-1px',
    marginLeft: '8px',
  };
  const myPageImg = {
    marginTop: '-1px',
    marginLeft: '-6px',
  };

  // 휘주 수정본 구역 시작


  const handleChange = (event) => {
    const value = event.target.value;
    console.log("헤더메인에 입력된 검색어 : ", value); // 입력된 검색어 확인
    setKeyword(value); // 상태 업데이트
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // 엔터 키로 검색 실행
    }
  };

  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      alert("검색어를 입력해주세요!");
      return;
    }

    // 현재 경로에 따라 검색 요청을 다르게 처리
    const isCategoryPage = [
      "/outerList",
      "/topList",
      "/bottomList",
      "/shoesList",
      "/bagsList",
      "/accessoriesList",
    ].includes(pathname);

    if (isCategoryPage) {
      setCategory(pathname); // 현재 카테고리 주스탠드에 저장
      // 카테고리 페이지 내에서 검색
      router.push(`${pathname}?query=${encodeURIComponent(searchKeyword)}`);
    } else {
      setCategory(""); // 쥬스탠드 카테고리 초기화 (전체 리스트)
      // 일반 검색 (itemSearchResult로 이동)
      router.push(`/itemSearchResult?query=${encodeURIComponent(searchKeyword)}&status=success`);
    }
  };

  useEffect(() => {
    const queryFromURL = searchParams.get("query") || "";
    if (queryFromURL) {
      console.log("URL에서 가져온 검색어 : ", queryFromURL); // URL 검색어 확인
      setKeyword(queryFromURL); // URL에서 검색어 가져오기
      setShowSearchBar(true); // 검색창 활성화
    } else {
      setShowSearchBar(false); // 검색창 숨김
    }
  }, [searchParams]);




  const handleSearchClick = () => {
    router.push('/searchPage');
  };


  // 휘주 수정본 구역 끝

  //하윤 채팅목록용
  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem('token'); // 토큰 가져오기
      console.log("fetchchatroom실행");
      const response = await axios.get(`http://localhost:8080/api/chat/roomList`, {
        params: {
          member_id: user?.member_id
        },
        headers: {
          Authorization: `Bearer ${token}`, // 인증 헤더 추가
        }
      });
  
      // 데이터 구조 확인
      console.log("채팅방 목록 데이터 헤더메인:", response.data);
  
      // 메시지 상태 업데이트
      setMessages(response.data || []); // 데이터 없으면 빈 배열로 초기화
    } catch (error) {
      console.error("채팅방 목록을 불러오는 중 오류 발생:", error);
      setMessages([]); // 오류 발생 시 빈 배열로 설정
    }
  };
  
  
  return (
    <div className='max_width_container'>

      {/* 전체 화면을 덮는 오버레이 */}
      {isChatOpen && <div className="chatoverlay" onClick={closeChat}></div>}
      <div className="header_main">
        <div className="main_inner">
          {/* 휘주 수정본 구역 시작 */}
          {showSearchBar && (
            <div className="center">
              <input
                type="text"
                className="searchBar"
                value={searchKeyword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="브랜드, 상품, 프로필, 태그 등"
              />
            </div>
          )}
          {/* 휘주 수정본 구역 끝 */}
          <div className="right">
            <div className="gnb_area">
              {/* 네비게이션 메뉴 */}
              <nav id="pcGnbContainer" className="gnb">
                <ul id="pcGnbList" className="gnb_list">
                  <li className="gnb_item">
                    {/* 판매 아이콘 */}
                    <Link href="/registrationpage" className="gnb_link">
                      <img
                        src="/images/HJ_saleImg.png"
                        alt="판매 아이콘"
                        width="30"
                        height="30"
                        style={{ marginTop: '-3px' }}
                      />
                    </Link>
                  </li>
                  <li className="gnb_item">
                    <button className="gnb_link" onClick={toggleChat}>
                      <img
                        src="/images/HJ_chatImg.png"
                        alt="채팅 아이콘"
                        width="28"
                        height="28"
                        style={imgStyle}
                      />
                    </button>
                  </li>
                  {/* 검색 버튼 */}
                  <li className="gnb_item">
                    <button className="btn_search" onClick={handleSearchClick}>
                      <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.571 16.631a8.275 8.275 0 111.06-1.06l4.5 4.498-1.061 1.06-4.499-4.498zm1.478-6.357a6.775 6.775 0 11-13.55 0 6.775 6.775 0 0113.55 0z"
                          fill="#222"
                        ></path>
                      </svg>
                    </button>
                  </li>

                  {/* 장바구니 버튼 => 마이페이지로 변경*/}
                  <li className="gnb_item">

                    <Link href="/myPage" className="gnb_link" scroll={true}>
                      <img
                        src="/images/HJ_mypage_icon.png"
                        alt="myPage 아이콘"
                        width="24"
                        height="24"
                        style={myPageImg}
                      />
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div >
        {/* 채팅 사이드바 */}
        <div className={`chat_sidebar ${isChatOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <Page isOpen={isChatOpen} closeChat={closeChat} initialRoomId={initialRoomId} initialhostId={initialhostId} initialguestId={initialguestId} 
          messages={messages} directtitle={chatTitle} hostName={hostname} price={chatPrice}/>
        </div>
      </div>
    </div>
  );
};
export default HeaderMain;

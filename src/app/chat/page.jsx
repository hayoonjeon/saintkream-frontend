"use client"
import React, { useEffect, useState } from 'react';
import './styles.css'; // 스타일 파일을 import합니다.
import Page from '../chatDetail/page';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useAuthStore from '../../../store/authStore';
import axios from 'axios';
import { useMemo } from 'react';
const Chat = ({ isOpen, closeChat, initialRoomId, initialguestId, initialhostId, messages = [], directtitle,
  hostName, price }) => {
  const [isChatDetailOpen, setChatDetailOpen] = useState(false); // 채팅디테일 사이드바 상태관리 
  const { user } = useAuthStore();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const LOCAL_API_BASE_URL = "http://localhost:8080";
  const [productPhotos, setProductPhotos] = useState({}); // 채팅방별 이미지 관리
  const [isFromOpenChatEvent, setIsFromOpenChatEvent] = useState(false); // open-chat 이벤트로 열렸는지 여부
  
  useEffect(() => {
    if (isOpen) { // 부모 페이지가 열릴 때마다 목록 갱신
      fetchChatRooms();
    }
  }, [isOpen]);
  

  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${LOCAL_API_BASE_URL}/api/chat/messageListForAll`, {
        params: {
          room_id: initialRoomId
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        console.log("채팅방 목록 불러오기 성공:", response.data);
        setChats(response.data.data || []);
      } 
    } catch (error) {
      console.error("채팅방 목록 불러오기 중 오류:", error);
      setChats([]); // 실패 시 빈 배열로 설정
    }finally{
      setLoading(false);
    }
  };

  

  console.log("지금부턴챗목록입니다", messages);
  // 중복 room_id 제거: 최신 항목만 유지
  console.log("다이렉트타이틀", directtitle);

  const uniqueChats = useMemo(() => {
    if (!Array.isArray(chats)) return [];
    return chats
      .reduce((acc, chat) => {
        const existingChat = acc.find((c) => c.room_id === chat.room_id);
        if (!existingChat || new Date(existingChat.created_at) < new Date(chat.created_at)) {
          return acc.filter((c) => c.room_id !== chat.room_id).concat(chat);
        }
        return acc;
      }, [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [chats]);




  useEffect(() => {
    if (Array.isArray(chats) && chats.length > 0) {
      setLoading(false); // chats가 있을 경우 로딩 완료
    } else {
      setLoading(true); // chats가 비어있으면 로딩 중
    }
  }, [chats]);
  // 안정화위해서 2차 체크
  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      setChats(messages); // messages를 chats로 설정
      setLoading(false); // 로딩 완료
    }
  }, [messages]);




  // 초기 room_id가 있을 경우 바로 채팅 디테일 열기
  useEffect(() => {
    if (initialRoomId) {
      setSelectedChat({ room_id: initialRoomId, host_id: initialhostId, messages: messages, title: directtitle, directhostName: hostName });
      fetchChatRooms();
      setChatDetailOpen(true);
    }

  }, [initialRoomId]);


  // 채팅 디테일 열기
  const toggleChatDetail = async (chat) => {
    let title = chat.title;

    // 제목이 없으면 서버에서 가져오기
    if (!title) {
      title = await fetchRoomTitle(chat.room_id);
      console.log(`room_id: ${chat.room_id} -> title: ${title}`); // 디버깅용 로그
    }

    // 선택된 채팅 데이터 설정
    const updatedChat = { ...chat, title };
    console.log("업데이트된 선택된 채팅 데이터:", updatedChat); // 디버깅 로그

    setSelectedChat(updatedChat); // selectedChat에 데이터 설정
    setChatDetailOpen(true); // 팝업 열기
  };



// 채팅 디테일 닫기
const closeChatDetail = () => {
  setChatDetailOpen(false);
  setSelectedChat(null);

  if (isFromOpenChatEvent) {
    // open-chat 이벤트로 열렸다면 바로 창 닫기
    closeChat();
  } else {
    // 그렇지 않으면 목록으로 돌아가기
    fetchChatRooms();
    closeChat();  // 걍 닫자.... 
  }
  setIsFromOpenChatEvent(false); // 상태 초기화
};

  // 선택된 room_id에 해당하는 메시지 필터링
// after (옵셔널 체이닝 + 널 병합 연산자)
const filteredMessages = selectedChat?.room_id
  ? (chats?.filter((chat) => chat.room_id === selectedChat.room_id) ?? [])
  : [];

  //한번만?
  useEffect(() => {
    fetchChatRooms();


  }, []);

  // room_id로 title 가져오기 함수 추가
  const fetchRoomTitle = async (roomId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${LOCAL_API_BASE_URL}/api/chat/getRoomTitle`, {
        params: {
          room_id: roomId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        console.log("room_id로 title 가져오기 성공:", response.data);
        return response.data; // 서버에서 받은 title 반환
      } else {
        console.error("room_id로 title 가져오기 실패:", response.data);
        return "제목 없음"; // 실패 시 기본값 반환
      }
    } catch (error) {
      console.error("room_id로 title 가져오는 중 오류:", error);
      return "제목 없음"; // 에러 발생 시 기본값 반환
    }
  };

  // Chat 컴포넌트 내 추가
  useEffect(() => {
    const updateChatTitles = async () => {
        if (Array.isArray(uniqueChats)) {
            const updatedChats = await Promise.all(
                uniqueChats.map(async (chat) => {
                    const title = await fetchRoomTitle(chat.room_id);
                    return { ...chat, title };
                })
            );
            if (!updatedChats.every((chat, index) => chat.title === chats[index]?.title)) {
                setChats(updatedChats);
            }
        }
    };
    updateChatTitles();
}, [uniqueChats]);


  const fetchProductPhoto = async (roomId) => {
    try {
      const response = await axios.get(`${LOCAL_API_BASE_URL}/api/chat/getPostPhoto`, {
        params: { room_id: roomId }, // 각 room_id를 서버에 전달
      });

      if (response.data) {
        setProductPhotos((prevPhotos) => ({
          ...prevPhotos,
          [roomId]: response.data.photoUrl, // room_id별로 이미지 저장
        }));
        console.log(`사진 링크(${roomId}):`, response.data.photoUrl);
      } else {
        console.error(`사진 URL을 찾을 수 없습니다. (room_id: ${roomId})`);
      }
    } catch (error) {
      console.error(`사진 가져오는 중 오류 발생 (room_id: ${roomId}):`, error);
    }
  };

  //게시물사진받아오기
  useEffect(() => {



    fetchProductPhoto();
    // if (room_id) {
    //   fetchProductPhoto();
    // }
  }, [initialRoomId]);

  useEffect(() => {
    const loadImagesForChats = async () => {
        const roomIds = uniqueChats.map((chat) => chat.room_id).filter((roomId) => !productPhotos[roomId]);
        for (const roomId of roomIds) {
            await fetchProductPhoto(roomId);
        }
    };
    loadImagesForChats();
}, [uniqueChats]);


// open-chat 이벤트 리스너 추가
useEffect(() => {
  const handleOpenChat = (event) => {
    const { room_id, host_id } = event.detail;
    setSelectedChat({ room_id, host_id });
    setIsFromOpenChatEvent(true); // 이벤트로 열림 상태 설정
    setChatDetailOpen(true);
  };

  window.addEventListener("open-chat", handleOpenChat);
  return () => window.removeEventListener("open-chat", handleOpenChat);
}, []);

  return (

    <div className="chat-page">
      {/* chatDetail 진입점 오버레이 - 일부러 여기엔 no_more_overlay라고 바꿈(미적용), 추후 2차 어두움 원하면 그냥 overlay로 바꾸기. */}
      {isChatDetailOpen && <div className='chatoverlay2' onClick={closeChatDetail}></div>}
      <div className="chat-header" style={{ alignContent: 'left', textAlign: 'center' }}>

        <button className="close-button" onClick={closeChat}>
          <img src="/images/HJ_close.png" className="close_button" />
        </button>
        <span style={{ fontSize: '25px', fontWeight: 'bold', marginTop: '11px', marginLeft: '15px' }}>채팅</span>
      </div>
      <div className="chat-list">
        {loading ? (
          <p>채팅방 목록을 불러오는 중...</p>
        ) : uniqueChats.length > 0 ? (
          uniqueChats.map((chat) => (
            <button
              key={chat.room_id}
              className="chat-item"
              onClick={() => toggleChatDetail(chat)}
            >
              <div className="chat-item2" style={{ width: "548px", border: "none" }}>
                <div className="product-photo">
                  {productPhotos[chat.room_id] ? (
                    <img
                      src={`http://localhost:8080/images/${productPhotos[chat.room_id]}`}
                      alt="게시물 사진"
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </div>


                <div className="chat-details">
                  <span className="chat-name">{chat.title || "알 수 없음"}</span>
                  <span className="chat-date">{chat.created_at || "날짜 없음"}</span>
                  <div className="chat-message">{chat.content || "메시지 없음"}</div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <p>채팅방이 없습니다.</p>
        )}
      </div>



      {/* 채팅방(Detail) */}
      {isChatDetailOpen && selectedChat && (
        <div className={`chatDetail_sidebar ${isChatDetailOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="chat-detail">
            <Button sx={{
              color: 'black', ":hover": {
                backgroundColor: '#f5f5f5', // 호버 시 배경색을 lightgray로 변경
                border: 'none'
              }
            }} className="close-button" onClick={closeChatDetail} style={{ margin: '0px' }}>
              <ArrowBackIosIcon
                style={{
                  margin: '10px',
                  marginLeft: '15px'
                }}
              />
            </Button>
            <Page room_id={selectedChat.room_id} host_id={selectedChat.host_id} closeChat={closeChat} closeDetail={closeChatDetail} messages={filteredMessages}
              title={selectedChat.title} directtitle={directtitle} directhostName={hostName} price={price} />
          </div>
        </div>
      )}

    </div>
  );
}

export default Chat;

import React, { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Videocam from '@mui/icons-material/Videocam';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardContent, Typography } from '@mui/material';
import { Check } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import * as StompJs from '@stomp/stompjs'; // 추가: STOMP WebSocket 라이브러리
import SockJS from 'sockjs-client'; // 추가: SockJS WebSocket 폴리필..??
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import useAuthStore from '../../../../store/authStore';
import axios from 'axios';
const Page = ({ room_id, host_id, messages: initialMessages, title, directtitle, hostName, price, chatListPrice }) => {
  const [message, setMessage] = useState(''); //입력창  처음엔 비어있음. 
  const [messages, setMessages] = useState(initialMessages || []);
  const [files, setFiles] = useState([]);   //미리보기..?  아직  실제업로드 구현 안됨 ( 12-21 기준)
  const [previewUrls, setPreviewUrls] = useState([]);    //파일 관련미리보기쪽임...  
  const previewRef = useRef(null); //사진,동영상 미리보기 플로팅 상태관리
  const messagesEndRef = useRef(null); // 추가: 메시지 끝부분 참조
  const [loaded, setLoaded] = useState(false); // State to track if the image is loaded
  // 추가: WebSocket 클라이언트 초기화
  const [stompClient, setStompClient] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuthStore();
  const userName = user.member_id; // 추가: 사용자 이름 설정 임의값.
  const roomId = room_id;
  console.log("받은 title:", title);
  console.log("최종메세지들" + JSON.stringify(initialMessages));
  const [productPhoto, setProductPhoto] = useState(''); //게시물 사진 가져오기.(채팅마다달라서 여기서해야함)
  // 유동적인 price 값 계산
  const dynamicPrice = price || chatListPrice || null;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모티콘 창 표시 여부 상태 추가
  const emojiPickerRef = useRef(null); // 이모티콘 창 닫기 처리를 위한 ref

  // 채팅 메시지 목록을 DB에서 다시 가져오는 함수
  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem('token'); // 로그인 토큰 (예시)
      console.log("fetchChatRooms 호출됨");

      const response = await axios.get(`http://localhost:8080/api/chat/messageListForAll`, {
        params: {
          member_id: user.member_id, // 현재 로그인된 사용자
          room_id: roomId,           // 현재 채팅방 ID
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      console.log("채팅방 목록 데이터:", response.data);

      // room_id에 해당하는 메시지만 필터링
      const filteredMessages = response.data.filter((msg) => msg.room_id === roomId);
      console.log("필터링된 메시지:", filteredMessages);

      // 메시지 상태 업데이트
      setMessages(filteredMessages || []);
    } catch (error) {
      console.error("채팅방 목록을 불러오는 중 오류 발생:", error);
      setMessages([]);
    }
  };



  useEffect(() => {
    if (!roomId) return;
    // WebSocket 연결 설정
    const socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    const client = new StompJs.Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket Connected');
      console.log("연결됨!");

      // 메시지 수신 구독
      client.subscribe(`/topic/chat/${roomId}`, async (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("대체메세지뭐로오는데", receivedMessage);

        // 파일 메시지인지 확인
        if (
          typeof receivedMessage.content === 'string' &&
          receivedMessage.content.startsWith('/chatimages')
        ) {
          receivedMessage.has_file = "1";
          receivedMessage.content = `http://localhost:8080${receivedMessage.content}`;
          console.log("마지막사진경로제발제발", receivedMessage.content);

          // 여기서 파일이 있는 메시지면 DB 다시 가져오기
          await fetchChatRooms();
        } else {
          receivedMessage.has_file = "0";
        }


        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        await fetchChatRooms();
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error', frame.headers['message'], frame.body);
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [roomId]);


  // 메시지 전송 함수 수정
  const sendMessage = async () => {
    if (!message && files.length === 0) {
      console.log("메시지와 파일이 모두 비어 있음, 전송하지 않음.");
      return; // 아무것도 입력되지 않았을 때 전송 방지
    }

    // 파일 업로드
    let uploadedFiles = [];
    if (files.length > 0) {
      uploadedFiles = await uploadFilesToServer(files); // 파일 업로드
    }

    // 새로운 메시지 객체 생성
    const newMessage = {
      room_id: roomId,
      member_id: userName, // 사용자 이름
      ...(message ? { content: message } : {}), // message가 있을 때만 content 추가
      ...(uploadedFiles.length > 0 ? { files: uploadedFiles } : {}), // 파일이 있을 때만 files 추가
    };

    console.log("Sending message:", newMessage);

    // WebSocket을 통해 서버로 메시지 전송
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/chat/${roomId}`, // 서버 MessageMapping 경로
        body: JSON.stringify(newMessage),
      });
    }

    // 입력 필드 초기화
    setMessage('');
    setPreviewUrls([]);
    setFiles([]);

    // 4) **DB에서 최신 메시지 가져오기 (fetchChatRooms)**
    await fetchChatRooms();

  };



  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(currentFiles => [...currentFiles, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(currentUrls => [...currentUrls, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 추가: 메시지 추가 시 채팅창 스크롤 자동 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const scrollPreviews = (direction) => {
    if (previewRef.current) {
      const { scrollLeft, clientWidth } = previewRef.current;
      const newScrollPosition = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      previewRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
    }
  };


  //게시물사진받아오기
  useEffect(() => {

    const fetchProductPhoto = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/chat/getPostPhoto`, {
          params: { room_id: roomId }, // room_id를 서버에 전달
        });

        if (response.data) {
          setProductPhoto(response.data.photoUrl); // 서버에서 받은 사진 URL 설정
          console.log("사진링크체크", productPhoto);
        } else {
          console.error('사진 URL을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('사진 가져오는 중 오류 발생:', error);
      }
    };
    fetchProductPhoto();
    // if (room_id) {
    //   fetchProductPhoto();
    // }
  }, [room_id]);

  //사진,동영상 실제 서버에 올리기
  const uploadFilesToServer = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        "http://localhost:8080/api/chat/mediaUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            roomId: roomId, // 방 ID 추가
            memberId: userName, // 사용자 ID 추가
          },
        }
      );
      return response.data; // 서버에서 반환된 업로드된 파일 정보
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      return [];
    }
  };


  //파일 미리보기 삭제기능..?
  const removePreview = (index) => {
    setFiles((currentFiles) => currentFiles.filter((_, i) => i !== index));
    setPreviewUrls((currentUrls) => currentUrls.filter((_, i) => i !== index));
  };
  //이모티콘
  const EmojiPicker = ({ onSelect }) => {
    const emojis = [
      "😊", "😂", "❤️", "👍", "🔥", "😍", "🤔", "🎉", "😎", "😢",
      "😡", "💪", "🤗", "😴", "💡", "🥳", "🙄", "🤩", "😇", "😷",
      "🤒", "🤖", "👻", "🎃", "🍕", "🍔", "🍟", "🌭", "🍿", "🍩"
    ]; // 30개의 이모티콘
    const rows = 5; // 한 줄에 5개씩 보여줌
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${rows}, 1fr)`, // 5개씩
          gap: "5px",
          padding: "10px",
          background: "#fff",
          borderRadius: "8px",
        }}
      >
        {emojis.map((emoji) => (
          <button
            key={emoji}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  };
  const addEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };
  //이모티콘 끄기 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false); // 외부 클릭 시 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleImageError = () => {
    if (retryCount < 3) { // 최대 3번만 시도
      setTimeout(() => {
        setRetryCount(retryCount + 1);
      }, 2000); // 2초 뒤 재시도
    }
  };
  return (
    <div className="chat-room-page">
      {/* 상품 정보 */}
      <section className="product-info">
        <div className="product-photo">
          {productPhoto ? (
            <img src={`http://localhost:8080/images/${productPhoto}`} alt="게시물 사진" />
          ) : (
            <p>No Image</p>
          )}
        </div>
        <div className="product-details">
          <h3>{title}</h3>
          <h4>{new Intl.NumberFormat().format(Number(dynamicPrice))} 원</h4>

        </div>
      </section>
      {/* 파일 미리보기 플로팅 */}
      {previewUrls.length > 0 && (
        <div style={{
          width: '580px',
          position: 'fixed', bottom: 100, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0)', // 반투명 배경
          zIndex: 1000, padding: '5px 10px'
        }}>
          <IconButton onClick={() => scrollPreviews('left')}><ArrowBackIosIcon /></IconButton>
          <div ref={previewRef} style={{
            overflowX: 'hidden', display: 'flex', whiteSpace: 'nowrap', flex: '1',
          }}>
            {previewUrls.map((url, index) => (
              <Card key={index} style={{ minWidth: '100px', margin: '0 5px' }}>
                <CardMedia
                  component={files[index].type.startsWith('video/') ? 'video' : 'img'}
                  src={url}
                  alt="Preview"
                  controls={files[index].type.startsWith('video/')}
                  style={{ height: '100px' }}
                />
                <IconButton onClick={() => removePreview(index)}>❌</IconButton>
              </Card>
            ))}
          </div>
          <IconButton onClick={() => scrollPreviews('right')}><ArrowForwardIosIcon /></IconButton>
        </div>
      )}

      {/* 메시지 창 */}
      <main
       className="chat-messages"
       style={{
         // 헤더와 입력창 높이를 합산해서 적절히 뺀다 가정
         maxHeight: 'calc(100vh - 320px)', 
         // 예: 헤더 60px + 입력창 100px + 여백 40px 등
         overflowY: 'auto',
         padding: '0 1rem',
       }}
      >
        {messages
          .filter((msg) => msg.content)
          .map((msg, index) => (
            <Box
              key={index}
              sx={{
                margin: '10px',
                marginLeft: String(msg.member_id) === String(user.member_id) ? 'auto' : '10px',
                marginRight: String(msg.member_id) === String(user.member_id) ? '10px' : 'auto',
                maxWidth: { xs: '100%', sm: '70%' },
                alignSelf: msg.member_id === user.member_id ? 'flex-end' : 'flex-start',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '20px',
              }}
            >
              <Paper
                elevation={3}
                style={{
                  padding: '12px',
                  backgroundColor: msg.member_id === user.member_id ? '#f1f1ea' : '#ebf0f5',
                }}
                sx={{
                  padding: '10px',
                  backgroundColor: msg.member_id === user.member_id ? '#e0f7fa' : '#ffffff',
                  borderRadius: '4px',
                }}
              >
                {msg.has_file === "1" ? (
                  <>
                    {!loaded && <p>이미지 로딩 중...</p>}
                    <img
                      src={`http://localhost:8080${msg.content}?retry=${retryCount}`}
                      alt="Uploaded"
                      onError={handleImageError}
                      onLoad={() => setLoaded(true)} // Set loaded to true when the image is loaded
                      key={`http://localhost:8080${msg.content}`}
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </>
                ) : (
                  <Typography
                    variant="body2"
                    component="p"
                    style={{
                      color: 'black',
                      wordWrap: 'break-word',
                      lineHeight: '1.5',
                    }}
                  >
                    {msg.content}
                  </Typography>
                )}

                <Typography
                  color="textSecondary"
                  style={{
                    fontSize: '14px',
                    textAlign: msg.member_id === user.member_id ? 'right' : 'left',
                    marginTop: '8px',
                  }}
                >
                  {msg.created_at || ''}
                  {msg.is_read==="1" && msg.member_id === user.member_id ? (
                    <Check style={{ fontSize: 'small' }} />
                  ) : (
                    ''
                  )}
                </Typography>
              </Paper>
            </Box>
          ))}
        <div ref={messagesEndRef} />
      </main>



      {/* 입력 창 */}
      {/* 플로팅 이모티콘 창 */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          style={{
            position: 'absolute',
            bottom: '70px', // 입력창 위에 뜨도록 조정
            left: '20px', // 원하는 위치로 조정
            backgroundColor: '#fff',
            boxShadow: 'none',
            borderRadius: '8px',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          <EmojiPicker onSelect={addEmoji} />
        </div>
      )}
      <footer className="chat-input">
        <div className="input-left">
          <input
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="icon-button-file">
            <IconButton color="black" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
            <IconButton color="black" aria-label="upload video" component="span">
              <Videocam />
            </IconButton>
          </label>
          <button
            className="emoji-button"
            onClick={() => setShowEmojiPicker((prev) => !prev)} // 상태 토글
          >
            😊
          </button>
          <input
            type="text"
            placeholder="메시지를 입력해 주세요."
            value={message}
            onChange={(e) => {
              console.log("Input value:", e.target.value);
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
          />

        </div>
        <div className="input-right">
          <button className="send-button" onClick={sendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="-2 -4 30 30"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg></button>
        </div>
      </footer>

    </div>
  );
};

export default Page;
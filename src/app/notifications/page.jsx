'use client';
import React, { useState, useEffect } from 'react';
import styles from './notifications.module.css';
import './notifications.module.css';
import './notifications.css';
import useAuthStore from '../../../store/authStore';
import axios from 'axios';

const Page = ({ props }) => {
  const { isNotibarActive, setIsNotibarActive } = useAuthStore();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(null);
  const [number, setNumber] = useState(1);
  const handleToggleNotibar = () => {
    setIsNotibarActive(); // 상태 토글
  };
  useEffect(() => {
    const sse = new EventSource(`http://localhost:8080/api/connect/${user?.member_id}`);
    sse.addEventListener('connect', (e) => {
      const { data: receivedConnectData } = e;
      console.log("connected!");
      console.log('connect알림 정보 받기: ', JSON.parse(receivedConnectData).data);  // "connected!"
      setNotifications(JSON.parse(receivedConnectData).data);
    });
    sse.addEventListener('update', (e) => {
      console.log("가져와지는지 확인")
      const receivedConnectData = JSON.parse(e.data); // 데이터를 JSON 객체로 변환
      console.log('update알림 정보 받기: ', receivedConnectData); // 변환된 객체 출력
      setNotifications(receivedConnectData);
    });
  }, [user])

  useEffect(()=>{
    console.log("notifications"+ JSON.stringify(notifications)); // 업데이트된 알림 개수
  },[notifications])


  const sendMessage = async () => {
    try {
      const response = await axios(`http://localhost:8080/api/broadcast/${user?.member_id}?sender_id=${encodeURIComponent("11")}&pwr_id=${encodeURIComponent("100")}&nickname=${encodeURIComponent("홍길동")}&title=${encodeURIComponent("제목1")}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error:', error);
      console.log('Error sending message.catch');
    }
  };
  const plus = () => {
    setNumber(number + 1);
    console.log(number);
  }
  const getTimeDifference = (time) => {
    const now = new Date();
    const past = new Date(time);
    const diff = Math.floor((now - past) / 1000);  // 초 단위 차이

    if (diff < 60) return `${diff}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };
  const setIsDeleted = async  (noti_id) => {
    try {
      // 서버에 삭제 요청 보내기 (DELETE 요청)
      await axios.get(`http://localhost:8080/api/deletenoti/${noti_id}`);
  
      // 클라이언트 측에서도 즉시 반영
      setNotifications((prev) => prev.filter(item => item.noti_id !== noti_id));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  } 

  return (

    <div>
      {/* 레이어 배경 */}
      <div
        onClick={handleToggleNotibar}
        className={`${isNotibarActive ? styles.notiLayerBackground : ''}`}></div>

      {/* 필터 섹션 */}
      <div className={`${styles.notiSections} ${isNotibarActive ? styles.active : ''}`} >
        <div className={styles.notiContent} style={{ paddingBottom: '5px' }}>
          <div className="noti_title_container">
            <button className='exit_noti_btn' onClick={handleToggleNotibar}>
              <img src="/images/HJ_close.png" className="noti_close_button" />
            </button>
            <div className="noti_title">
              <h2><p>알림</p></h2>
            </div>
          </div>
        </div>
        <div className="noti_filter_section">
          <div className="noti_section_top"></div>
          <hr style={{ border: '1px', height: '1px', backgroundColor: 'rgba(0,0,0,0.1)', margin: '0px' }} />
          <div>
            {/* 카테고리 버튼 */}
            <ul className="noti_big_category_container">
              {/* <li className="noti_big_category">
                <button className='noti_button'>전체</button>
                <button className='noti_button'>거래</button>
                <button className='noti_button'>관심</button>
                <button className='noti_button'>판매</button>
              </li> */}
            </ul>
          </div>
          <div className={styles.filterContent}>
            <div className="noti_title_container" style={{ height: '20px' }}>
              <div className="noti_section_top">
                <p>지난 알림</p>
              </div>
            </div>
          </div>
          {/* 알림 카드 시작 */}
          <div className="noti_section">
            <div className="noti_section_top">

              {Array.isArray(notifications) && notifications.length > 0 
  ? notifications.filter(item => item.is_deleted == "0").map((item) => { return <div>
              <div className='noti_one_block'>
                <table>
                  <tbody>
                    <tr><td onClick={() => setIsDeleted(item.noti_id)} style={{ cursor: 'pointer' }}>x</td><td> {item.nickname}이 당신의 게시물을 북마크 했습니다.</td><td></td></tr>
                    <tr>
                      <td><img src='/images/HJ_notice_img.png' /></td>
                      <td style={{ width: '180px' }}></td>
                      <td style={{ width: '90px' }}><img src={`http://localhost:8080/images/${item.file_name}`} /></td>
                    </tr>
                    <tr><td></td><td>{getTimeDifference(item.created_at)}</td><td></td></tr>
                  </tbody>
                </table>
              </div>
              <hr style={{ border: '1px', height: '1px', backgroundColor: 'rgba(0,0,0,0.1)', margin: '0px' }} />
              </div>
              }): <div>알림이 없습니다.</div>  
            }
            
            </div>
          </div>
          {/* 알림 카드 끝 */}
        </div>
      </div>
    </div>
  );
};

export default Page;

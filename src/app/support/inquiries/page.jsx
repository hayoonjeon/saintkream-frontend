"use client";

import React from 'react';
import {  Typography, Button, List, ListItem, } from '@mui/material';

const ContactPage = () => {

  // const handleContactClick = () => {
  //   // open-chat 이벤트 발생 시킴 -> room_id: 999 . 임시번호이고, 실제 roomid 나 관리자 id가 파라미터로 가야함.
  //   window.dispatchEvent(new CustomEvent('open-chat', { detail: { room_id: 999, host_id: 998 } }));
  // };

  return (
    <div style={{ margin: '20px' }}>
    <h2 style={{ color: '#333', borderBottom: '3px solid black', paddingBottom: '10px', textAlign:'left' }}>1:1 문의하기</h2>
    <div>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0 }}>
          <img src="../images/HY_logo.png" alt="Logo" style={{ width: '300px', marginBottom: '40px' }} />
            <Typography sx={{ mb: 2, fontSize:20}}>
              SAINT KREAM을 사용하시면서, 궁금한 점을 문의하세요.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              1:1 문의  운영시간: 평일 9:00-18:00   
              <Typography sx={{textAlign:'center'}}>
                <br/>
              02-1234-5678
              </Typography>
            </Typography>
          </ListItem>
        
          <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          {/* <Button
  variant="outlined"
 
  sx={{
    mt: 1,
    mb: 2,
    border: '3px solid black',
    color: 'black',
    fontSize: '1rem', // 폰트 크기 조정
    padding: '12px 30px', // 패딩 조정으로 버튼 크기 증가
    borderRadius: '30px', // 테두리 둥글게 조정
    boxSizing: 'border-box', // border-box로 설정
    '&:hover': {
      backgroundColor: '#000000',
      border: '3px solid gray', // hover 상태에서도 border 유지
      borderColor: 'black',
      color:'white'
    }
  }}
>
  1:1 문의하기
</Button> */}

          </ListItem>
        </List>
    </div>
  </div>
  );
};

export default ContactPage;

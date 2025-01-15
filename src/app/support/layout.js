"use client";
import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

const SupportLayout = ({ children }) => {
  const router = useRouter(); // 라우터 사용
  const pathname = usePathname(); // 현재 경로 가져오기

  // 현재 URL 경로에 따라 탭 상태 설정
  const getTabValue = () => {
    if (pathname === '/support/notices') return 1;
    if (pathname === '/support/faqs') return 2;
    if (pathname === '/support/inquiries') return 3;
    return 0; // 기본값
  };

  const [value, setValue] = useState(getTabValue);

  // 경로 변경 시 탭 상태 업데이트
  useEffect(() => {
    setValue(getTabValue());
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 1:
        router.push('/support/notices');
        break;
      case 2:
        router.push('/support/faqs');
        break;
      case 3:
        router.push('/support/inquiries');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', maxWidth: '1280px', margin: 'auto' }}>
     
      {/* 세로 탭 메뉴 */}
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{
          '.MuiTab-root': {
            color: '#000',
            textAlign: 'left',
            alignItems: 'flex-start',
            fontSize: '15px',
          },
          '.Mui-selected': {
            color: 'black !important', // !important로 스타일 우선순위 높이기
            fontWeight: 'bold',
          },
          '.MuiTabs-indicator': {
            backgroundColor: 'black',
            width: '4px',
            left: '0px',
          },
        }}
      >
       <Typography variant="h6" style={{marginBottom:"25px", marginTop:"20px", fontWeight:'bold'}}>고객센터</Typography>
        <Tab label="공지사항" />
        <Tab label="자주 묻는 질문" />
        <Tab label="1:1 문의하기" />
      </Tabs>

      {/* 콘텐츠 영역 */}
      <Box sx={{ padding: '20px', flexGrow: 1 , height:'700px'}}>
        {children}
      </Box>
    </Box>
  );
};

export default SupportLayout;

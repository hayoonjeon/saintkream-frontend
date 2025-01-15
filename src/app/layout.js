'use client';
import React from 'react';
import './globals.css';
import Footer from "./components/Footer";
import Header from "./components/Header";
import { usePathname } from 'next/navigation';
import Notifications from './notifications/page'

export default function RootLayout({ children }) {
  const pathname = usePathname();
 
  // 경로에 따라 헤더 선택
  const renderHeader = () => {
    if (pathname === '/searchPage') {
      return null; // 검색 페이지에서는 헤더 숨김
    }
    return <Header />; // 기본 헤더 출력
  };

  

  return (
    <html lang="en">
      <body>
        {/* 동적으로 선택된 헤더 렌더링 */}
        {renderHeader()}
         <Notifications />
        <hr />
        {children}
        <hr/>
        {/* 형태를 위한 DIV */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '1280px', minWidth: '510px' }}>
            {/* 푸터 */}
            <Footer/>
          </div>
        </div>
        <hr/>
      </body>
    </html>
  );
}

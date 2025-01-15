import React from 'react';
import Link from 'next/link';
import './headerNavi.css'; // CSS 모듈 import
import useAuthStore from '../../../store/authStore';
import { usePathname, useSearchParams } from 'next/navigation'; // useSearchParams 추가

const Page = () => {
  const { searchKeyword } = useAuthStore();
  const pathname = usePathname(); // 현재 경로
  const searchParams = useSearchParams(); // 쿼리 파라미터를 가져옵니다.

  // 쿼리 파라미터와 pathname을 비교
  const getFullPath = (path) => {
    if (searchKeyword) {
      // 쿼리 파라미터가 있을 때 경로에 붙여줍니다.
      return `${path}?query=${searchKeyword}`;
    }
    return path; // 쿼리 파라미터가 없으면 그대로 경로 반환
  };

  const navItems = [
    { name: '전체', path: '/' },
    { name: '아우터', path: '/outerList' },
    { name: '상의', path: '/topList' },
    { name: '하의', path: '/bottomList' },
    { name: '신발', path: '/shoesList' },
    { name: '가방', path: '/bagsList' },
    { name: '패션잡화', path: '/accessoriesList' },
  ];

  return (
    <div className='header_navigation'>
      <div className="max_width_container">
        <div className="header_navi">
          <div className="navi_inner">
            <ul className="navi_list">
              {navItems.map((item, index) => {
                // 경로를 전체 경로로 변환한 후 비교
                const fullPath = getFullPath(item.path);
                // const isSelected = pathname === item.path || pathname === fullPath;
                const isSelected = pathname === item.path;

                return (
                  <li
                    className={`navi_item ${isSelected ? 'selected' : ''}`} // 'selected' 클래스 추가
                    key={index}
                  >
                    <Link href={fullPath} className="navi_link">
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

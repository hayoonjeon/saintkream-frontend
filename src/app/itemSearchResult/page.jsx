'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './itemSearchResult.css';
import ItemCard from '../itemCard/page';
import FilterButtonsSection from '../filterButtonsSection/page';
import FilterSidebar from '../filterSidebar/page';
import axios from 'axios';
import useAuthStore from '../../../store/authStore';

function Page() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setKeyword } = useAuthStore(); // Zustand에서 검색어 가져오기

  const query = searchParams.get('query') || '';
  const status = searchParams.get('status') || '';

  useEffect(() => {
    if (query && status === 'success') {
      setKeyword(query); // 검색어를 Zustand에 동기화
      fetchSearchResults(query);
    }
  }, [query, status]);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const fetchSearchResults = async (query) => {
    console.log("query : "+ query);
    setLoading(true); // 로딩 시작
    try {
      const response = await axios.get(`http://localhost:8080/api/searchItems/itemSearchResult`, {
        params: { keyword: query },
      });
  
      console.log("API 응답 데이터:query", response.data.data);
  
      if (response.data.success) {
        const items = response.data.data || [];
        const processedItems = items.map((item) => ({
          ...item,
          fileList: Array.isArray(item.fileList) ? item.fileList : [], // 안전하게 fileList 처리
        }));
        setSearchResults(processedItems);
      } else {
        console.error("API 실패:", response.data.message);
        setError(response.data.message || "서버에서 에러가 발생했습니다.");
      }
    } catch (err) {
      console.error("검색 오류:", err.response?.status, err.response?.data || err.message);
      setError("검색 결과를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };
  

  return (
    <div>
      <FilterSidebar isActive={isSidebarActive} toggleSidebar={toggleSidebar} />
      <FilterButtonsSection toggleSidebar={toggleSidebar} />
      {/* <h3 style={{ textAlign: 'center', color: 'lightgray' }}>
        검색 결과 : "{query}"
      </h3> */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-10px' }}>
        <div className="main_list_container">
          {loading && <p>로딩 중입니다...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && searchResults.length > 0 ? (
            searchResults.map((data, index) => <ItemCard key={index} data={data} />)
          ) : (
            !loading &&
            !error && (
              <p style={{ textAlign: 'center', color: 'gray' }}>
                검색 결과가 없습니다.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;

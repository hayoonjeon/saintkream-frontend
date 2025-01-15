'use client';
import React, { useEffect, useState } from 'react';
import './topList.css';
import ItemCard from '../itemCard/page';
import FilterButtonsSection from '../filterButtonsSection/page';
import FilterSidebar from '../filterSidebar/page';
import MidCategoryBanner from "../midCategoryBanner/page";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '../../../store/authStore';

function Page() {
  const searchParams = useSearchParams();
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const API_URL = `${LOCAL_API_BASE_URL}/api/searchItems/topList`; // topList API 엔드포인트
  const Category_API_URL = `${LOCAL_API_BASE_URL}/api/searchItems/categoryList`; // OuterList API 엔드포인트
  const SubCategory_API_URL = `${LOCAL_API_BASE_URL}/api/searchItems/subcategoryList`; // OuterList API 엔드포인트
  const { setKeyword, searchBarActive } = useAuthStore(); // Zustand에서 검색 상태 관리
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [defaultItems, setDefaultItems] = useState([]);

  const query = searchParams.get('query') || '';
  const subCategory = searchParams.get('sub_category') || ''; // 하위 카테고리

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: {
          keyword: query,
          category: '상의', // topList 고정 카테고리
        },
      });

      console.log("API 요청 파라미터:", { keyword: query, category: "상의" });
      console.log("API 응답 데이터:", response.data);

      if (response.data.success) {
        const items = response.data.data || [];
        const processedItems = items.map((item) => ({
          ...item,
          fileList: Array.isArray(item.fileList) ? item.fileList : [], // 안전하게 fileList 처리
        }));
        setSearchResults(processedItems);
      } else {
        console.error("API 실패:", response.data.message);
        setError(response.data.message || "검색 결과가 없습니다.");
      }
    } catch (err) {
      console.error("검색 오류:", err.response?.status, err.response?.data || err.message);
      setError("검색 결과를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

 const fetchDefaultItems = async () => {
     setLoading(true);
     setError(null);
 
     try {
       const response = await axios.get(Category_API_URL, {
         params: {
           category: '상의', // 고정 카테고리
         },
       });
 
       console.log("API 요청 파라미터:", { category: "상의" });
       console.log("API 응답 데이터:", response.data);
 
       if (response.data.success) {
         const items = response.data.data || [];
         setDefaultItems(items); // 상태 업데이트
         const processedItems = items.map((item) => ({
           ...item,
           fileList: Array.isArray(item.fileList) ? item.fileList : [], // 안전하게 fileList 처리
         }));
         setSearchResults(processedItems);
       } else {
         console.error("API 실패:", response.data.message);
         setError(response.data.message || "카테고리 결과가 없습니다.");
       }
     } catch (err) {
       console.error("검색 오류:", err.response?.status, err.response?.data || err.message);
       setError("카테고리리 결과를 가져오는 중 문제가 발생했습니다.");
     } finally {
       setLoading(false);
     }
   };
 
  const fetchSubCategoryItems = async () => {
     setLoading(true);
     setError(null);
 
     try {
       const response = await axios.get(SubCategory_API_URL, {
         params: { sub_category: subCategory }, // sub_category 전달
       });
 
       console.log("API 요청 파라미터:", { subCategory });
       console.log("API 응답 데이터:", response.data);
 
       if (response.data.success) {
         const items = response.data.data || [];
         setSearchResults(items); // 상태 업데이트
         setDefaultItems(items);
         const processedItems = items.map((item) => ({
           ...item,
           fileList: Array.isArray(item.fileList) ? item.fileList : [], // 안전하게 fileList 처리
         }));
         setSearchResults(processedItems);
         setDefaultItems(processedItems);
       } else {
         console.error("API 실패:", response.data.message);
         setError(response.data.message || "SubCategory 결과가 없습니다.");
       }
     } catch (err) {
       console.error("검색 오류:", err.response?.status, err.response?.data || err.message);
       setError("SubCategory 결과를 가져오는 중 문제가 발생했습니다.");
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     if (query) {
       setKeyword(query); // 검색어를 Zustand에 동기화
       fetchSearchResults();
     } else if (subCategory) {
       fetchSubCategoryItems();
     } else if (searchBarActive){
       fetchDefaultItems();
     } 
   }, [query, subCategory, searchBarActive]);
 
   // useEffect(() => {
   //   if (searchBarActive) {
   //     fetchDefaultItems();
   //   }
   // }, []);
  


  return (
    <>
      <MidCategoryBanner category="topList" />
      <FilterSidebar isActive={isSidebarActive} toggleSidebar={toggleSidebar} />
      <FilterButtonsSection toggleSidebar={toggleSidebar} />
      {/* 검색 결과 헤더 */}
      {/* {query && searchBarActive ? (
        <h3 style={{ textAlign: "center", color: "lightgray" }}>
          '상의' 내 검색 결과 : "{query}"
        </h3>
      ) : null} */}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-10px' }}>
        <div className="main_list_container">

          {/* searchBarActive가 true일 경우 */}
          {searchBarActive ? (
            <>
              {/* 로딩 상태 */}
              {loading && <p>로딩 중입니다...</p>}

              {/* 에러 상태 */}
              {error && <p style={{ color: "red" }}>{error}</p>}

              {/* 검색 결과 */}
              {!loading && searchResults.length > 0 ? (
                searchResults.map((data, index) => <ItemCard key={index} data={data} />)
              ) : (
                // 검색 결과가 없을 경우
                !loading &&
                !error && (
                  <p style={{ textAlign: "center", color: "gray" }}>
                    검색 결과가 없습니다.
                  </p>
                )
              )}
            </>
          ) : (
            // searchBarActive가 false일 경우 다른 리스트 출력
            <>
              {!loading && defaultItems.length > 0 ? (
                defaultItems.map((item, index) => <ItemCard key={index} data={item} />)
              ) : (
                <p style={{ textAlign: "center", color: "gray" }}>상품이 없습니다.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Page;

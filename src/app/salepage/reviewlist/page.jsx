"use client";
import React, { useEffect, useState } from 'react';
import './reviewlist.css'
import Link from 'next/link';
import axios from 'axios';

function page({ id, review }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [list, setList] = useState([]);


  // 판매 리스트 출력
  useEffect(() => {
    console.log(">>> useEffect 실행됨");
    const getListData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/salepage/getreviewdata?id=${id}`); // API 호출
        const data = response.data.data;
        console.log("reviewList Data : ", data)
        setList(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getListData();
  }, [id, review]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + list.length) % list.length);
  };

  const calculateDaysAgo = (createdAt) => {
    const today = new Date();
    const createdDate = new Date(createdAt);
    const diffTime = today - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    return `${diffDays}일 전`;
  };

  const renderStars = (rate) => {
    const maxStars = 5; // 최대 별 개수
    const filledStars = Math.min(rate, maxStars); // `rate`만큼 별을 채움
    const emptyStars = maxStars - filledStars; // 남은 별은 비워둠

    return (
      <>
        {Array(filledStars)
          .fill("⭐️")
          .map((star, index) => (
            <span key={`filled-${index}`}>{star}</span>
          ))}
        {Array(emptyStars)
          .fill("☆")
          .map((star, index) => (
            <span key={`empty-${index}`}>{star}</span>
          ))}
      </>
    );
  };

  return (
    <div className='reviewcarousel'>
      {list.length === 0 ? ( // 리스트가 비어 있는 경우
        <p>등록된 리뷰가 존재하지 않습니다.</p>
      ) : (
        <div
          className='reviewitemsContainer'
          style={{ transform: `translateX(-${currentIndex * 228}px)` }}
        >
          {list.map((item, index) => (
            <div key={`${item.member_id}-${index}`} className='reviewitem'>
              <div className='reviewinfo'>
                <h4>'{item.nickname}' 님이 남긴 후기</h4>
                <p style={{ color: 'black' }}>{item.content}</p>
                <p>{renderStars(item.rate)} <b style={{ color: "#B0B0B0", marginLeft: "5px" }}>{calculateDaysAgo(item.created_at)}</b></p>
              </div>
            </div>
          ))}
        </div>
      )}
      {list.length > 0 && ( // 리스트가 비어 있지 않은 경우에만 버튼 표시
        <>
          <button className='reviewprevBtn' onClick={handlePrev}>
            &lt;
          </button>
          <button className='reviewnextBtn' onClick={handleNext}>
            &gt;
          </button>
        </>
      )}
    </div>
  );
}

export default page;

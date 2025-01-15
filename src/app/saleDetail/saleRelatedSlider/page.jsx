"use client";
import React, { useEffect, useState } from 'react';
import './saleRelatedSlider.css'
import Link from 'next/link';
import axios from 'axios';

function page(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [list, setList] = useState([]);

  // 3. 하단에 판매 리스트 출력 서버
  useEffect(() => {
    console.log(">>> useEffect 실행됨");
    const getListData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/salespost/getsaledetail`); // axios를 활용한 API 호출
        console.log(response);
        const data = response.data.data;
        // 데이터를 랜덤으로 섞음
        const shuffledData = data.sort(() => Math.random() - 0.5);
        setList(shuffledData); // 랜덤으로 섞인 데이터 저장
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getListData();

  }, []);


  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % list.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + list.length) % list.length);
  };

  return (
    <div className='carousel'>
      <div
        className='itemsContainer'
        style={{ transform: `translateX(-${currentIndex * 228}px)` }}
      >
        {list.map((item) => (
          <div key={item.pwr_id} className='item'>
            <Link href={{
              pathname: "/saleDetail",
              query: {
                id: item.pwr_id,
              },

            }}
            >
              <img src={`http://localhost:8080/images/${item.fileList[0]?.fileName}`} alt={item.title} className='image' />
              <div className='info'>
                <p style={{margin: "0px 5px 5px 5px", fontSize: "14px"}}>{item.title}</p>
                <p style={{margin: "0px 5px", fontSize: "14px"}}>{Number(item.sell_price).toLocaleString()}원</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <button className='prevBtn' onClick={handlePrev}>
        &lt;
      </button>
      <button className='nextBtn' onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
}

export default page;
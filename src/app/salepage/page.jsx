"use client";
import React, { useEffect, useState } from "react";
import "./salepage.css";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import SalePageTabSlider from './salepagetabslider/page';
import ReviewList from './reviewlist/page';

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("전체"); // 현재 활성 탭 상태
  const [saleData, setSaleData] = useState({});
  const [saleTabData, setSaleTabData] = useState({});
  const [list, setList] = useState([]);
  // const API_URL = `http://localhost:8080/api/salepage`;

  // 데이터 로드 (최초 실행)
  useEffect(() => {
    if (id) {
      console.log('판매자 ID:', id);
      getData();
      getDataTab();
    } else {
      console.log('판매자 ID:', id);
      setLoading(false);
    }
  }, [id]);

  const getData = async () => {
    if (!id) {
      console.error("ID가 유효하지 않습니다:", id);
      return;
    }
    try {
      console.log("넘어온 id : ", id);

      const response = await axios.get(`http://localhost:8080/api/salepage/getpagedata?id=${id}`);
      console.log("response:", response);
      console.log("response.data.data :", response.data.data);

      const saleData = response.data.data;
      setSaleData(saleData); // 상태 업데이트
      console.log("saleData : " + saleData); // 원본 데이터 저장
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const getDataTab = async () => {
    if (!id) {
      console.error("ID가 유효하지 않습니다:", id);
      return;
    }
    try {
      console.log("넘어온 id : ", id);

      const response = await axios.get(`http://localhost:8080/api/salepage/gettabdata?id=${id}`);
      console.log("response:", response);
      console.log("response.data.data :", response.data.data);

      
      setSaleTabData(response.data.data || []); // 상태 업데이트
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 로딩 중 화면
  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab); // 활성 탭 상태 업데이트
  };

  //각 탭별 콘텐츠 컴포넌트
  const renderContent = () => {
    switch (activeTab) {
      case "전체":
      return <SalePageTabSlider id={id} />;
    case "판매중":
      return <SalePageTabSlider id={id} status="판매중" />;
    case "판매완료":
      return <SalePageTabSlider id={id} status="판매완료" />;
      case "거래후기":
        return <ReviewList id={id} review="review" />;
        
        // (
          // <div className="trade-review">
          //   <div className="review-item">
          //     <div className="profile-section">
          //       <img
          //         src="/images/human.jpg"
          //         alt="프로필 이미지"
          //         className="profile-image2"
          //       />
          //     </div>
          //     <div className="content-section">
          //       <div className="title-section">
          //         <span className="title">후기 제목</span>
          //         <span className="rating">⭐️⭐️⭐️⭐️</span>
          //       </div>
          //       <div className="review-content">후기 내용</div>
          //     </div>
          //   </div>
          // </div>
        // );
      default:
        return null;
    }
  };

 
  return (
    <div className="sell-profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="name-1">
            {/* saleData.nickname */}
            <h2>{saleData?.nickname || "닉네임"}</h2>
            <p>응답률 | 5분 안에 응답</p>
          </div>
          <div className="rating-reviews-box">
            <div className="rating">
              <span>평점 </span>
              <div className="score">{saleData?.rate || "0.0"}</div>
            </div>
            <div className="vertical-divider"></div>
            <div className="reviews">
              <span>거래후기</span>
              <div className="score">{saleData?.content || "0"}</div>
            </div>
          </div>
        </div>
        <div className="profile-image">
          {saleData?.profile_image == "" ? 
          <img 
          src="/images/default_profile.png" 
          alt="프로필 이미지"
          style={{width:'150px', height:'150px'}}
          /> : 
          <img src={saleData?.profile_image} alt="프로필 이미지" />}
          <br/>
          
        </div>
      </div>
      <div className="product-select">
        <h3 style={{ textAlign: "left" }}>판매상품</h3>
        <div className="tabs">
          <button onClick={() => handleTabClick("전체")}>전체</button>
          <button onClick={() => handleTabClick("판매중")}>판매중</button>
          <button onClick={() => handleTabClick("판매완료")}>판매완료</button>
          <button onClick={() => handleTabClick("거래후기")}>거래후기</button>
        </div>
      </div>
      {renderContent()} {/* 탭을 클릭할 때마다 renderContent()가 호출되어 클릭한 탭 내용 출력함함 */}
    </div>
  );
}

export default Page;

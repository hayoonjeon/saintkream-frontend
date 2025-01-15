"use client";
import { usePathname } from "next/navigation";
import MyPageSideNav from "../components/MyPageSideNav";
import "./myPageWishList.css";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../../store/authStore";
import { useRouter } from "next/navigation";

function Page() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState("찜 한 상품"); // 초기 필터 설정
  const [items, setItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]); // 최근 본 상품 데이터 추가
  const [member_id, setMember_id] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]); // 초기값 빈 배열
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  
  const [showSideNav, setShowSideNav] = useState(true); // 사이드바 보이기 여부 상태

  useEffect(() => {
    // 특정 조건에 따라 사이드바를 숨기거나 표시
    if (pathname.includes("/myPageWishList")) {
        setShowSideNav(true); // 구매 내역, 판매 내역 페이지에서는 숨기기
    } else {
        setShowSideNav(false); // 그 외 페이지에서는 표시
    }
}, [pathname]);
  

  // 사용자 ID 설정
  useEffect(() => {
    if (user?.member_id) {
      console.log("AuthStore에서 가져온 user:", user);
      setMember_id(user.member_id);
    } else {
      console.log("AuthStore에서 user 정보가 없습니다.");
    }
  }, [user]);

  // 찜 리스트 불러오기
  useEffect(() => {
    if (!user?.member_id) {
      console.log("member_id가 없습니다. 로그인 필요.");
      return;
    }

    console.log("member_id 확인:", user.member_id);

    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/wishlist/list", {
          params: { memberId: user.member_id },
        });

        console.log("Wishlist API 응답 데이터:", response.data);

        const wishlist = response.data.map((item) => ({
          ...item,
          category: "찜 한 상품", // 기본 카테고리 추가
        }));

        setItems(wishlist);
      } catch (error) {
        console.error("Wishlist API 요청 실패:", error);
        setItems([]);
      }
    };

    fetchWishlist();
  }, [user?.member_id]);






// 최근 본 상품 불러오기
useEffect(() => {
  if (!user?.member_id) {
    console.log("member_id가 없습니다. 로그인 필요.");
    return;
  }

  console.log("@최근 본 member_id@ 확인:", user.member_id);

  const fetchRecentViews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/recent-view/list", {
        params: { member_id: user.member_id },
      });
      console.log("최근 본 API 응답 데이터:", response.data);

      const recentview = response.data.map((item) => ({
        ...item,
        category: "최근 본 상품", // 기본 카테고리 추가
      }));

      setRecentItems(recentview);
    } catch (error) {
      console.error("recentview API 요청 실패:", error);
      setRecentItems([]);
    }
  };

  fetchRecentViews();
}, [user?.member_id]);

useEffect(() => {
  console.log("최근 본 상품 데이터:", recentItems);
}, [recentItems]);





  useEffect(() => {
    let filtered = [];
    console.log("현재 제발!!!!!!!! activeFilter:", activeFilter);
    if (activeFilter === "찜 한 상품") {
      filtered = items; // 찜 한 상품만 보여줌
    } else if (activeFilter === "최근 본 상품") {
      console.log("필터링된 최근 본 상품@@@@@@@@@:", filtered);
      filtered = recentItems; // 최근 본 상품만 보여줌
    }
    

    console.log("필터링된 아이템@@@@:", filtered); // 디버깅: 필터링된 결과 확인
    setFilteredItems(filtered);
    setTotalItems(filtered.length);
  }, [activeFilter, items, recentItems]);
  
  

  
  const handleProductClick = (item) => {
    router.push(`saleDetail?id=${item.pwr_id}`);
  };


  const handleDeleteItem = async (pwr_id, category) => {
  if (!member_id) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    console.log("삭제 요청:", { member_id, pwr_id, category });

    if (category === "찜 한 상품") {
      // 찜 한 상품 삭제 API 호출
      await axios.delete("http://localhost:8080/api/wishlist/delete", {
        data: { member_id, pwr_id },
        headers: { "Content-Type": "application/json" },
      });

      // 상태 업데이트
      setItems((prevItems) => prevItems.filter((item) => item?.pwr_id !== pwr_id));
      console.log("찜 한 상품 삭제 완료");
    } else if (category === "최근 본 상품") {

      // 최근 본 상품 삭제 API 호출
      await axios.delete("http://localhost:8080/api/recent-view/delete", {
        data: { member_id, pwr_id },
        headers: { "Content-Type": "application/json" },
      });

      // 상태 업데이트
      setRecentItems((prevItems) => prevItems.filter((item) => item?.pwr_id !== pwr_id));
      console.log("최근 본 상품 삭제 완료");
    }

    alert(`${category}이(가) 삭제되었습니다.`);
  } catch (error) {
    console.error(`${category} 삭제 중 오류 발생:`, error);
  }
};


  
  


  return (
    <div className="myPageWishList">
      <div className="container my lg">
      {showSideNav && <MyPageSideNav currentPath={pathname} />}
        <div className="content_area my-page-content">
          <div className="content_title border">
            <div className="title">
              <h3>관심</h3>
            </div>
          </div>
          <div className="saved-chips-container">
            <div className="filter_chip_group filter_group bubble">
              {["찜 한 상품", "최근 본 상품"].map((filter) => (
                <label key={filter} className="bubble">
                  <input
                    type="radio"
                    className="input blind"
                    value={filter}
                    checked={activeFilter === filter}
                    onChange={() => setActiveFilter(filter)}
                  />
                  <div>
                    <button
                      className={`filter_button line ${
                        activeFilter === filter ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      <p className="text-group">
                        <span className="title">{filter}</span>
                        <span className="num">
                        {[
                            ...items,
                            ...recentItems,
                          ].filter((item) => item && item.category === filter).length || 0}
                        </span>
                      </p>
                    </button>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="saved-product">
            <div>
              <div>
                <div className="my_interest">
                  <div className="content-header">
                    <div className="total-rows">전체 {totalItems}</div>
                  </div>
                </div>
                <div>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div
                        key={item.pwr_id}
                        className="purchase_list_display_item"
                        style={{ backgroundColor: "rgb(255, 255, 255)" }}
                        onClick={() => handleProductClick(item)}  // 상품 클릭 시 API 호출
                      >
                        <a href="#">
                          <div className="purchase_list_product">
                            <div className="list_item_img_wrap">
                              <img
                                alt="product_img"
                                src={`http://localhost:8080/images/${
                                  item.fileList?.[0]?.fileName || "default-image.png"
                                }`}
                                className="list_item_img"
                                style={{ backgroundColor: "rgb(244, 244, 244)" }}
                              />
                            </div>
                            <div className="list_item_title_wrap">
                              <p className="list_item_price">
                                {item.sell_price}원
                              </p>
                              <p className="list_item_title">{item.title}</p>
                            </div>
                          </div>
                        </a>
                        <p
                          className="text-lookup last_description display_paragraph action_named_action wish_delete"
                          onClick={(e) => {e.stopPropagation(); handleDeleteItem(item.pwr_id, item.category)}}
                          style={{ cursor: "pointer" }}
                        >
                          삭제
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>{activeFilter}이(가) 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;

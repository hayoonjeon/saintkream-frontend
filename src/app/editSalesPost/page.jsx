"use client";
import React, { useEffect, useState } from "react";
import "./editSalesPost.css";
import axios from "axios";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from '../../../store/authStore';

function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pwr_id = searchParams.get('pwr_id'); // URL에서 pwr_id 가져오기
  const { user } = useAuthStore();
  const [images, setImages] = useState([]);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [isDeliveryTransaction, setIsDeliveryTransaction] = useState(false);
  const [isInPersonTransaction, setIsInPersonTransaction] = useState(false);
  const [zipCode, setZipcode] = useState();
  const [addressInput, setAddressInput] = useState();
  const [uploadImages, setuploadImages] = useState([]);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("카테고리");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedSmallCategory, setSelectedSmallCategory] = useState('');
  const [isBigCategoryDropdownActive, setIsBigCategoryDropdownActive] = useState(false); // 대분류 드롭다운 상태
  const [isSmallCategoryDropdownActive, setIsSmallCategoryDropdownActive] = useState(false); // 소분류 드롭다운 상태

  // 대분류에 따른 소분류 목록
  const categories = {
    '아우터': ['패딩', '코트', '바람막이', '자켓', '가디건', '블루종', '조끼', '아노락'],
    '상의': ['맨투맨', '셔츠/블라우스', '후드티', '니트', '피케', '긴팔', '반팔', '민소매 티셔츠', '원피스'],
    '하의': ['데님', '코튼', '슬랙스', '트레이닝', '숏'],
    '신발': ['운동화', '구두', '워커/부츠', '샌들', '슬리퍼', '하이힐'],
    '가방': ['백팩', '크로스백', '토트백', '캐리어', '클러치백'],
    '패션잡화': ['모자', '양말', '목도리', '안경', '시계', '주얼리', '벨트', '피어싱']
  };

  const toggleBigCategoryDropdown = () => {
    setIsBigCategoryDropdownActive(!isBigCategoryDropdownActive);
  };

  const toggleSmallCategoryDropdown = () => {
    setIsSmallCategoryDropdownActive(!isSmallCategoryDropdownActive);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      sup_category: category, // 대분류 반영
    }));
    setIsBigCategoryDropdownActive(false);
  };

  const selectSmallCategory = (smallCategory) => {
    setSelectedSmallCategory(smallCategory);
    setFormData((prev) => ({
      ...prev,
      sub_category: smallCategory, // 소분류 반영
    }));
    setIsSmallCategoryDropdownActive(false);
  };

  const handleDirectTransactionChange = (e) => {
    const isChecked = e.target.checked;
    setIsInPersonTransaction(isChecked);
    setFormData((prev) => ({
      ...prev,
      is_direct: isChecked ? 1 : 0, // true -> 1, false -> 0
    }));
  };

  const handleDeliveryTransactionChange = (e) => {
    const isChecked = e.target.checked;
    setIsDeliveryTransaction(isChecked);
    setFormData((prev) => ({
      ...prev,
      is_delivery: isChecked ? 1 : 0, // true -> 1, false -> 0
    }));
  };

  const member_id = user.member_id;
  console.log(member_id);

  const [formData, setFormData] = useState({
    pwr_id: '',
    member_id: member_id || '',
    selling_area_id: '',
    title: '',
    sell_price: '',
    description: '',
    is_direct: false,
    is_delivery: false,
    sup_category: '',
    sub_category: '',
    status: '',
    longitude: '',
    latitude: '',
  });

  // 서버에서 게시물 데이터를 가져오는 함수
  const fetchPostData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/salespost/itemone`, {
        params: { id: pwr_id },
      });

      if (response.data.success) {
        const post = response.data.data;
        console.log("Fetched Post Data:", post);

        // 가져온 데이터를 폼 상태에 채우기
        setFormData({
          pwr_id: post.pwr_id,
          member_id: post.member_id,
          selling_area_id: post.selling_area_id,
          title: post.title,
          sell_price: post.sell_price,
          description: post.description,
          is_direct: post.is_direct === '1',
          is_delivery: post.is_delivery === '1',
          sup_category: post.sup_category,
          sub_category: post.sub_category,
          status: post.status,
          longitude: post.longitude,
          latitude: post.latitude,
        });

        // 카테고리 초기값 반영
        setSelectedCategory(post.sup_category);
        setSelectedSmallCategory(post.sub_category);

        // 거래방법 초기값 반영
        setIsInPersonTransaction(post.is_direct === '1'); // true/false 변환
        setIsDeliveryTransaction(post.is_delivery === '1'); // true/false 변환

        // 위도, 경도 초기값 반영
        console.log("포스트경도:", post.longitude);
        setLongitude(post.longitude);
        setLatitude(post.latitude);

        // 이미지 파일 리스트 채우기
        if (post.fileList && post.fileList.length > 0) {
          setImages(post.fileList.map((file) => `http://localhost:8080/images/${file.fileName}`));
        }
      } else {
        console.error("Failed to fetch post data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  useEffect(() => {
    if (pwr_id) fetchPostData(); // pwr_id가 있을 때만 데이터 가져오기
  }, [pwr_id]);

  const convertDataURLToFile = async (dataURL, fileName) => {
    const response = await axios.get(dataURL, {
      responseType: "blob",
    });
    const blob = response.data;
    const imgFile = new File([blob], fileName, { type: blob.type });
    return imgFile;
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then((results) => {
      setImages((prevImages) => [...prevImages, ...results]);
    });
  };

  const toggleDropdown = () => {
    setIsDropdownActive(!isDropdownActive);
  };



  const openImageModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => {
      if (images.length === 0) return null; // Handle empty images case
      return (prev + 1) % images.length;
    });
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => {
      if (images.length === 0) return null; // Handle empty images case
      return (prev - 1 + images.length) % images.length;
    });
  };

  const deleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex > index) {
      setSelectedImageIndex((prev) => prev - 1);
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData, // 기존 값 유지
      [name]: value // 변경된 값만 업데이트
    });
  };
  const handleSubmit = async () => {
    const API_URL = `http://localhost:8080/api/salespost/salesupdate`;
    const data = new FormData();
    data.append("pwr_id", formData.pwr_id);
    data.append("member_id", formData.member_id);
    data.append("selling_area_id", formData.selling_area_id);
    data.append("title", formData.title);
    data.append("sell_price", formData.sell_price);
    data.append("description", formData.description);
    data.append("sup_category", selectedCategory);
    data.append("sub_category", selectedSmallCategory);
    data.append("is_direct", isInPersonTransaction);
    data.append("is_delivery", isDeliveryTransaction);
    data.append("longitude", longitude);
    data.append("latitude", latitude);
    console.log("폼데이터 정보 확인 : " + data);

    if (images.length >= 1) {
      for (let i = 0; i < images.length; i++) {
        const imgFile = await convertDataURLToFile(
          images[i],
          `images_${i}.jpg`
        );
        data.append("files", imgFile);
        console.log("이미지파일: ", imgFile);
      }
    }

    try {
      const response = await axios.post(API_URL, data,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (response.data.success) {
        console.log("success 체크중");
        alert(response.data.message);
        router.push("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      // console.error('오류 발생:', error.name);   // 오류 이름
      // console.error('오류 메시지:', error.message); // 오류 메시지
      // console.error('스택 트레이스:', error.stack); // 스택 트레이스
    }
  }


  const sample4_execDaumPostcode = () => {
    if (!daum?.Postcode) {
      alert('우편번호 스크립트가 아직 로드되지 않았습니다.');
      return;
    }
    new daum.Postcode({
      oncomplete: function (data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        const roadAddr = data.roadAddress; // 도로명 주소 변수
        let extraRoadAddr = ''; // 참고 항목 변수

        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ',' + `${data.buildingName}` : data.buildingName);
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraRoadAddr !== '') {
          extraRoadAddr = `(${extraRoadAddr})`;
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.

        setZipcode(data.zonecode);
        setAddressInput(roadAddr + extraRoadAddr);

        setFormData({
          ...formData, // 기존 값 유지
          ["selling_area_id"]: data.zonecode // 변경된 값만 업데이트
        });


        // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
        if (roadAddr !== '') {
          // setAddressInput(roadAddr + extraRoadAddr);
          setFormData({
            ...formData, // 기존 값 유지
            ["selling_area_id"]: (roadAddr + extraRoadAddr) // 변경된 값만 업데이트
          });
        }
      }
    }).open();
  }
  useEffect(() => {
    getPosition(addressInput);

  }, [addressInput]);

  const getPosition = async (address) => {
    const url = `https://dapi.kakao.com/v2/local/search/address?query=${address}`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `KakaoAK c511457645936818e2db5ecdc890dc9d`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const { x, y } = data.documents[0];

        setLongitude(x);
        setLatitude(y);

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>

      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy='afterInteractive'
      />
      <div className="product-page">
        {/* Daum 우편번호 스크립트 로드 */}

        {/* <h3 style={{textAlign:'center', fontWeight:'30px'}}>판매등록</h3> */}
        <div className="image-upload">

          <label htmlFor="file-input" className="upload-button">
            <span className="camera-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
              <path d="M20 4h-3.2l-1.2-2h-6.4l-1.2 2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2h16c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.89-2-1.99-2z" fill="none" stroke="gray" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="gray" strokeWidth="2" />
            </svg>
            </span>
            <span className="add-icon">+</span>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            // value={}
            multiple
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>

        <div className="image-gallery">
          {images.map((image, index) => (
            <div key={index} className="gallery-item">
              <img
                src={image}
                alt={`Uploaded ${index}`}
                className="gallery-thumbnail"
                onClick={() => openImageModal(index)}
              />
              <button className="delete-button" onClick={() => deleteImage(index)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {selectedImageIndex !== null && (
          <div className="image-modal">
            <div className="modal-overlay" onClick={closeImageModal}></div>
            <div className="modal-content">
              <img
                src={images[selectedImageIndex]}
                alt={`Selected ${selectedImageIndex}`}
                className="modal-image"
              />
            </div>
          </div>
        )}

        <input type="text" className="product-name" placeholder="상품명" name="title" value={formData.title} onChange={handleChange} />

        <div className="category-drop">
          <div className="button-container">
            <button className="big_category_btn" onClick={toggleBigCategoryDropdown}>
              {selectedCategory}
            </button>

            <ul className={`drop_down ${isBigCategoryDropdownActive ? 'active' : ''}`}>
              <li className="drop_list" onClick={() => selectCategory("아우터")}>아우터</li>
              <li className="drop_list" onClick={() => selectCategory("상의")}>상의</li>
              <li className="drop_list" onClick={() => selectCategory("하의")}>하의</li>
              <li className="drop_list" onClick={() => selectCategory("신발")}>신발</li>
              <li className="drop_list" onClick={() => selectCategory("가방")}>가방</li>
              <li className="drop_list" onClick={() => selectCategory("패션잡화")}>패션잡화</li>
            </ul>
          </div>
          <a style={{ color: 'white', width: '30px' }}>.....</a>
          {selectedCategory !== '카테고리' && (
            <div className="button-container">
              <button className="small_category_btn" onClick={toggleSmallCategoryDropdown}>
                {selectedSmallCategory || '소분류'}
              </button>

              {categories[selectedCategory] && categories[selectedCategory].length > 0 && (
                <ul className={`drop_down2 ${isSmallCategoryDropdownActive ? 'active' : ''}`}>
                  {categories[selectedCategory].map((item, index) => (
                    <li key={index} className="drop_list2" onClick={() => selectSmallCategory(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <input type="text" className="price" placeholder="배송비를 포함한 가격을 입력해 주세요." onChange={handleChange} value={formData.sell_price} name="sell_price" />
        <textarea className="product-explain" placeholder="상품설명" onChange={handleChange} value={formData.description} name="description" ></textarea>
        <p style={{ textAlign: "left" }}>  *  선호하는 직거래 위치</p>
        <div className="location">
          <input type="text" placeholder="  우편 번호를 입력하세요" onChange={handleChange} value={formData.selling_area_id} name="selling_area_id" />
          <button className="postal-info" onClick={sample4_execDaumPostcode}>우편번호</button>
        </div>
        <ul style={{ padding: '0px' }}>
          <li>
            <div className="trade-check" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="check1-delivery"
                type="checkbox"
                className="blind"
                checked={isDeliveryTransaction}
                onChange={handleDeliveryTransactionChange}
              />
              <label htmlFor="check1-delivery" className="check_label" style={{ maxHeight: '30px', display: 'flex', alignItems: 'center' }}>
                {isDeliveryTransaction ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="ico-close icon sprite-icons"
                  >
                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="ico-uncheck icon sprite-icons"
                  >
                    <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm16 400c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352c8.8 0 16 7.2 16 16v352z" />
                  </svg>
                )}
                <span className="label_txt" style={{ marginLeft: '8px' }}>택배거래</span>
              </label>
            </div>
          </li>
          <li>
            <div className="trade-check" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="check1-inperson"
                type="checkbox"
                className="blind"
                checked={isInPersonTransaction}
                onChange={handleDirectTransactionChange}
              />
              <label htmlFor="check1-inperson" className="check_label" style={{ maxHeight: '30px', display: 'flex', alignItems: 'center' }}>
                {isInPersonTransaction ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="ico-close icon sprite-icons"
                  >
                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="ico-uncheck icon sprite-icons"
                  >
                    <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm16 400c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352c8.8 0 16 7.2 16 16v352z" />
                  </svg>
                )}
                <span className="label_txt" style={{ marginLeft: '8px' }}>직거래</span>
              </label>
            </div>
          </li>
        </ul>
        <button className="register-button" onClick={handleSubmit}>등 록</button>
      </div>
    </>
  );
}

export default ProductPage;
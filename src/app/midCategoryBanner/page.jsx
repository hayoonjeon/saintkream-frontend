import React, { useState } from 'react';
import './midCategoryBanner.css';

// 이미지 객체
const images = {
  outerList: [
    { src: '01subcategory_padding.png', alt: '패딩', title: '패딩' },
    { src: '02subcategory_coat.png', alt: '코트', title: '코트' },
    { src: '03subcategory_windcutter.png', alt: '바람막이', title: '바람막이' },
    { src: '04subcategory_jacket.png', alt: '자켓', title: '자켓' },
    { src: '05subcategory_cadigan.png', alt: '가디건', title: '가디건' },
    { src: '06subcategory_bljon.png', alt: '블루종', title: '블루종' },
    { src: '07subcategory_vest.png', alt: '조끼', title: '조끼' },
    { src: '08subcategory_anorock.png', alt: '아노락', title: '아노락' }
  ],
  topList: [
    { src: '10subcategory_mtm.png', alt: '맨투맨', title: '맨투맨' },
    { src: '11subcategory_shirt.png', alt: '셔츠/블라우스', title: '셔츠/블라우스' },
    { src: '12subcategory_hood.png', alt: '후드티', title: '후드티' },
    { src: '13subcategory_neet.png', alt: '니트', title: '니트' },
    { src: '14subcategory_pk.png', alt: '피케', title: '피케' },
    { src: '15subcategory_long_tshirt.png', alt: '긴팔', title: '긴팔' },
    { src: '16subcategory_short_tshirt.png', alt: '반팔', title: '반팔' },
    { src: '17subcategory_sleeveless.png', alt: '민소매 티셔츠', title: '민소매 티셔츠' },
    { src: '18subcategory_onepiece.png', alt: '원피스', title: '원피스' }
  ],
  bottomList: [
    { src: '21subcategory_denim.png', alt: '데님', title: '데님' },
    { src: '22subcategory_cottn.png', alt: '코튼', title: '코튼' },
    { src: '23subcategory_slacs.png', alt: '슬랙스', title: '슬랙스' },
    { src: '24subcategory_training.png', alt: '트레이닝', title: '트레이닝' },
    { src: '25subcategory_shortpants.png', alt: '숏', title: '숏' }   //숏으로 해야 검색됨
  ],
  shoesList: [
    { src: '31subcategory_trainingshoes.png', alt: '운동화', title: '운동화' },
    { src: '32subcategory_goodoo.png', alt: '구두', title: '구두' },
    { src: '33subcategory_boots.png', alt: '워커/부츠', title: '워커/부츠' },
    { src: '34subcategory_sandle.png', alt: '샌들', title: '샌들' },
    { src: '35subcategory_sleap.png', alt: '슬리퍼', title: '슬리퍼' },
    { src: '36subcategory_highhill.png', alt: '하이힐', title: '하이힐' }
  ],
  bagsList: [
    { src: '41subcategory_backpack.png', alt: '백팩', title: '백팩' },
    { src: '42subcategory_crossbag.png', alt: '크로스백', title: '크로스백' },
    { src: '43subcategory_ttbag.png', alt: '토트백', title: '토트백' },
    { src: '44subcategory_carrier.png', alt: '캐리어', title: '캐리어' },
    { src: '45subcategory_clutch.png', alt: '클러치백', title: '클러치백' }
  ],
  accessoriesList: [
    { src: '51subcategory_cap.png', alt: '모자', title: '모자' },
    { src: '52subcategory_sox.png', alt: '양말', title: '양말' },
    { src: '53subcategory_muffler.png', alt: '목도리', title: '목도리' },
    { src: '54subcategory_eyewear.png', alt: '안경', title: '안경' },
    { src: '55subcategory_watch.png', alt: '시계', title: '시계' },
    { src: '56subcategory_jwel.png', alt: '주얼리', title: '주얼리' },
    { src: '57subcategory_belt.png', alt: '벨트', title: '벨트' },
    { src: '58subcategory_earing.png', alt: '피어싱', title: '피어싱' }
  ],
  // 추가 이미지들
};

function Page({ category }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // supCategory 결정 (URL 매핑용)
  const supCategory = `${category}`.replace('List', ''); // 예: outerList → outer

  // images 객체에서 카테고리에 해당하는 배열을 가져오기
  const currentImages = images[category] || [];
  const totalPages = Math.ceil(currentImages.length / itemsPerPage);

  // 현재 페이지에 해당하는 이미지들만 가져오기
  const displayedImages = currentImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="midCategory-container">
      <div className="pagination">
        <button
          className="prev-btn"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <img src="/images/HJ_benner_left.png" alt="왼쪽" />
        </button>
        <div className="image-container">
          {displayedImages.map((image, index) => (
            <div key={index} className="image-item">
              <a href={`/${supCategory}List?sub_category=${image.title}`}>
                <img
                  src={`/images/${image.src}`}
                  alt={image.alt}
                  title={image.title}
                  className='mid_category_img'
                />
              </a>
              {/* 카테고리 이름 추가 */}
              <p className="image-title">{image.title}</p>
            </div>
          ))}
        </div>
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <img src="/images/HJ_benner_right.png" alt="오른쪽" />
        </button>
      </div>
    </div>
  );
}

export default Page;

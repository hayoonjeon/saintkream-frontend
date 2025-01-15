import Link from 'next/link';
import styles from './Page.module.css'; // CSS 모듈 임포트


const Page = ({ data }) => {
  console.log("ItemCard 데이터:", data);

  
  // 안전한 접근을 위해 fileList와 fileName을 조건부로 처리
  const fileName = data.fileList && data.fileList.length > 0 ? data.fileList[0].fileName : null;


  function formatTimeAgo(created_at) {
    const createdTime = new Date(created_at); // `created_at` 문자열을 Date 객체로 변환
    const now = new Date(); // 현재 시간
    const diff = Math.floor((now - createdTime) / 1000); // 초 단위 시간 차이

    if (diff < 60) {
      return `${diff}초 전`;
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes}분 전`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours}시간 전`;
    } else {
      const days = Math.floor(diff / 86400);
      return `${days}일 전`;
    }
  }

  const isBlurNeeded =
    data.status === '판매완료';   
  console.log(data.status);

  return (
    <>
    <Link
        prefetch={false}
        href={{
          pathname: "/saleDetail",
          query: {
            id: data.pwr_id,
            },
        }}
      >
        <div className={styles.product_card_container}>
          {/* 이미지 영역 */}
          <div className={styles.product_img} >
            <img
              src={`http://localhost:8080/images/${data.fileList[0]?.fileName}`}
              alt="판매 아이콘"
              style={{ borderRadius: '12px' }}
              className={isBlurNeeded ? styles.blur_image : ''}
            />
            {isBlurNeeded && (
              <div className={styles.statusOverlay}>
                {data.status}
              </div>
            )}
          </div>
          <div className={styles.product_info}>
            <div className={styles.info_top}>
              <span className={styles.item_com}>{data.name}</span>
              <p className={styles.item_title}>{data.title}</p>
            </div>
            <div className={styles.info_bottom}>
              <span className={styles.price_font}>{Number(data.sell_price).toLocaleString()}원</span>
              <p className={styles.date_font}>{formatTimeAgo(data.created_at)}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Page;
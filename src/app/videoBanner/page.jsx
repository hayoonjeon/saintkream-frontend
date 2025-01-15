'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './videoBanner.module.css';

const Page = () => {
  const videos = [
    '/videos/video1.mp4',
    '/videos/video2.mp4',
    '/videos/video3.mp4',
    '/videos/video4.mp4',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

  // 비디오 슬라이드 변경 함수
  const changeSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // 슬라이드 변경 시 비디오 재생
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentVideo) {
        currentVideo.play().catch((error) => console.error('Video play failed:', error));
      } else if (currentVideo) {
        currentVideo.pause();
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    if (currentVideo) {
      currentVideo.muted = true;
      currentVideo.currentTime = 0;
      currentVideo.play().catch((error) => console.error('Video play failed:', error));
    }
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentIndex]);

  // 10초마다 자동 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(changeSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='video-container' style={{ textAlign: 'center' }}>
      <div className={styles.videoBanner}>
        <div className={styles.videoSlides} style={{ backgroundColor: '#000000', height: '414px' }}>
          {videos.map((video, index) => (
            <div
              key={index}
              className={`${styles.videoSlide} ${index === currentIndex ? styles.active : ''}`}
              style={{ display: index === currentIndex ? 'block' : 'none' }} // DOM에서 유지하고 스타일로 숨김
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)} // ref로 비디오 저장
                className={styles.video}
                muted
                preload="auto"
                onEnded={changeSlide}
              >
                <source src={video} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        {/* 페이징 버튼 */}
        <div className={styles.pagination}>
          {videos.map((_, index) => (
            <span
              key={index}
              className={`${styles.pageDot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`동영상 ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;



// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import styles from './videoBanner.module.css';

// const Page = () => {
//   const videos = [
//     '/videos/video1.mp4',
//     '/videos/video2.mp4',
//     '/videos/video3.mp4',
//     '/videos/video4.mp4', // 새로운 동영상 추가
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const videoRefs = useRef([]);

//   // 비디오 슬라이드 변경 함수
//   const changeSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
//   };

//   // 슬라이드 변경 시 비디오 재생
//   useEffect(() => {
//     const currentVideo = videoRefs.current[currentIndex];
//     if (currentVideo) {
//       currentVideo.muted = true; // 재생 전에 음소거 설정
//       currentVideo.currentTime = 0; // 비디오를 처음으로 설정
//       currentVideo.play().catch((error) => console.error('Video play failed', error));
//     }
//   }, [currentIndex]);

//   // 10초마다 자동 슬라이드 전환
//   useEffect(() => {
//     const interval = setInterval(changeSlide, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className='video-container' style={{ textAlign: 'center' }}>
//       <div className={styles.videoBanner}>
//         <div className={styles.videoSlides} style={{ backgroundColor: '#000000', height: '414px' }}>
//           {videos.map((video, index) => (
//             <div
//               key={index}
//               className={`${styles.videoSlide} ${index === currentIndex ? styles.active : ''}`}
//             >
//               {index === currentIndex && (
//                 <video
//                   ref={(el) => (videoRefs.current[index] = el)} // ref로 비디오 저장
//                   className={styles.video}
//                   muted
//                   preload="auto" // 비디오 미리 로드
//                   onEnded={changeSlide} // 비디오 종료 시 다음 비디오로
//                 >
//                   <source src={video} type="video/mp4" />
//                 </video>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* 페이징 버튼 */}
//         <div className={styles.pagination}>
//           {videos.map((_, index) => (
//             <span
//               key={index}
//               className={`${styles.pageDot} ${index === currentIndex ? styles.activeDot : ''}`}
//               onClick={() => setCurrentIndex(index)}
//               aria-label={`동영상 ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

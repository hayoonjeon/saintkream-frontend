'use client'
import { useRouter } from "next/navigation";
import ItemList from "./itemList/page";
import { useEffect, useState } from "react";
import useAuthStore from '../../store/authStore';
import Notifications from './notifications/page'
// page.js는 필수 이다. (생략 불가)
// 각 경로(/, /about, /content 등등) 마다 페이지를 렌더링 하려면 
// 해당 경로의 page.js 파일이 반드시 필요하다. 

// 자식 컴포넌트 
// 하지만 부모컴포넌트는 없어도 되고, 자식컴포넌트는 없으면 안된다.
export default function Home() {
  // const {isNotibarActive} = useAuthStore();
  const router = useRouter();
  const [isMainPage, setIsMainPage] = useState('<></>');
  useEffect(() => {
    // 현재 경로가 '/'인지 확인
    setIsMainPage('/');

  }, [router.pathname]);

  return (
    // 해당 내용은 부모컴포넌트(layout.js)의 props {children} 에 삽입된다.
    <>
      {/* <h1>Welcome</h1> */}
      {/* 이미지 자체를 임포트하지 않으면 너비 높이를 받드시 지정해줘야한다. */}
      {/* <p><Image src="/images/car1.jpg" alt="" width={350} height={200}/></p> */}
      {/* 너비, 높이는 선택사항 */}
      {/* <p><Image src={img01} alt="" width={350} height={200}/></p> */}
      {/* <MyPage/> */}
      {isMainPage === '/' ? <ItemList /> : <></>}
      {/* {isNotibarActive && <Notifications />} */}
    </>
  );
}

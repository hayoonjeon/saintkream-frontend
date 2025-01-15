import { create } from "zustand";
import { persist } from "zustand/middleware";
const useAuthStore = create(
    persist(
        (set) => ({
            user: null, // 사용자 정보
            token: null, // JWT 토큰
            isAuthenticated: false, // 로그인 여부
            // 로그인 처리
            login: (user, token) => {
                console.log("로그인 상태 업데이트:", user, token);
                set({ user, token, isAuthenticated: true });
            },
            // 로그아웃 처리
            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });

                // 추가로 로컬 스토리지에서 삭제 (보안 강화)
                localStorage.removeItem("auth-storage");
            },
            // 상태를 초기화하는 기능 추가
            reset: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            // 검색 상태 관리
            searchKeyword: "", // 검색어 상태
            category: "", // 카테고리 상태
            searchBarActive: false, // 검색창 활성화 상태 추가

            setKeyword: (word) => {
                console.log("주스탠드에 새로 입력된 검색어 세팅:", word);
                set({ searchKeyword: word, searchBarActive: true});
            },
            setCategory: (path) => {
                // 경로를 한글 카테고리로 매핑
                const categoryMap = {
                    "/outerList": "아우터",
                    "/topList": "상의",
                    "/bottomList": "하의",
                    "/shoesList": "신발",
                    "/bagsList": "가방",
                    "/accessoriesList": "패션잡화",
                };

                const category = categoryMap[path] || ""; // 경로에 해당하는 한글 값 설정
                console.log("주스탠드에 새로 설정된 카테고리:", category);
                set({ category });
            },
            resetKeyword: () => {
                set({ searchKeyword: "" });
                 //     localStorage.removeItem("auth-storage");    //로그인풀리는문제 수정
            },


            isNotibarActive: false,
            setIsNotibarActive: () => {
                set((state) => ({ isNotibarActive: !state.isNotibarActive }));
            },
        }),
        {
            name: "auth-storage", // 로컬스토리지 키 이름
            getStorage: () => localStorage, // 로컬스토리지 사용
        }
    )
);

// const useAuthStore = create(
//     persist(
//         (set) => ({
//             user: null, // 초기 상태를 null로 설정
//             token: null, // JWT 토큰
//             isAuthenticated: false, // 로그인 여부

//             // 로그인 처리
//             login: (user, token) => {
//                 if (user && token) {
//                     console.log("로그인 상태 업데이트:", user, token);
//                     set({ user, token, isAuthenticated: true });
//                 } else {
//                     console.error("로그인 데이터가 유효하지 않습니다.");
//                 }
//             },

//             // 로그아웃 처리
//             logout: () => {
//                 set({ user: null, token: null, isAuthenticated: false });
//                 localStorage.removeItem("auth-storage"); // 로컬스토리지 초기화
//             },

//             reset: () => {
//                 set({ user: null, token: null, isAuthenticated: false });
//             },
//         }),
//         {
//             name: "auth-storage", // 로컬스토리지 키 이름
//             getStorage: () => localStorage, // 로컬스토리지 사용
//         }
//     )
// );




export default useAuthStore;
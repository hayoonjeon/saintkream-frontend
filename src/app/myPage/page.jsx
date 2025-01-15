"use client";
import './mypage.css';
import MyPageSideNav from '../components/MyPageSideNav';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import PurchaseHistory from '../myPageBuy/page'; // 구매 내역 컴포넌트
import SellHistory from '../myPageSell/page'; // 판매 내역 컴포넌트
import WishList  from '../myPageWishList/page';// 관심 페이지지
import { Link } from '@mui/material';

import axios from 'axios';

function Page(props) {
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState();
    const [wishlist, setWishlist] = useState([]);

    const { user } = useAuthStore();

    const member_id = user?.member_id;

    const handleModalOpen = () => {
        setIsModalOpen(true); // 모달 열기
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // 모달 닫기
    };
    

    return (
        <div className='myPage'>
            <div className='container my lg'>
                <MyPageSideNav currentPath={pathname} />
                <div className='content_area my-page-content'>
                    <div className='v_portal' style={{ display: "none" }}></div>
                    <div className='my_home'>
                        <div>
                            {/* 사용자 정보 */}
                            <div className='user_membership'>
                                <div className='user_detail'>
                                    <div className='user_thumb'>
                                        <img src="/images/JH_userImg.png" alt="user_img" className='thumb_img' />
                                    </div>
                                    <div className='user_info'>
                                        <div className='info_box'>
                                            <strong className='name'>{user?.nickname ?? user?.name ?? "닉네임 없음"}</strong>
                                            <p className='email'>{user?.email ?? "이메일 없음"}</p>
                                        </div>
                                        <div className='info-buttons'>
                                            <Link href="http://localhost:3000/myPageProfileInfo" className="btn btn outlinegrey small">
                                                프로필 관리
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 구매 내역 */}
                            <div>

                                <div className='recent_purchase'>
                                    <PurchaseHistory />
                                </div>
                            </div>
                            {/* 판매 내역 */}
                            <div>
                                <div className='recent_purchase'>
                                    <SellHistory />
                                </div>
                            </div>


                            {/* 관심 상품 */}
                            <div>
                                <div>
                                    <WishList />
                                </div>
                            </div>



                            {/* 관심 상품 */}
                            {/* <div>
                                <div className='my_home_title'>
                                    <h3>관심 상품</h3>
                                </div>
                                <div className='interest_product'>
                                    <div className='product_list'>
                                        <div className='product_item'>
                                            <div className='item_inner'>
                                                <div className='thumb_box'>
                                                    <div className='product' style={{ backgroundColor: "rgb(244, 244, 244)" }}>
                                                        <picture className='picture product_img'>
                                                            <source type="image/webp" srcSet='/images/JH_itemImg2.png' />
                                                            <source srcSet='/images/JH_itemImg2.png' />
                                                            <img alt="Nike Air Max" src="/images/JH_itemImg2.png" loading='lazy' className='image full_width' />
                                                        </picture>
                                                        <span aria-label='관심상품' role='button' className='btn_wish'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className='icon sprite-icons ico-wish-on'>
                                                                <use href="/JH_wishIco.svg#i_ico-wish-on" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='info_box'>
                                                    <div className='brand'>
                                                        <p className='brand-text'>
                                                            <span className='brand-name'>상품 이름</span>
                                                        </p>
                                                    </div>
                                                    <div className='price'>
                                                        <div className='amount lg'>
                                                            <em className='text-lookup num bold display_paragraph line_break_by_truncating_tail'
                                                                style={{ color: "rgb(34, 34, 34)" }}>80,000원</em>
                                                        </div>
                                                        <div className='desc'>
                                                            <p className='text-lookup display_paragraph line_break_by_truncating_tail' style={{ color: "rgb(167, 167, 167)" }}>10분 전</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* 관심상품 끝 */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;

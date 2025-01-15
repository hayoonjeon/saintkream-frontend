import Link from 'next/link';
import React from 'react';
import './css/MyPageSideNav.css';

const MyPageSideNav = ({ currentPath }) => {

    const isActive = (href) => currentPath === href;
    console.log(currentPath)
    return (
        <div className='myPageSideNav'>
            
                <div className='snb_area'>
                    <Link href="/myPage" aria-current="page">
                        <h2 className='snb_main_title'>마이 페이지</h2>
                    </Link>
                    <nav className='snb'>
                        <div className='snb_list'>
                            <strong className='snb_title'>쇼핑 정보</strong>
                            <ul className='snb_menu'>
                                <li className='menu_item'>
                                    <Link href='/myPageBuy' className={`menu_link ${isActive('/myPageBuy') ? 'active' : ''}`}> 구매 내역 </Link>
                                </li>
                                <li className='menu_item'>
                                    <Link href='/myPageSell' className={`menu_link ${isActive('/myPageSell') ? 'active' : ''}`}> 판매 내역 </Link>
                                </li>
                                <li className='menu_item'>
                                    <Link href='/myPageWishList' className={`menu_link ${isActive('/myPageWishList') ? 'active' : ''}`}> 관심 </Link>
                                </li>
                            </ul>
                        </div>
                        <div className='snb_list'>
                            <strong className='snb_title'>내 정보</strong>
                            <ul className='snb_menu'>
                                <li className='menu_item'>
                                    <Link href='/myPageLoginInfo' className={`menu_link ${isActive('/myPageLoginInfo') ? 'active' : ''}`}> 로그인 정보 </Link>
                                </li>
                                <li className='menu_item'>
                                    <Link href='/myPageProfileInfo' className={`menu_link ${isActive('/myPageProfileInfo') ? 'active' : ''}`}> 프로필 관리 </Link>
                                </li>
                                <li className='menu_item'>
                                    <Link href='/myPageAddressInfo' className={`menu_link ${isActive('/myPageAddressInfo') ? 'active' : ''}`}> 주소록 </Link>
                                </li>
                                <li className='menu_item'>
                                    <a href='/myPageAccountInfo' className={`menu_link ${isActive('/myPageAccountInfo') ? 'active' : ''}`}> 판매 정산 계좌 </a>
                                </li>
                                <li className='menu_item'>
                                    <a href='/myPagePayOuts' className={`menu_link ${isActive('/myPagePayOuts') ? 'active' : ''}`}> 정산 내역 </a>
                                </li>
                                <li className='menu_item'>
                                    <a href='/myPageReviews' className={`menu_link ${isActive('/myPageReviews') ? 'active' : ''}`}> 거래 후기 </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
        </div>
    );
};

export default MyPageSideNav;
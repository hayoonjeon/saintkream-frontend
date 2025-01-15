"use client";
import { usePathname } from 'next/navigation';
import MyPageSideNav from '../components/MyPageSideNav';
import './myPagePayOuts.css';
import { useState } from 'react';
import Link from 'next/link';
import SellHistory from '../myPageSell/page'; // 판매 내역 컴포넌트
import Account from '../myPageAccountInfo/page'; // 판매 내역 컴포넌트
function Page(props) {
    const pathname = usePathname();

    // 기본 배송지 상태 (ID로 구분)
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            bank_name: "카카오뱅크",
            account_number: "3333096133333",
            account_holder_name: "전영빈",
        },
    ]);

    const [defaultId, setDefaultId] = useState(1);

    return (

        <div className='myPagePayOuts'>
            <div className='container my lg'>
                <MyPageSideNav currentPath={pathname} />
                <div className='content_area my-page-content'>
                    <div className='my_addressbook'>
                        <div className='content_title'>
                            <div className='main_title'>
                                <h3>정산 내역</h3>
                            </div>
                        </div>
                        {/* 기본 정산 계좌
                        <div className='my_list'>
                            <div className='basic'>
                                {addresses.slice(0, 1).map((item) => (
                                    <div
                                        key={item.id}
                                        className={`my_item ${defaultId === item.id ? "is_active" : ""}`}
                                        default-mark="기본 정산 계좌"
                                    >
                                        <div className="info_bind">
                                            <div className="address_info">
                                                <div className="name_box">
                                                    <span className="mark" style={{display: "block"}}>기본 정산 계좌</span>
                                                    <span className="name">{item.bank_name}</span>
                                                </div>
                                                <p className="phone">
                                                    {item.account_number.split("-").map((part, index) => (
                                                        <span key={index}>
                                                            {part}
                                                            {index < 2 && <span className=""></span>}
                                                        </span>
                                                    ))}
                                                </p>
                                                <div className="address_box">
                                                    <span className="zipcode">{item.account_holder_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn_bind">
                                            <Link href="/myPageAccountInfo" className="btn outlinegrey small">
                                                변경하기
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        {/* 정산계좌 */}
                        
                        <Account />
                       
                        {/* 판매내역 구매완료된거만만 */}
                        <div className="saved-product">
                        <SellHistory />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
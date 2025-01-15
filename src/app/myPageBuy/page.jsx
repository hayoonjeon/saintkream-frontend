"use client";
import { usePathname, useSearchParams } from 'next/navigation';
import MyPageSideNav from '../components/MyPageSideNav';
import './myPageBuy.css';
import { useEffect, useState } from 'react';
import useAuthStore from "../../../store/authStore";
import axios from 'axios';
import Link from 'next/link';

function Page(props) {
    const [showSideNav, setShowSideNav] = useState(true); // 사이드바 보이기 여부 상태
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || '전체';
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [detail, setDetail] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [modalType, setModalType] = useState(null);
    const { user } = useAuthStore();
    const LOCAL_API_BASE_URL = "http://localhost:8080/api";
    const [purchases, setPurchases] = useState([]); // 구매 내역 데이터 상태
    const [selectedPwrId, setSelectedPwrId] = useState(null);
    const [reviewedPwrIds, setReviewedPwrIds] = useState([]); // 리뷰된 pwr_id 상태
    const member_id = user.member_id;
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    useEffect(() => {
        // 특정 조건에 따라 사이드바를 숨기거나 표시
        if (pathname.includes("/myPageBuy") || pathname.includes("/myPageSell")) {
            setShowSideNav(true); // 구매 내역, 판매 내역 페이지에서는 숨기기
        } else {
            setShowSideNav(false); // 그 외 페이지에서는 표시
        }
    }, [pathname]);


    // DB에서 데이터 가져오기
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                console.log(user.member_id);
                const token = localStorage.getItem('token'); // 토큰 가져오기
                const response = await axios.get(`http://localhost:8080/api/transaction/HayoonSearchPurchase`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더 추가
                    },
                    params: {
                        member_id: user.member_id, // 사용자 ID 전달
                    },
                });

                if (response.status === 200) {
                    setPurchases(response.data); // 서버에서 가져온 데이터를 상태로 설정
                    console.log(response.data);
                } else {
                    console.error("데이터를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("데이터 가져오기 중 오류 발생:", error);
            }
        };
        fetchPurchases();
        if (user.member_id) {
        }
    }, [user]);

    // DB에서 리뷰된 구매내역 pwr_id 가져오기
    const fetchReviewedPwrIds = async () => {
        try {
            const response = await axios.get(`${LOCAL_API_BASE_URL}/HayoonReview/getreviewpwr?member_id=${member_id}`);
            if (response.status === 200) {
                setReviewedPwrIds(response.data.data); // 리뷰된 pwr_id 상태 업데이트
                console.log("리스폰스데이타:", response.data.data);
            }
        } catch (error) {
            console.error("리뷰된 pwr_id 가져오기 중 오류:", error);
        }
    };

    const handleRating = (index) => setRating(index + 1);
    const handleReviewTextChange = (event) => setReviewText(event.target.value);
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    }

    // 모달 열기
    const handleModalOpen = (type, pwr_id) => {
        setModalType(type); // 모달 유형 설정
        console.log("pwr_id", pwr_id);
        setSelectedPwrId(pwr_id);
        if (pwr_id) {
            console.log("아이템아이디2: ", pwr_id)
            setSelectedItemId(pwr_id); // 선택된 아이템 ID 저장
            /* seller_id 가져오기 */
            const getData = async () => {
                try {
                    setLoading(true); // 로딩 상태 시작
                    // (1) 서버에서 데이터 가져오기
                    const response = await axios.get(`http://localhost:8080/api/transaction/gettransdetails?pwr_id=${pwr_id}`);
                    console.log(response);
                    const data = response.data.data;
                    console.log(data);
                    setDetail(data);
                } catch (err) {
                    console.error("Error fetching data:", err);
                    setError(err.message);
                } finally {
                    setLoading(false); // 로딩 상태 종료
                }
            };
            getData();
        }
        setIsModalOpen(true); // 모달 열기
    };

    // 모달 닫기
    const handleModalClose = () => {
        setModalType(null); // 모달 유형 초기화
        setIsModalOpen(false); // 모달 닫기
    };

    const getFilteredPurchases = () => {
        if (activeTab === '전체') {
            return purchases;
        } else {
            return purchases.filter(purchase => purchase.is_fixed === activeTab);
        }
    };

    const filteredPurchases = getFilteredPurchases();

    const handleImageUpload = (e) => {
        if (e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const previews = files.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...previews]);
            setImages(prev => [...prev, ...files]);
        }
    };

    const deleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviewImages(previewImages.filter((_, i) => i !== index));
    };

    // 리뷰 제출
    const handleSubmitReview = async () => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append('member_id', member_id);
        formData.append('pwr_id', selectedItemId);
        formData.append('content', reviewText);
        formData.append('rate', rating);
        formData.append('seller_id', detail.seller_id);
        formData.append('buyer_id', detail.buyer_id);
        images.forEach(image => formData.append('images', image));

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${LOCAL_API_BASE_URL}/HayoonReview/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                alert('리뷰 등록에 성공했습니다.');
                setIsModalOpen(false);
                window.location.reload(); // 페이지 새로고침
            } else {
                alert('리뷰 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('리뷰 등록 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);

        }
    };

    //  구매확정 요청
    const handleConfirm = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/transaction/updateisfixed`, // 쿼리 파라미터 사용
                { pwr_id: selectedPwrId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data;
                if (data.message === '조회수 증가 완료') {
                    alert('구매 확정이 완료되었습니다.');
                    window.location.reload(); // 페이지 새로고침
                } else {
                    alert('구매 확정 처리에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('구매 확정 요청 중 오류 발생:', error);
            alert('구매 확정 요청 중 오류가 발생했습니다.');
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchReviewedPwrIds()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <p>로딩 중...</p>;
    // if (error) return <p>{error}</p>;
    return (

        <div className='myPageBuy'>
            <div className='container my lg'>
                {/* 사이드바 조건부 렌더링 */}
                {showSideNav && <MyPageSideNav currentPath={pathname} />}
                <div className='content_area my-page-content'>
                    <div className='my_purchase'>
                        <div className='content_title'>
                            <div className='title'>
                                <h3>구매 내역</h3>
                            </div>
                        </div>
                        {/* 타이틀 끝 */}
                        <div className='purchase_list history'>
                            <div>
                                <div className='history'>
                                    <div className='purchase_list_tab divider detail_tab'>
                                        {/* '전체' 탭 */}
                                        <div className={`tab_item ${activeTab === '전체' ? 'tab_on' : ''}`}
                                            onClick={() => handleTabClick('전체')}>
                                            <a href="#" className='tab_link'>
                                                <dl className='tab_box'>
                                                    <dt className='title'>전체</dt>
                                                    <dd className='count'>{purchases.length}</dd>
                                                </dl>
                                            </a>
                                        </div>
                                        {/* '진행 중' 탭 */}
                                        <div className={`tab_item ${activeTab === '0' ? 'tab_on' : ''}`}
                                            onClick={() => handleTabClick('0')}>
                                            <a href="#" className='tab_link'>
                                                <dl className='tab_box'>
                                                    <dt className='title'>진행 중</dt>
                                                    <dd className='count'>{purchases.filter(p => p.is_fixed === '0').length}</dd>
                                                </dl>
                                            </a>
                                        </div>
                                        <div className={`tab_item ${activeTab === '1' ? 'tab_on' : ''}`}
                                            onClick={() => handleTabClick('1')}>
                                            <a href="#" className='tab_link'>
                                                <dl className='tab_box'>
                                                    <dt className='title'>구매 완료</dt>
                                                    <dd className='count'>{purchases.filter(p => p.is_fixed === '1').length}</dd>
                                                </dl>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 구매 내역 리스트 */}
                        <div>
                            <div>
                                <div>
                                    {filteredPurchases.length > 0 ? (
                                        filteredPurchases
                                            .slice() // 원본 배열 보호
                                            .sort((a, b) => b.idx - a.idx) // idx를 기준으로 최신순 정렬
                                            .map(item => (
                                                <div key={item.idx} className='purchase_list_display_item' style={{ backgroundColor: "rgb(255, 255, 255)" }}>
                                                    <Link
                                                        href={{
                                                            pathname: '/orderdetail',
                                                            query: {
                                                                productId: item.pwr_id,
                                                                productPrice: item.trans_price,
                                                                productImg: item.file_name,
                                                                productName: item.title,
                                                                sellerId: item.seller_id,
                                                            },
                                                        }}

                                                    >
                                                        <div className='purchase_list_product'>
                                                            <div className='list_item_img_wrap'>
                                                                {item.file_name !== "0" ? (
                                                                    <img
                                                                        alt="product_img"
                                                                        src={`http://localhost:8080/images/${item.file_name}`}
                                                                        className='list_item_img'
                                                                        style={{ backgroundColor: "rgb(244, 244, 244)" }}
                                                                    />
                                                                ) : (
                                                                    <p style={{ textAlign: "center", color: "gray" }}>이미지 없음</p>
                                                                )}
                                                            </div>
                                                            <div className='list_item_title_wrap'>
                                                                <p className='list_item_price'>{Number(item.trans_price).toLocaleString()} 원</p>
                                                                <p className='list_item_title'>{item.title}</p>
                                                                <p className='list_item_description'>
                                                                    <span>{item.trans_method}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className='list_item_status'>
                                                        <div className='list_item_column column_secondary'>
                                                            <p className='text-lookup secondary_title display_paragraph' style={{ color: "rgba(34, 34, 34, 0.5)" }}>
                                                                {new Date(item.trans_date).toLocaleString('ko-KR', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                    hour12: false // 24시간 형식 설정
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className='list_item_column column_last'>
                                                            <p className='text-lookup last_title display_paragraph' style={{ color: "rgb(34, 34, 34)" }}>
                                                                {item.is_fixed === '0' ? '진행 중' : '구매 완료'}
                                                            </p>
                                                            {/* '진행 중' 상태일 때만 '구매 확정' 버튼 표시 */}
                                                            {item.is_fixed === '0' && (
                                                                <a
                                                                    className='text-lookup last_description display_paragraph action_named_action confirm_purchase'
                                                                    style={{ color: "red", cursor: "pointer" }}
                                                                    onClick={() => handleModalOpen('confirm', item.pwr_id)} // 'confirm' 모달 열기
                                                                >
                                                                    구매 확정
                                                                </a>
                                                            )}
                                                            {/* '구매 완료' 상태일 때만 '후기 남기기' 버튼 표시 */}
                                                            {item.is_fixed === '1' && !reviewedPwrIds.includes(item.pwr_id) && (
                                                                <button
                                                                    className="review-btn"
                                                                    style={{ textAlign: 'right' }}
                                                                    onClick={() => handleModalOpen('review', item.pwr_id)} // 'review' 모달 열기
                                                                >
                                                                    후기 남기기
                                                                </button>
                                                            )}
                                                            {/* 후기 작성 완료 상태 표시 */}
                                                            {reviewedPwrIds.includes(item.pwr_id) && (
                                                                <p className="review-status">후기 작성 완료</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <p className='nothing_at_all'>해당 카테고리에 해당하는 구매 내역이 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 모달 */}
                        {isModalOpen && (
                            <div className='layer lg'>
                                <div className='layer-background' onClick={handleModalClose}></div>
                                <div
                                    className={`layer_container ${modalType === "confirm" ? "confirm-modal" : "review-modal"
                                        }`}
                                >
                                    {modalType === 'confirm' && (
                                        <>
                                            <div className="layer_header">
                                                <h2 className="title">구매 확정</h2>
                                            </div>
                                            <div className='layer_content'>
                                                <div className='size_list_area'>
                                                    <h5>Saint Kream에서는 구매확정을 하는 즉시, 확정 취소가 불가능해요.<br /><br /></h5>
                                                    <p className="description_text">
                                                        확정 뒤 3일 후 상품 판매 대금이 판매자에게 정산되고 난 후에는 상품을 취소 및 반품 요청을 할 수 없어요.<br /><br />
                                                        혹시 판매자가 배송 전 구매확정을 요청했나요?<br /><br />
                                                        배송완료 이전에 판매자가 구매확정을 요청하는 거래는 사기 위험이 높아요.<br />
                                                        이런 행위를 하는 판매자를 만났다면 1:1 문의를 통해 신고를 접수해 주세요.<br /><br />
                                                    </p>
                                                    <p className='Fraud_Prevention'>사기 피해 방지를 위해 반드시 상품을 수령한 후<br /> 상품 상태를 확인 후에 구매확정 해주세요.<br /> </p>
                                                </div>
                                                <div className="layer_btn">
                                                    <button className="btn solid medium" onClick={handleConfirm}>확인</button>
                                                    <button className="btn solid_cancel medium" onClick={handleModalClose}>취소</button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {modalType === 'review' && (
                                        <>
                                            <div className="review_modal-content">
                                                <button className="close-btn" onClick={handleModalClose}>&times;</button>
                                                <div style={{ padding: '20px' }}><h3>리뷰 작성</h3></div>
                                                <div className="rating">
                                                    {Array(5)
                                                        .fill(0)
                                                        .map((_, index) => (
                                                            <span
                                                                key={index}
                                                                onClick={() => handleRating(index)}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    fontSize: "2rem",
                                                                    color: index < rating ? "gold" : "lightgray",
                                                                }}>★</span>
                                                        ))}
                                                </div>
                                                <div style={{ paddingTop: '15px', paddingBottom: '20px' }}>
                                                    <textarea
                                                        placeholder="판매자에게 전하고 싶은 후기를 남겨주세요."
                                                        rows="5"
                                                        value={reviewText}
                                                        onChange={handleReviewTextChange}
                                                    ></textarea>
                                                </div>
                                                {/* 사진 추가 영역 */}
                                                <div className="image-upload" >
                                                    <label htmlFor="fileInput" style={{ width: '80px', height: '31px', fontSize: '15px' }} >사진 추가</label>
                                                    <input

                                                        type="file"
                                                        id="fileInput"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </div>

                                                {/* 사진 미리보기 */}
                                                <div className="image-preview" style={{ textAlign: 'left' }}>
                                                    {previewImages.map((image, index) => (
                                                        <div key={index} className="image-container">
                                                            <img
                                                                src={image} // previewImages에서 가져온 URL 사용
                                                                alt={`uploaded-${index}`}
                                                                onClick={() => openImageModal(image)}
                                                            />
                                                            <button className="delete-btn" onClick={() => deleteImage(index)}>&times;</button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* 모달 하단 버튼 */}
                                                <div className="modal-actions">
                                                    <button className="cancel-btn" onClick={handleModalClose}>취 소</button>
                                                    <a style={{ width: '20px', color: 'white' }}>.         .        .</a>
                                                    <button className="submit-btn" onClick={handleSubmitReview} disabled={submitting}>
                                                        {submitting ? '제출 중...' : '작성하기'}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>

    );

}

export default Page;
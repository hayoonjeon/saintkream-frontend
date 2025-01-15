"use client";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import MyPageSideNav from '../components/MyPageSideNav';
import './myPageSell.css';
import { useEffect, useState } from 'react';
import useAuthStore from "../../../store/authStore";
import axios from 'axios';
import Link from 'next/link';

function Page(props) {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || '전체';
    const pathname = usePathname();
    const { user } = useAuthStore();
    const LOCAL_API_BASE_URL = "http://localhost:8080/api";
    const router = useRouter();

    const [activeTab, setActiveTab] = useState(initialTab);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedPwrId, setSelectedPwrId] = useState(null);
    const [reviewedPwrIds, setReviewedPwrIds] = useState([]); // 리뷰된 pwr_id 상태
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [purchases, setPurchases] = useState([]); // 판매 내역 데이터 상태
    const [showSideNav, setShowSideNav] = useState(true); // 사이드바 보이기 여부 상태
    const member_id = user.member_id;
    useEffect(() => {
        // 특정 조건에 따라 사이드바를 숨기거나 표시
        if (pathname.includes("/myPageBuy") || pathname.includes("/myPageSell")) {
            setShowSideNav(true); // 구매 내역, 판매 내역 페이지에서는 숨기기
        } else {
            setShowSideNav(false); // 그 외 페이지에서는 표시
        }
    }, [pathname]);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                console.log(member_id);
                const token = localStorage.getItem('token'); // 토큰 가져오기
                const response = await axios.get(`http://localhost:8080/api/salespost/getsellpostlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더 추가
                    },
                    params: {
                        member_id: member_id, // 사용자 ID 전달
                    },
                });

                if (response.status === 200) {
                    console.log("response.data.data", response.data.data);
                    setPurchases(response.data.data); // 서버에서 가져온 데이터를 상태로 설정
                } else {
                    console.error("데이터를 가져오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("데이터 가져오기 중 오류 발생:", error);
            }
        };

        if (member_id) {
            fetchPurchases(); // 사용자 ID가 있을 때만 데이터 가져오기
        }
    }, [member_id]);

    // DB에서 리뷰된 판매내역 pwr_id 가져오기
    const fetchReviewedPwrIds = async () => {
        console.log("멤버아이디:", member_id);
        try {
            const response = await axios.get(`${LOCAL_API_BASE_URL}/HayoonReview/getsellreviewpwr?member_id=${member_id}`);
            if (response.status === 200) {
                setReviewedPwrIds(response.data.data); // 리뷰된 pwr_id 상태 업데이트
                console.log("리스폰스데이타:", response.data.data);
            }
        } catch (error) {
            console.error("리뷰된 pwr_id 가져오기 중 오류:", error);
        }
    };


    const filteredItems = activeTab === '전체'
        ? purchases
        : purchases.filter((item) =>
            activeTab === "0" ? item.status === "판매중" : item.status === "판매완료"
        );

    // 수정 버튼 누를 시
    const handleEdit = (pwr_id) => {
        console.log("수정 버튼 클릭:", pwr_id);
        // editSalesPost 페이지로 이동, pwr_id 전달
        router.push(`/editSalesPost?pwr_id=${pwr_id}`);
    };

    // 삭제 버튼 누를 시
    const handleDelete = async (pwr_id) => {
        console.log("삭제버튼pwr_id: ", pwr_id);
        if (!window.confirm("정말로 삭제하시겠습니까?")) {
            return; // 사용자 확인 취소 시 종료
        }
        try {
            const token = localStorage.getItem('token'); // 인증 토큰 가져오기
            const response = await axios.delete(`${LOCAL_API_BASE_URL}/salespost/salesdelete?pwr_id=${pwr_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 헤더 추가
                },
            });

            if (response.status === 200 && response.data.success) {
                alert('삭제가 완료되었습니다.');
                // 삭제된 항목을 상태에서 제거
                window.location.reload(); // 페이지 새로고침
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error("삭제 요청 중 오류 발생:", error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const openModal = (pwr_id) => {
        console.log(pwr_id);
        setSelectedPwrId(pwr_id);
        /* buyer_id 가져오기 */
        const getData = async () => {
            try {
                setLoading(true); // 로딩 상태 시작
                // (1) 서버에서 데이터 가져오기
                const response = await axios.get(`http://localhost:8080/api/transaction/gettransdetails?pwr_id=${pwr_id}`);
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
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setRating(0);
        setReviewText("");
        setImages([]);
        setSelectedImage(null);
    };

    const handleRating = (index) => setRating(index + 1);
    const handleReviewTextChange = (event) => setReviewText(event.target.value);

    const handleImageUpload = (e) => {
        if (e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const previews = files.map(file => URL.createObjectURL(file));

            setPreviewImages(prevUrls => [...prevUrls, ...previews]);
            setImages(prevImages => [...prevImages, ...files]);
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

        if (images.length > 0) {
            images.forEach(image => formData.append('images', image));
        }
        formData.append('member_id', member_id);
        formData.append('pwr_id', selectedPwrId);
        formData.append('content', reviewText);
        formData.append('rate', rating);
        formData.append('seller_id', detail.seller_id);
        formData.append('buyer_id', detail.buyer_id);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${LOCAL_API_BASE_URL}/HayoonReview/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.data.success) {
                alert('리뷰 등록에 성공했습니다.');
                closeModal();
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
    return (
        <div className='myPageSell'>
            <div className='container my lg'>
                {/* 사이드바 조건부 렌더링 */}
                {showSideNav && <MyPageSideNav currentPath={pathname} />}
                <div className='content_area my-page-content'>
                    <div className='my_purchase'>
                        <div className='content_title'>
                            <h3>판매 내역</h3>
                        </div>

                        <div className='purchase_list sell history'>
                            <div>
                                <div className='sell history'>
                                    <div className='purchase_list_tab sell divider detail_tab'>
                                        {['전체', '0', '1'].map(tab => (
                                            <div
                                                key={tab}
                                                className={`tab_item ${activeTab === tab ? 'tab_on' : ''}`}
                                                onClick={() => handleTabClick(tab)}
                                            >
                                                <a href="#" className='tab_link' onClick={(e) => e.preventDefault()}>
                                                    <dl className='tab_box'>
                                                        <dt className='title'>
                                                            {tab === '0' ? '진행 중' : tab === '1' ? '판매 완료' : '전체'}
                                                        </dt>
                                                        <dd className='count'>
                                                            {tab === '전체'
                                                                ? purchases.length
                                                                : purchases.filter((item) =>
                                                                    tab === "0"
                                                                        ? item.status === "판매중"
                                                                        : item.status === "판매완료"
                                                                ).length}
                                                        </dd>
                                                    </dl>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='purchase_list_display'>
                            {filteredItems.length > 0 ? (
                                filteredItems
                                    .slice() // 원본 배열 보호
                                    .sort((a, b) => b.pwr_id - a.pwr_id) // idx를 기준으로 최신순 정렬
                                    .map(item => (
                                        <div key={item.pwr_id} className='purchase_list_display_item'>
                                            {item.status === '판매완료' ? (
                                                /* 판매완료된 게시물 리스트 링크 */
                                                <Link
                                                    href={{
                                                        pathname: '/orderdetailpreparing',
                                                        query: {
                                                            productName: item.title,
                                                            productPrice: item.sell_price,
                                                            productId: item.pwr_id,
                                                            productImg: item.fileList[0].fileName,
                                                        },
                                                    }}

                                                >
                                                    <div className='purchase_list_product'>
                                                        <div className='list_item_img_wrap'>
                                                            {item.fileList !== "0" ? (
                                                                <img
                                                                    alt="product_img"
                                                                    src={`http://localhost:8080/images/${item.fileList[0]?.fileName}`}
                                                                    className='list_item_img'
                                                                    style={{ backgroundColor: "rgb(244, 244, 244)" }}
                                                                />
                                                            ) : (
                                                                <p style={{ textAlign: "center", color: "gray" }}>이미지 없음</p>
                                                            )}
                                                        </div>
                                                        <div className='list_item_title_wrap'>
                                                            <p className='list_item_price'>{Number(item.sell_price).toLocaleString()} 원</p>
                                                            <p className='list_item_title'>{item.title}</p>
                                                            <p className='list_item_description'>{item.is_direct === "1" && item.is_delivery === "1"
                                                                ? "직거래 / 택배거래"
                                                                : item.is_direct === "1"
                                                                    ? "직거래"
                                                                    : item.is_delivery === "1"
                                                                        ? "택배거래"
                                                                        : ""}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ) : (
                                                /* 판매중인 게시물 리스트 링크 */
                                                <Link
                                                    href={{
                                                        pathname: '/saleDetail',
                                                        query: {
                                                            id: item.pwr_id,
                                                        },
                                                    }}

                                                >
                                                    <div className='purchase_list_product'>
                                                        <div className='list_item_img_wrap'>
                                                            {item.fileList !== "0" ? (
                                                                <img
                                                                    alt="product_img"
                                                                    src={`http://localhost:8080/images/${item.fileList[0]?.fileName}`}
                                                                    className='list_item_img'
                                                                    style={{ backgroundColor: "rgb(244, 244, 244)" }}
                                                                />
                                                            ) : (
                                                                <p style={{ textAlign: "center", color: "gray" }}>이미지 없음</p>
                                                            )}
                                                        </div>
                                                        <div className='list_item_title_wrap'>
                                                            <p className='list_item_price'>{Number(item.sell_price).toLocaleString()} 원</p>
                                                            <p className='list_item_title'>{item.title}</p>
                                                            <p className='list_item_description'>{item.is_direct === "1" && item.is_delivery === "1"
                                                                ? "직거래 / 택배거래"
                                                                : item.is_direct === "1"
                                                                    ? "직거래"
                                                                    : item.is_delivery === "1"
                                                                        ? "택배거래"
                                                                        : ""}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )}
                                            <div className='list_item_status'>
                                                <div className='list_item_column column_secondary'>
                                                    <p className='text-lookup secondary_title display_paragraph' style={{ color: "rgba(34, 34, 34, 0.5)" }}>
                                                        {new Date(item.created_at).toLocaleString('ko-KR', {
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
                                                        {item.status === '판매중' ? '진행 중' : '판매 완료'}
                                                    </p>
                                                    {item.status === '판매완료' && !reviewedPwrIds.includes(Number(item.pwr_id)) && (
                                                        <button
                                                            className="review-btn"
                                                            onClick={() => openModal(item.pwr_id)}
                                                            style={{ textAlign: 'right' }}
                                                        >후기 남기기</button>
                                                    )}
                                                    {/* 후기 작성 완료 상태 표시 */}
                                                    {reviewedPwrIds.includes(Number(item.pwr_id)) && (
                                                        <p className="review-status">후기 작성 완료</p>
                                                    )}

                                                    {/* 상태에 따른 버튼 표시 */}
                                                    {item.status === '판매중' && (
                                                        <div className="action-buttons">
                                                            <button
                                                                className="edit-btn"
                                                                onClick={() => handleEdit(item.pwr_id)}
                                                                style={{ marginRight: '6px' }}
                                                            >
                                                                수정
                                                            </button>
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => handleDelete(item.pwr_id)}
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    )}
                                                    {item.status === '판매완료' && (
                                                        <div className="action-buttons">
                                                            <button
                                                                className="delete-btn"
                                                                onClick={() => handleDelete(item.pwr_id)}
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className='nothing_at_all'>해당 카테고리에 맞는 판매 내역이 없습니다.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="review_modal-overlay">
                    <div className="review_modal-content">
                        <button className="close-btn" onClick={closeModal}>&times;</button>
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
                            <button className="cancel-btn" onClick={closeModal}>취 소</button>
                            <a style={{ width: '20px', color: 'white' }}>.         .        .</a>
                            <button className="submit-btn" onClick={handleSubmitReview} disabled={submitting}>
                                {submitting ? '제출 중...' : '작성하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;

"use client";
import { usePathname } from 'next/navigation';
import MyPageSideNav from '../components/MyPageSideNav';
import './myPageAddressInfo.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import axios from 'axios';
import useAuthStore from '../../../store/authStore';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL}/api/address`;

function Page(props) {
    const pathname = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
    const [editingAddressId, setEditingAddressId] = useState(null); // 수정할 주소 ID

    // 새 주소 추가 모달 내 입력 필드 상태 관리
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [address, setAddressInput] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const { user } = useAuthStore();
    const member_id = user.member_id;

    // 기본 배송지 상태 (ID로 구분)
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: "홍길동",
            phone: "01012345678",
            zipcode: "(12345)",
            address: "서울 동대문구 전농로땡땡길 12-34 (휘경동)",
            detailAddress: "123호",
            isDefault: true, // 기본 배송지
        },
        {
            id: 2,
            name: "둘리",
            phone: "01012345678",
            zipcode: "(56789)",
            address: "서울 서대문구 땡땡로12길 34-56 (땡땡동)",
            detailAddress: "789호",
            isDefault: false,
        },
    ]);

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 11); // 숫자만 입력, 최대 11자리
        if (!value.startsWith('010')) {
            value = '010' + value.slice(3); // "010"으로 시작하지 않으면 "010"으로 대체
        }
        setPhone(value);
    };


    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/list`, {
                params: { member_id: member_id },
            });
            setAddresses(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            setAddresses([]); // 오류 발생 시 빈 배열로 초기화
        }
    };


    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSave = async () => {
        if (!name || !phone || !zipcode || !address || !detailAddress) return;

        const payload = {
            name,
            phone,
            zipcode,
            address,
            detailAddress,
            isDefault: isChecked,
            memberId: member_id, // Replace '1' with dynamic user ID
        };

        try {
            if (isEditing && editingAddressId) {
                await axios.put(`${API_BASE_URL}/update/${editingAddressId}`, payload);
            } else {
                await axios.post(`${API_BASE_URL}/add`, payload);
            }
            fetchAddresses();
            handleModalClose();
        } catch (error) {
            console.error('Failed to save address:', error);
        }
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    };

    const handleDelete = async (id) => {
        if (confirm("정말 이 주소를 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${API_BASE_URL}/delete/${id}`);
                fetchAddresses();
            } catch (error) {
                console.error('Failed to delete address:', error);
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/set-default/${id}`, null, {
                params: { member_id: member_id }, // Replace '1' with dynamic user ID
            });
            alert('기본 배송지 설정되었습니다.'); // 알림 추가
            fetchAddresses();
        } catch (error) {
            console.error('Failed to set default address:', error);
            alert('기본 배송지 설정에 실패했습니다.'); // 알림 추가
        }
    };

    const handleModalOpen = (address = null) => {
        if (address) {
            setIsEditing(true);
            setEditingAddressId(address.id);
            setName(address.name || "");
            setPhone(address.phone || "");
            setZipcode(address.zipcode || "");
            setAddressInput(address.address || "");
            setDetailAddress(address.detailAddress || "");
            setIsChecked(address.isDefault);
        } else {
            setIsEditing(false);
            setEditingAddressId(null);
            setName("");
            setPhone("");
            setZipcode("");
            setAddressInput("");
            setDetailAddress("");
            setIsChecked(false);
        }
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingAddressId(null);
    };

    const sample4_execDaumPostcode = () => {
        if (!daum?.Postcode) {
            alert('우편번호 스크립트가 아직 로드되지 않았습니다.');
            return;
        }
        new daum.Postcode({
            oncomplete: function (data) {
                const roadAddr = data.roadAddress; // 도로명 주소 변수
                setZipcode(data.zonecode);
                setAddressInput(roadAddr);
            },
        }).open();
    };

    return (
        <>
            {/* Daum 우편번호 스크립트 로드 */}
            <Script
                src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
                strategy="afterInteractive"
            />
            <div className="myPageAddressInfo">
                <div className="container my lg">
                    <MyPageSideNav currentPath={pathname} />
                    <div className="content_area my-page-content">
                        <div className="my_addressbook">
                            <div className="content_title">
                                <div className="main_title">
                                    <h3>주소록</h3>
                                </div>
                                <div className="btn_box">
                                    <div className="btn btn_add">
                                        <span
                                            className="btn_txt"
                                            onClick={() =>handleModalOpen()}
                                        >
                                            + 새 배송지 추가
                                        </span>
                                    </div>
                                    {isModalOpen && (
                                        <div className="layer_delivery layer lg">
                                            <div
                                                className="layer-background"
                                                onClick={handleModalClose}
                                            ></div>
                                            <div className="layer_container">
                                                <a
                                                    href="#"
                                                    className="btn_layer_close"
                                                >
                                                    <div onClick={handleModalClose}>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 384 512"
                                                            className="ico-close icon sprite-icons"
                                                        >
                                                            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                                                        </svg>
                                                    </div>
                                                </a>
                                                <div className="layer_header">
                                                    <h2 className="title">
                                                        {isEditing ? "주소 수정" : "새 주소 추가"}
                                                    </h2>
                                                </div>
                                                <div className="layer_content">
                                                    <div className="delivery_bind">
                                                        <div className="delivery_input">
                                                            <div className="input_box first">
                                                                <h4 className="input_title">이름</h4>
                                                                <div className="input_item">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="수령인의 이름"
                                                                        autoComplete="off"
                                                                        className="input_txt"
                                                                        value={name}
                                                                        onChange={(e) =>
                                                                            setName(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="input_box">
                                                                <h4 className="input_title">휴대폰 번호</h4>
                                                                <div className="input_item">
                                                                    <input
                                                                        type="tel"
                                                                        placeholder="- 없이 입력"
                                                                        autoComplete="off"
                                                                        className="input_txt text_fill"
                                                                        value={phone}
                                                                        onChange={handlePhoneChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="input_box">
                                                                <h4 className="input_title">우편번호</h4>
                                                                <div className="input_item">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="우편 번호를 검색하세요"
                                                                        id="sample4_postcode"
                                                                        readOnly
                                                                        autoComplete="off"
                                                                        className="input_txt text_fill"
                                                                        value={zipcode}
                                                                        onFocus={(e) =>
                                                                            e.target.blur()
                                                                        }
                                                                    />
                                                                    <input
                                                                        type="button"
                                                                        className="btn_input btn_zipcode outline small"
                                                                        onClick={
                                                                            sample4_execDaumPostcode
                                                                        }
                                                                        value="우편번호"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="input_box">
                                                                <h4 className="input_title">주소</h4>
                                                                <div className="input_item">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="우편 번호 검색 후, 자동입력 됩니다"
                                                                        id="sample4_roadAddress"
                                                                        readOnly
                                                                        autoComplete="off"
                                                                        className="input_txt text_fill"
                                                                        value={address}
                                                                        onFocus={(e) =>
                                                                            e.target.blur()
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="input_box">
                                                                <h4 className="input_title">상세 주소</h4>
                                                                <div className="input_item">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="건물, 아파트, 동/호수 입력"
                                                                        autoComplete="off"
                                                                        className="input_txt text_fill"
                                                                        value={detailAddress}
                                                                        onChange={(e) =>
                                                                            setDetailAddress(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="delivery_check">
                                                            <div className="checkbox_item last">
                                                                <input
                                                                    id="check1"
                                                                    type="checkbox"
                                                                    name=""
                                                                    className="blind"
                                                                    checked={isChecked}
                                                                    onChange={(e) =>
                                                                        setIsChecked(
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor="check1"
                                                                    className="check_label"
                                                                >
                                                                    기본 배송지로 설정
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="v-portal"
                                                        style={{ display: "none" }}
                                                    ></div>
                                                    <div className="layer_btn">
                                                        <button
                                                            type="button"
                                                            className="btn_input btn_delete outlinegrey medium"
                                                            onClick={handleModalClose}
                                                        >
                                                            취소
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={!name || !phone || !zipcode || !address || !detailAddress}
                                                            className={`btn_input btn_save solid medium ${name &&
                                                                    phone &&
                                                                    zipcode &&
                                                                    address &&
                                                                    detailAddress
                                                                    ? ""
                                                                    : "disabled"
                                                                }`}
                                                            onClick={handleSave}
                                                        >
                                                            저장하기
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="my_list">
                                <div className="basic">
                                    {addresses
                                        .filter((addr) => addr.isDefault)
                                        .map((item) => (
                                            <div
                                                key={item.id}
                                                className="my_item is_active"
                                            >
                                                <div className="info_bind">
                                                    <div className="address_info">
                                                        <div className="name_box">
                                                            <span className="name">
                                                                {item.name}
                                                            </span>
                                                            <span className="mark">
                                                                기본 배송지
                                                            </span>
                                                        </div>
                                                        <p className="phone">
                                                            {formatPhoneNumber(
                                                                item.phone
                                                            )}
                                                        </p>
                                                        <div className="address_box">
                                                            <span className="zipcode">
                                                                ({item.zipcode})&nbsp;
                                                            </span>
                                                            <span className="address">
                                                                {item.address}&nbsp;
                                                            </span>
                                                            {item.detailAddress && (
                                                                <span className="detail-address">
                                                                    {
                                                                        item.detailAddress
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="btn_bind">
                                                    <a
                                                        href="#"
                                                        className="btn outlinegrey small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleModalOpen(item);
                                                        }}
                                                    >
                                                        수정
                                                    </a>
                                                    <a
                                                        href="#"
                                                        className="btn outlinegrey small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDelete(item.id);
                                                        }}
                                                    >
                                                        삭제
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="other">
                                    {addresses
                                        .filter((addr) => !addr.isDefault)
                                        .map((item) => (
                                            <div
                                                key={item.id}
                                                className="other_list"
                                            >
                                                <div className="my_item">
                                                    <div className="info_bind">
                                                        <div className="address_info">
                                                            <div className="name_box">
                                                                <span className="name">
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                            <p className="phone">
                                                                {formatPhoneNumber(
                                                                    item.phone
                                                                )}
                                                            </p>
                                                            <div className="address_box">
                                                                <span className="zipcode">
                                                                    ({item.zipcode})&nbsp;
                                                                </span>
                                                                <span className="address">
                                                                    {item.address}&nbsp;
                                                                </span>
                                                                {item.detailAddress && (
                                                                    <span className="detail-address">
                                                                        {
                                                                            item.detailAddress
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="btn_bind">
                                                        <a
                                                            href="#"
                                                            className="btn outlinegrey small"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleSetDefault(
                                                                    item.id
                                                                );
                                                            }}
                                                        >
                                                            기본 배송지
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="btn outlinegrey small"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleModalOpen(item);
                                                            }}
                                                        >
                                                            수정
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="btn outlinegrey small"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDelete(item.id);
                                                            }}
                                                        >
                                                            삭제
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;

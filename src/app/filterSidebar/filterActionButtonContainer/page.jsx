import React from 'react';
import './filterActionButtonContainer.css';

function Page({resetFilter,submitSelection}) {
  return (
    <div>
      <div className='filter_actioin_container'>
      <button className='cancle_button' onClick={resetFilter}>초기화</button>
      <button className='search_button' onClick={submitSelection}>상품보기</button>
      </div>
    </div>
  );
}

export default Page;
import React, { useState } from 'react';
import './filterButtonsSection.css';


function Page({ toggleSidebar, setSortOption }) {
  const [isChecked, setIsChecked] = useState(false);
  return (

    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='filter_buttons_container'>
          <button className='filter-button' onClick={toggleSidebar}>카테고리</button>
          {/* <button className='filter-button' onClick={toggleSidebar}>사이즈</button> */}
          <button className='filter-button' onClick={toggleSidebar}>가격대</button>
          <span style={{ margin: '0 20px 0px 20px', color: 'lightgray' }}>|</span>
          <button 
          className='filter-button'
          onClick={() => setSortOption('latest')}
          >최신순</button>
          <button 
          className='filter-button'
          onClick={() => setSortOption('popular')}
          >인기순</button>
          <button 
          className='filter-button'
          onClick={() => setSortOption('lowPrice')}
          >낮은 금액순</button>
          <button 
          className='filter-button'
          onClick={() => setSortOption('highPrice')}
          >높은 금액순</button>
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div className="custom-checkbox-container">
          <label className="custom-checkbox">
            <input
              id="check1"
              type="checkbox"
              name=""
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            {isChecked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="ico-close icon sprite-icons"
              >
                <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="ico-uncheck icon sprite-icons"
              >
                <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm16 400c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8-7.2-16 16-16h352c8.8 0 16 7.2 16 16v352z" />
              </svg>
            )}
            <span className="checkbox_span">판매 완료 상품 포함</span>
          </label>
        </div>
      </div>
    </>
  );
}

export default Page;
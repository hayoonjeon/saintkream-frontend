import React from 'react'; // React를 명시적으로 추가
import { useState, useEffect } from 'react';
import styles from '../filterSidebar.module.css';
import './filterPrice.css';
import { Range } from 'react-range';

const FilterPrice = ({ resetFilter, isActive, toggleSidebar ,selectedPriceRange,setPriceRange,priceRange }) => {
  const categories = [
    { id: 1, name: '10만원 이하' },
    { id: 2, name: '20만원 이하' },
    { id: 3, name: '50만원 이하' },
    { id: 4, name: '100만원 이하' },
    { id: 5, name: '200만원 이하' },
    { id: 6, name: '300만원 이상' },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [priceRange, setPriceRange] = useState([0, 500]);

  // useEffect(() => {
  //   if (resetFilter) {
  //     setSelectedCategories([]);
  //     setPriceRange([0, 500]);
  //   }
  // }, [resetFilter]);
  

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  // const handlePrice = (range) =>{
  //   updatePrice(range);
  // }

  const selectAll = () => {
    setSelectedCategories(categories.map((category) => category.id));
  };

  const clearSelection = () => {
    setSelectedCategories([]);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };


  return (
    <div>
      <div className={styles.filterContent}></div>
      <div className="filter_section">
        <div className="section_top">
          <p style={{ marginLeft: '0px' }}>가격대</p>
          <a onClick={toggleCollapse}>
            <img
              src={isCollapsed ? '/images/HJ_plus.png' : '/images/HJ_minus.png'}
              className={isCollapsed ? 'plus_button' : 'minus_button'}
              alt={isCollapsed ? '펼치기' : '접기'}
            />
          </a>
        </div>
        <div
          className={`category-list ${isCollapsed ? 'collapsed' : ''}`}
          style={{
            overflow: 'hidden',
            transition: 'height 0.5s ease, opacity 0.5s ease',
            height: isCollapsed ? '0' : 'auto',
            opacity: isCollapsed ? '0' : '1',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px' }}>
            <button
              onClick={
                () => {
                if (selectedCategories.length === categories.length) {
                  clearSelection();
                } else {
                  selectAll();
                }
              }
            }
              className="category_button_sub"
            >
              {selectedCategories.length === categories.length ? '선택 해제' : '전체 선택'}
            </button>
          </div>
          <ul className="big_category_container">
            {categories.map((category) => (
              <li className="big_category" key={category.id}>
                <button
                  className={`category_button ${selectedCategories.includes(category.id) ? 'active' : ''
                    }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="price-range-slider">
            <div className="range-container">
              {/* Range 컴포넌트 */}
              <Range
          values={priceRange}
          step={1}
          min={0}
          max={500}
          onChange={(values) => {
            setPriceRange(values)}}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '6px',
                width: '100%',
                background: `linear-gradient(to right, 
                  #ccc ${(priceRange[0] / 500) * 100}%, 
                  black ${(priceRange[0] / 500) * 100}%, 
                  black ${(priceRange[1] / 500) * 100}%, 
                  #ccc ${(priceRange[1] / 500) * 100}%)`,
                borderRadius: '20px',
              }}
            >
              {children.map((child, index) => (
                React.cloneElement(child, { key: `track-child-${index}` }) // key 추가
              ))}
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div
              {...props}
              key={`thumb-${index}`} // key 추가
              style={{
                ...props.style,
                height: '20px',
                width: '20px',
                borderRadius: '50%',
                background: '#fff',
                border: '2px solid black',
              }}
            ></div>
          )}
        />


            </div>
            <div className="price-range-display">
              <label>최소가격 {priceRange[0]}만원</label>
              <label>최대가격 {priceRange[1]}만원</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPrice;

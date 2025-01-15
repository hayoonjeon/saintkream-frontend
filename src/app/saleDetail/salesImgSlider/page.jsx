import React, { useState } from 'react';
import './salesImgSlider.css'

function page({data}) {

  const mainImage = `http://localhost:8080/images/`;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = data.fileList.map((file)=> {
    return mainImage+file.fileName;
  });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="slider-container">
      <div
        className="slider-images"
        style={{ transform: `translateX(-${currentIndex * 550}px)` }}
      >
        {images.map((src, index) => (
          <img key={index} src={src} alt={`Slide ${index + 1}`}
          onClick={() => openModal(index)}
          />
        ))}
      </div>
      <div className="arrows">
        <button className="arrow" onClick={handlePrev}>
          &lt;
        </button>
        <button className="arrow" onClick={handleNext}>
          &gt;
        </button>
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <div
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>X</button>
            <button className="prev-btn" onClick={handlePrev}>&lt;</button>
            <img
              src={images[currentIndex]}
              alt={`Expanded Slide ${currentIndex + 1}`}
              className="expanded-image"
            />
            <button className="next-btn" onClick={handleNext}>&gt;</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default page;
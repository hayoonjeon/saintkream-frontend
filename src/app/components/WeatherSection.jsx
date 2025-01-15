import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/WeatherSection.css';

function WeatherSection({ latitude, longitude }) {
  const [weatherData, setWeatherData] = useState([]);

  const fetchWeatherData = async () => {
    if (!latitude || !longitude) return; // 위치 정보가 없으면 실행 중지
    console.log("111111");
    console.log("잘 들어왔나? latitude || longitude : ", latitude, longitude);

    try {
      console.log("2222222");

      const response = await axios.get('http://localhost:8080/api/weatherinfo/forecast', {
        params: { latitude, longitude },
      });

      console.log("333333");



      const data = response.data;
      console.log("data : ", data);
      if (data.length === 0) {
        console.error('날씨 데이터를 불러올 수 없습니다.');
        return;
      }

      setWeatherData(data.slice(0, 6)); // 필요한 데이터만
    } catch (error) {
      console.error('날씨 정보 에러:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);

  return (
    <div className="weatherSection">
      <div>해당 지역의 일기예보입니다. 거래 날짜 선택시 참고해주세요.</div>
      <div className="weatherForecast">
        {weatherData.map((weather, index) => (
          <div className="weatherDay" key={index}>
            <span>{index === 0 ? '오늘' : `${index}일 뒤`}</span>
            <span>
              {weather.value === '1' ? '☀️' :
                weather.value === '3' ? '⛅' :
                  weather.value === '4' ? '🌧️' : '❓'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherSection;

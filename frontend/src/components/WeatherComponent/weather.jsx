import React, { useEffect, useState } from "react";
import "./weather.scss";
import Loading from "../LoaderComponent/loading";
import sunny from "./sunny.png";
import partlyCloud from "./partly-cloud.png";
import partlyCloudNight from "./partly-cloud-night.png";
import rain from "./rain.png";
import rainNight from "./rain-night.png";
import thunderStorm from "./thunder-storm.png";
import snow from "./snow.png";
import mist from "./mist.png";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  
  useEffect(() => {
    fetchWeather(41.311081, 69.240562); // Toshkent koordinatalari

    const updateTimeAndDay = () => {
      const now = new Date();
      const options = {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      };
      setCurrentTime(now.toLocaleDateString("uz-UZ", options));

      // Short weekday name
      const shortDayOptions = { weekday: "short" };
      setCurrentDay(now.toLocaleDateString("uz-UZ", shortDayOptions));
    };

    updateTimeAndDay();
    const timer = setInterval(updateTimeAndDay, 60000); // Har daqiqada yangilash

    return () => clearInterval(timer); // Komponent unmount bo'lganda intervalni tozalash
  }, []);

  const fetchWeather = (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=d66a3a2f03bbb26656d45fa20fb11454&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.city) {
          setWeatherData(data); // Ob-havo ma'lumotlarini saqlash
        } else {
          setError("Ob-havo ma'lumotlarini olishda xatolik yuz berdi.");
        }
      })
      .catch(() =>
        setError("Ob-havo ma'lumotlarini olishda xatolik yuz berdi.")
      );
  };

  if (error) {
    return (
      <p style={{ width: "55%" }} className="location-error">
        {error}
      </p>
    );
  }

  if (!weatherData) {
    return (
      <div>
        Yuklanmoqda
      </div>
    );
  }

  const iconMapping = {
    "01d": sunny,
    "01n": partlyCloudNight,
    "02d": partlyCloud,
    "02n": partlyCloudNight,
    "09d": rain,
    "09n": rainNight,
    "10d": rain,
    "10n": rain,
    "11d": thunderStorm,
    "11n": thunderStorm,
    "13d": snow,
    "13n": snow,
    "50d": mist,
    "50n": mist,
  };

  const currentWeather = weatherData.list[0];
  const weatherIcon = iconMapping[currentWeather.weather[0].icon];

  return (
    <div className="weather-widget">
      <div className="current-weather">
        <div className="current-temp">
          <div className="weather-left">
            {/* <img
              src={weatherIcon}
              alt={currentWeather.weather[0].description}
            /> */}
            <h1>
              {Math.round(weatherData.list[0].main.temp)} <span>°C</span>
            </h1>
          </div>
          <div className="nam">
            <p>Namlik: {weatherData.list[0].main.humidity}%</p>
            <p>Shamol: {weatherData.list[0].wind.speed} km/h</p>
          </div>
        </div>
        <div className="additional-info">
          <div className="info">
            <p>{weatherData.city.name}</p>
            <p>{currentTime}</p>
          </div>
        </div>
      </div>
      <div className="forecast">
        <h3>Soatlik prognoz</h3>
        <div className="forecast-hours">
          {weatherData.list.slice(0, 8).map((hour, index) => (
            <div key={index} className="hour">
              <p className="date-hour">
                {new Date(hour.dt * 1000).getHours()}:00
              </p>
              <img
                src={
                  iconMapping[hour.weather[0].icon] ||
                  `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`
                }
                alt={hour.weather[0].description}
              />
              <p>{Math.round(hour.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;

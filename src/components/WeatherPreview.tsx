'use client'

import { useState, useEffect } from 'react';

export default function WeatherPreview() {
  const [temperature, setTemperature] = useState('');
  const [hi, setHi] = useState('');
  const [lo, setLo] = useState('');
  const [humidity, setHumidity] = useState('');
  const [precip, setPrecip] = useState(0);
  const [wind, setWind] = useState('');
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [icon, setIcon] = useState('🌤️');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const lat = 33.95;
  const lon = -83.37;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&current=temperature_2m,weathercode,wind_speed_10m,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
        
        const res = await fetch(api);
        const data = await res.json();

        setTemperature(data.current.temperature_2m + '°F');
        setHumidity(data.current.relative_humidity_2m + '%');
        setWind(data.current.wind_speed_10m + ' mph');
        setPrecip(data.daily.precipitation_sum[0]);
        setWeatherCode(data.current.weathercode);
        setIcon(getIcon(data.current.weathercode));
        setHi(data.daily.temperature_2m_max[0] + '°F');
        setLo(data.daily.temperature_2m_min[0] + '°F');
      } catch (e) {
        setError('Failed to fetch weather data 😓');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIcon = (code: number): string => {
    const icons: Record<number, string> = {
      0: '☀️',
      1: '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌁',
      51: '🌦️',
      53: '🌦️',
      55: '🌧️',
      61: '🌧️',
      63: '🌧️',
      65: '🌧️',
      80: '🌧️',
      95: '⛈️',
      99: '🌩️',
    };
    return icons[code] || '❓';
  };

  const describe = (code: number): string => {
    const descriptions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Heavy drizzle',
      61: 'Light rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Rain showers',
      95: 'Thunderstorm',
      99: 'Thunderstorm with hail',
    };
    return descriptions[code] || 'Unknown weather';
  };

  const getImpact = (code: number | null, precipitation: number) => {
    if (code === null) return { message: '', color: '' };

    const severe = [65, 95, 99];
    const meh = [45, 48, 51, 53, 55, 61, 63, 80];

    if (severe.includes(code) || precipitation > 0.4) {
      return {
        message: 'Severe weather conditions. Use extreme caution when commuting.',
        color: 'text-red-600'
      };
    }

    if (meh.includes(code) || precipitation > 0.1) {
      return {
        message: 'Travel may be delayed due to weather conditions.',
        color: 'text-yellow-600'
      };
    }

    return {
      message: 'No expected travel delays today.',
      color: 'text-green-600'
    };
  };

  const travel = getImpact(weatherCode, precip);

  return (
    <div className="bg-gray-100 p-4 rounded text-center">
      <div className="text-5xl mb-2 animate-pulse">{icon}</div>

      {loading ? (
        <p>Loading weather...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <p className="capitalize font-semibold">{describe(weatherCode!)}</p>
          <p className="text-gray-700 mb-2">Current Temp: {temperature}</p>
          <p className="text-gray-700 mb-2">High: {hi} / Low: {lo}</p>
          <p className="text-gray-700 mb-2">Humidity: {humidity}</p>
          <p className="text-gray-700 mb-2">Wind: {wind}</p>
          <p className="text-gray-700 mb-4">Precipitation: {precip.toFixed(2)} in</p>
          <p className={`text-lg font-bold ${travel.color}`}>
            {travel.message}
          </p>
        </>
      )}
    </div>
  );
}

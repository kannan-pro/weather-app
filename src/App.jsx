import React, { useState } from 'react';

const App = () => {
  const api_key = import.meta.env.VITE_WEATHER_APP_API_KEY;
  const api_url = "https://api.weatherapi.com/v1/forecast.json";

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api_url}?key=${api_key}&q=${city}&days=1`);
      if (!response.ok) {
        throw new Error("Failed to fetch weather. Please try again later.");
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setCity("");
      setLoading(false);
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  return (
    <div className='border-3 rounded-4xl w-[340px] sm:w-lg font-sans my-10 sm:my-16 mx-auto'>
      <div className='flex flex-col items-center py-7 sm:py-10'>
        <h1 className='text-4xl sm:text-5xl font-medium tracking-wide mb-10'>Weather App</h1>

        <div className='flex gap-2 sm:gap-4 mb-5'>
          <input
            type="text"
            placeholder='Enter your city'
            className="border-[1px] opacity-[0.7] border-gray-200 rounded-lg p-3 w-[200px] sm:w-2xs focus:outline-none focus:ring-2 focus:ring-offset-white text-[18px]"
            onKeyUp={handleKeypress}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (error) setError(null);
            }}
          />
          <button
            className="bg-white text-black text-md sm:text-lg tracking-wide px-6 py-1 sm:py-2 rounded-xl hover:opacity-[0.8] hover:cursor-pointer active:translate-y-0.5 transition"
            onClick={fetchData}
          >
            Search
          </button>
        </div>


        {error ? (
          <p className="text-red-500 font-medium mt-2">{error}</p>
        ) : loading ? (
          <p className="text-blue-500 font-medium mt-2">Loading...</p>
        ) : weather ? (
          <div className='flex flex-col items-center my-6'>
            <h2 className='text-2xl sm:text-3xl font-medium tracking-wider mb-4'>
              {weather.location.name}
            </h2>
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              className='w-[100px] sm:w-[150px] mb-2'
            />
            <div className='flex flex-col items-center gap-3'>
              <p className='text-xl sm:text-2xl font-medium'>Temp: {weather.current.temp_c}°C</p>
              <p className='text-xl sm:text-2xl font-medium'>Condition: {weather.current.condition.text}</p>
              <p className='text-xl sm:text-2xl font-medium'>Wind: {weather.current.wind_kph} kph</p>
              <p className='text-xl sm:text-2xl font-medium'>Feels Like: {weather.current.feelslike_c}°C</p>
              <p className='text-xl sm:text-2xl font-medium'>Local Time: {weather.location.localtime}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;

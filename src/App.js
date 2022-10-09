import { useState, useCallback } from "react";
import { debouncedFunc } from "./helper/utility";
import "./App.css";
import Input from "./components/Input";
import Weather from "./components/Weather";

const API_KEY = process.env.REACT_APP_API_KEY;

const getLocation = async (nameOfCity) => {
  try {
    const text = nameOfCity.toLowerCase();
    const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${text}`;
    const reqLocation = await fetch(url);
    const locationObj = await reqLocation.json();
    const locationKey = locationObj[0].Key;
    return locationKey;
  } catch (e) {
    throw new Error(e);
  }
};

const getWeather = async (locationKey) => {
  try {
    const url = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${API_KEY}`;
    const weatherReq = await fetch(url);
    const weatherObj = await weatherReq.json();
    const dailyForecast = weatherObj.DailyForecasts[0];
    return dailyForecast;
  } catch (e) {
    throw new Error(e);
  }
};

function App() {
  // Set state to handle the input, the default value of input is empty string ""
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [btnDisable, setBtnDisable] = useState(true);

  const changeHandler = (event, text = "") => {
    setBtnDisable(false);
    setWeather({});
    setQuery(event ? event.target.value : text);
  };

  const updateWeatherHandler = async () => {
    // Get the location key
    const locationKey = await getLocation(query);

    // Get the weather based on the location key
    if (locationKey) {
      const dailyForecast = await getWeather(locationKey);
      setWeather(dailyForecast);

      setBtnDisable(true);
    }
  };

  // Use callback to memorize the function, avoid to re-render the function after the 1st time creation
  const onInputHandlerChange = useCallback((event) => {
    debouncedFunc(event, changeHandler);
  }, []);

  return (
    <div className="App">
      <Input
        onInputHandlerChange={onInputHandlerChange}
        updateWeatherHandler={updateWeatherHandler}
        query={query}
        changeHandler={changeHandler}
        btnDisable={btnDisable}
      />

      <Weather weather={weather} query={query} />
    </div>
  );
}

export default App;

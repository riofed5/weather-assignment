import { useState, useCallback } from "react";

const API_KEY = "lVlyXqe2A6nsXiJYtDA1I0TbL5ca5Qoa";

let timer = null;

const onInputUpdate = (event, cb) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    cb(event);
  }, 500);
};

const iconWeather = {
  Sunny:
    "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/01-s.png",
  "Mostly Sunny":
    "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/02-s.png",
  "Partly Sunny":
    "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/03-s.png",
  "Intermittent Clouds":
    "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/04-s.png",
  "Hazy Sunshine":
    "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/05-s.png",
};

console.log(iconWeather["Partly Sunny"]);

const getLocation = async (nameOfCity) => {
  const text = nameOfCity.toLowerCase();
  const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${text}`;
  const reqLocation = await fetch(url);
  const locationObj = await reqLocation.json();
  const locationKey = locationObj[0].Key;
  return locationKey;
};

const getWeather = async (locationKey) => {
  const url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${API_KEY}`;
  const weatherReq = await fetch(url);
  const weatherObj = await weatherReq.json();
  const dailyForecast = weatherObj.DailyForecasts[0];
  return dailyForecast;
};

const isDay = () => {
  const hours = new Date().getHours();
  return hours > 6 && hours < 20;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function App() {
  // Set state to handle the input, the default value of input is empty string ""
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});

  const changeHandler = (event) => {
    setQuery(event.target.value);
  };

  const updateWeatherHandler = async () => {
    // Get the location key
    const locationKey = await getLocation(query);

    // Get the weather based on the location key
    if (locationKey) {
      const dailyForecast = await getWeather(locationKey);
      setWeather(dailyForecast);
    }
  };

  // Use callback to memorize the function, avoid to re-render the function after the 1st time creation
  const onInputHandlerChange = useCallback((event) => {
    onInputUpdate(event, changeHandler);
  }, []);

  return (
    <div className="App">
      <div>
        <input
          placeholder="Enter the name of city"
          onChange={(event) => onInputHandlerChange(event)}
        />
        <button onClick={() => updateWeatherHandler()}>
          Show weather info
        </button>
      </div>

      {weather.Date ? (
        <div
          style={{
            width: 200,
            border: "1px solid black",
            backgroundColor: "black",
            zIndex: 0,
          }}
        >
          <div
            style={{
              margin: 3,
              border: "1px solid black",
              borderRadius: 10,
              zIndex: 2,
              backgroundColor: "white",
            }}
          >
            <h2>{capitalizeFirstLetter(query)}</h2>
            <div>
              <p>Minimum: {weather.Temperature.Minimum.Value} * F</p>
              <p>Maximum: {weather.Temperature.Maximum.Value} * F</p>
            </div>
            <img
              src="https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/37-s.png"
              width={50}
              height={40}
            />
            <p>{isDay() ? weather.Day.IconPhrase : weather.Night.IconPhrase}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;

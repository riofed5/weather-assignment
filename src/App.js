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
  "Sunny": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/01-s.png",
  "Mostly Sunny": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/02-s.png",
  "Partly Sunny": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/03-s.png",
  "Intermittent Clouds": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/36-s.png",
  "Hazy Sunshine": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/05-s.png",
  "Mostly Cloudy": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/38-s.png",
  "Cloudy": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/07-s.png",
  "Dreary (Overcast)": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/08-s.png",
  "Fog": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/11-s.png",
  "Showers": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/12-s.png",
  "Mostly Cloudy w/ Showers": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/40-s.png",
  "Partly Sunny w/ Showers": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/14-s.png",
  "T-Storms": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/15-s.png",
  "Mostly Cloudy w/ T-Storms": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/42-s.png",
  "Partly Sunny w/ T-Storms": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/17-s.png",
  "Rain": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/18-s.png",
  "Flurries": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/19-s.png",
  "Mostly Cloudy w/ Flurries": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/43-s.png",
  "Partly Sunny w/ Flurries": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/21-s.png",
  "Snow": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/22-s.png",
  "Mostly Cloudy w/ Snow": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/44-s.png",
  "Ice": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/24-s.png",
  "Sleet": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/25-s.png",
  "Freezing Rain": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/26-s.png",
  "Rain and Snow": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/29-s.png",
  "Hot": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/30-s.png",
  "Cold": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/31-s.png",
  "Windy": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/32-s.png",
  "Clear": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/33-s.png",
  "Mostly Clear": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/34-s.png",
  "Partly Cloudy": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/35-s.png",
  "Hazy Moonlight": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/37-s.png",
  "Partly Cloudy w/ Showers": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/39-s.png",
  "Partly Cloudy w/ T-Storms": "https://apidev.accuweather.com//developers/Media/Default/WeatherIcons/41-s.png"
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

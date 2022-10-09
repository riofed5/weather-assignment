import { iconWeather } from "../helper/iconWeather";
import { capitalizeFirstLetter, isDay } from "../helper/utility";

const Weather = ({ weather, query }) => {
  return (
    <>
      {weather.Date ? (
        <div
          style={{
            width: 400,
            border: "1px solid #2196F3",
            backgroundColor: "#2196F3",
            zIndex: 0,
          }}
        >
          <div
            style={{
              margin: 3,
              border: "1px solid #2196F3",
              borderRadius: 10,
              zIndex: 2,
              backgroundColor: "white",
              padding: 20,
            }}
          >
            <h1>{capitalizeFirstLetter(query)}</h1>
            <div>
              <p>Min: {weather.Temperature.Minimum.Value} * F</p>
              <p>Max: {weather.Temperature.Maximum.Value} * F</p>
            </div>
            <img
              src={
                iconWeather[
                  isDay()
                    ? weather.Day.IconPhrase.toLowerCase()
                    : weather.Night.IconPhrase.toLowerCase()
                ]
              }
              alt="Icon of weather"
            />
            <p>{isDay() ? weather.Day.IconPhrase : weather.Night.IconPhrase}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Weather;

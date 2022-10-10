import { useEffect, useRef, useState } from "react";
import { getCoordintes } from "../helper/utility";

const Input = ({
  onInputHandlerChange,
  updateWeatherHandler,
  query,
  changeHandler,
  btnDisable,
}) => {
  const inputRef = useRef(null);
  const [currentCity, setCurrentCity] = useState("");

  const handleKeyDown = (event) => {
    const str = inputRef.current.value;
    // Check if the input value is NOT empty string
    if (typeof str === "string" && str.length !== 0) {
      if (event.key === "Enter") {
        updateWeatherHandler();
      }
    }
  };

  useEffect(() => {
    if (currentCity !== "") {
      inputRef.current.value = currentCity;
    }
  }, [currentCity]);

  const handleSelectCurrentLocation = async () => {
    getCoordintes(changeHandler, setCurrentCity);
  };

  return (
    <div>
      <h2 className="w3-text-blue">Weather Forecast</h2>
      <div>
        <div>
          <label className="w3-text-blue">
            <b>City</b>
          </label>
          <p style={{ display: "flex" }}>
            <input
              ref={inputRef}
              className="w3-input w3-border"
              placeholder="Enter the name of city"
              onChange={(event) => {
                onInputHandlerChange(event);
              }}
              type="text"
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
            />
            <button
              style={{
                backgroundColor: "#55ba52",
                border: "none",
                width: 50,
                color: "white",
              }}
              onClick={() => handleSelectCurrentLocation()}
            >
              <i className="fa fa-map-marker" aria-hidden="true"></i>
            </button>
          </p>
        </div>
        <p>
          <button
            className="w3-btn w3-blue"
            onClick={() => updateWeatherHandler()}
            disabled={query.length < 1 || btnDisable}
          >
            Show weather info
          </button>
        </p>
      </div>
    </div>
  );
};

export default Input;

export const isDay = () => {
  const hours = new Date().getHours();
  // After 6a.m and before 8p.m is consideredly DAY
  return hours > 6 && hours < 20;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Debounced function for handle input, input only save final text rather save multiple time based on change
// More about debounced func : https://www.freecodecamp.org/news/javascript-debounce-example/
let timer = null;

export const debouncedFunc = (event, cb) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    cb(event);
  }, 500);
};

// Get current city
export const getCoordintes = (changeHandler, setCurrentCity) => {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // Set up func when get success while getting lat, long
  async function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude.toString();
    var lng = crd.longitude.toString();
    var coordinates = [lat, lng];
    const city = await getCity(coordinates);
    if (city) {
      // Set the input field value = city
      changeHandler(null, city);
      setCurrentCity(city);
    }
  }

  // Set up func when get error while getting lat, long
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  // Get geolocation here
  navigator.geolocation.getCurrentPosition(success, error, options);
};

export const getCity = async (coordinates) => {
  var lat = coordinates[0];
  var lng = coordinates[1];

  try {
    const req = await fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATION_API_KEY}&lat=` +
        lat +
        "&lon=" +
        lng +
        "&format=json"
    );

    const json = await req.json();
    const city = json.address.city;
    return city;
  } catch (e) {
    throw new Error(e);
  }
};

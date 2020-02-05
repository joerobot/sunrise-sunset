import React, { useState } from "react";
import ReactDOM from "react-dom";
import { API_KEY, API_BASE_URL, PROXY } from "./api";
import Time from "./Time";

const App = () => {
  const [sunData, setsunData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = url =>
    fetch(url)
      .then(res => res.json())
      .catch(() => {
        setError("Unable to retreive your location")
      });

  const makeApiCall = async location => {
    const {
      coords: { longitude, latitude },
    } = location;

    const url = `${API_BASE_URL}/forecast/${API_KEY}/${latitude},${longitude}?exclude=['currently','minutely','hourly','alerts','flags']`;
    const data = await fetchData(`${PROXY}/${url}`);

    // Hide loading spinner
    setLoading(false);

    const {
      daily: {
        data: [{ sunriseTime: sunrise, sunsetTime: sunset }],
      },
    } = data;

    setsunData({
      sunrise: sunrise,
      sunset: sunset,
    });
  };

  const clickHandler = () => {
    if (!navigator.geolocation) {
      return setError("This feature is not supported in your browser");
    }

    // Sometimes getCurrentPosition is slow, so start the loading spinner now.
    setLoading(true);

    navigator.geolocation.getCurrentPosition(makeApiCall, () => {
      setError("Unable to retrieve your location");
    });
  };

  const loadingSpinner = (
    <div className="absolute inset-0 flex items-center justify-center h-screen">
      <span className="loader"></span>
    </div>
  );

  const errorMessage = (
    <div className="absolute inset-0 flex items-center justify-center h-screen">
      <div className="text-red-700 text-center">
        <h4 className="text-xl">Error:</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  const hasError = error.length !== 0;

  return (
    <div>
      <header className="flex items-center justify-center wrapper">
        <div>
          <h1 className="text-xl lg:text-2xl leading-none py-8 text-center">
            Sunrise|Sunset
          </h1>
          <p className="max-w-xl text-left">
            Tap the button and allow the browser to use your location to find
            out the sunrise and sunset times where you are.
          </p>
        </div>
      </header>
      <main className="static">
        {/* Show loading spinner or error message if necessary */}
        {loading || hasError ? (
          hasError ? (
            errorMessage
          ) : (
            loadingSpinner
          )
        ) : (
          <div className="wrapper flex flex-col items-center">
            <button
              className="font-display bg-navy rounded-lg mt-10 mb-8 px-4 py-2 text-warm"
              onClick={clickHandler}
            >
              Get Location
            </button>
            {/* We want sunrise and sunset to be defined before showing the Time components */}
            {sunData.sunrise && sunData.sunset ? (
              <div className="sun-data-container flex flex-col md:justify-center md:flex-row">
                <Time title="Sunrise" date={sunData.sunrise} />
                <Time title="Sunset" date={sunData.sunset} />
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

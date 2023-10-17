import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState();
  const [showCountry, setShowCountry] = useState(false);
  const [countriesByRegion, showCountriesByRegion] = useState();
  const [country, setCountry] = useState("");
  const [listCountries, setListCountries] = useState([]);
  const [showRegionList, setShowRegionList] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  function handleClickRegion(e) {
    if (
      e.target.closest(".list-container") !==
      document.querySelector(".list-container")
    ) {
      setShowRegionList(false);
    }
  }

  function handleClickList(e) {
    if (
      e.target.closest(".input-container") !==
      document.querySelector(".input-container")
    ) {
      setListCountries([]);
    }
  }

  useEffect(function () {
    (async function fetchData() {
      try {
        const resCountrie = await fetch("https://restcountries.com/v3.1/all");

        if (!resCountrie.ok) throw new Error("Problem to fetch data countries");

        const countries = await resCountrie.json();

        // console.log(countries);
        setData(countries);
        showCountriesByRegion(
          [...countries].filter((el) => el.region === "Europe")
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div
      className={darkMode ? "dark-main-container" : "main-container"}
      onClick={(e) => {
        handleClickRegion(e);
        handleClickList(e);
      }}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      {!showCountry && (
        <SearchHeader
          data={data}
          setShowCountry={setShowCountry}
          showCountriesByRegion={showCountriesByRegion}
          setCountry={setCountry}
          listCountries={listCountries}
          setListCountries={setListCountries}
          showRegionList={showRegionList}
          setShowRegionList={setShowRegionList}
          darkMode={darkMode}
        />
      )}
      {!showCountry && (
        <CountriesContainer
          countriesByRegion={countriesByRegion}
          setShowCountry={setShowCountry}
          setCountry={setCountry}
          darkMode={darkMode}
        />
      )}
      {showCountry && (
        <CountryData
          setShowCountry={setShowCountry}
          country={country}
          setCountry={setCountry}
          data={data}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

function Header({ setDarkMode, darkMode }) {
  return (
    <div
      className="header"
      style={darkMode ? { backgroundColor: "#2B3844" } : {}}
    >
      <p className={darkMode ? "dark-title" : "title"}>Where in the world?</p>
      <div
        className="darkMode-box"
        onClick={() => setDarkMode((darkMode) => !darkMode)}
      >
        <img
          className="icone"
          alt=""
          src={
            darkMode
              ? process.env.PUBLIC_URL + "/images/full-moon.png"
              : process.env.PUBLIC_URL + "/images/plain-moon.png"
          }
        />
        <p className="dark-mode" style={darkMode ? { color: "white" } : {}}>
          Dark Mode
        </p>
      </div>
    </div>
  );
}

function SearchHeader({
  data,
  setShowCountry,
  showCountriesByRegion,
  setCountry,
  country,
  showRegionList,
  setShowRegionList,
  listCountries,
  setListCountries,
  darkMode,
}) {
  function handleFilterByRegion(region) {
    const dataRegion = [...data].filter((el) => el.region === region);
    showCountriesByRegion(() => dataRegion);
  }

  function handleData(e) {
    setCountry(e.target.value);

    function check(a, b) {
      if (b.length >= 3) {
        const ff = [...a.slice(0, b.length).toLowerCase()].filter((el) =>
          b.toLowerCase().includes(el)
        );

        if (b.length <= 6 && (ff.length * 100) / b.length >= 66) {
          const c = [...b.toLowerCase()].filter((el) =>
            a.slice(0, b.length).toLowerCase().includes(el)
          );
          return Array.from(new Set(c)).join("") ===
            Array.from(new Set(ff)).join("")
            ? true
            : false;
        } else if (b.length >= 7 && (ff.length * 100) / b.length > 70) {
          const c = [...b.toLowerCase()].filter((el) =>
            a.slice(0, b.length).toLowerCase().includes(el)
          );

          return Array.from(new Set(c)).join("") ===
            Array.from(new Set(ff)).join("")
            ? true
            : false;
        } else return false;
      }
    }

    const country = [...data].filter(
      (el) =>
        e.target.value.toLowerCase() ===
        el.name.common.slice(0, e.target.value.length).toLowerCase()
    );

    const renderCountries =
      country.length !== 0 && e.target.value.length !== 0
        ? country
        : [...data].filter((el) => check(el.name.common, e.target.value));

    setListCountries(() => renderCountries.map((el) => el.name.common));
  }

  return (
    <div className="search-box">
      <div
        className="input-container"
        style={darkMode ? { backgroundColor: "#2B3844" } : {}}
      >
        <img
          className="search-icone"
          alt=""
          src={
            darkMode
              ? process.env.PUBLIC_URL + "/images/search-dark.png"
              : process.env.PUBLIC_URL + "/images/search-light.png"
          }
        />
        <input
          style={darkMode ? { backgroundColor: "#2B3844", color: "white" } : {}}
          placeholder="Search for a country…"
          value={country}
          onChange={(e) => handleData(e)}
        />

        {listCountries.length !== 0 && (
          <ul
            className="list-countries"
            style={
              darkMode ? { backgroundColor: "#2B3844", color: "white" } : {}
            }
          >
            {listCountries
              .map((el, i) => (
                <li
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setCountry(el);
                    setListCountries([]);
                    setShowCountry(() => true);
                  }}
                >
                  {el}
                </li>
              ))
              .slice(0, 10)}
          </ul>
        )}
      </div>

      <div
        style={darkMode ? { backgroundColor: "#2B3844" } : {}}
        className="list-container"
        onClick={() => setShowRegionList((showRegionList) => !showRegionList)}
      >
        <p
          className="text-continent"
          style={darkMode ? { color: "white" } : {}}
        >
          Filter by Region
        </p>
        <img
          className="arrow-icone"
          alt=""
          src={
            darkMode
              ? process.env.PUBLIC_URL + "/images/arrow-dark.png"
              : process.env.PUBLIC_URL + "/images/arro-light.png"
          }
        />
        {showRegionList && (
          <ul
            className="list"
            style={
              darkMode ? { backgroundColor: "#2B3844", color: "white" } : {}
            }
          >
            <li
              className="list-item"
              onClick={() => handleFilterByRegion("Africa")}
            >
              Afriaca
            </li>
            <li
              className="list-item"
              onClick={() => handleFilterByRegion("Americas")}
            >
              America
            </li>
            <li
              className="list-item"
              onClick={() => handleFilterByRegion("Asia")}
            >
              Asia
            </li>
            <li
              className="list-item"
              onClick={() => handleFilterByRegion("Europe")}
            >
              Europe
            </li>
            <li
              className="list-item"
              onClick={() => handleFilterByRegion("Oceania")}
            >
              Oceania
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

function CountriesContainer({
  countriesByRegion,
  setShowCountry,
  setCountry,
  darkMode,
}) {
  return (
    <div className="container-countries">
      {countriesByRegion?.map((el, i) => (
        <Country
          key={i}
          img={el.flags.png}
          country={el.name.common}
          population={"Population: " + el.population.toLocaleString("en-US")}
          region={"Region: " + el.region}
          capital={"Capital: " + el.capital}
          setShowCountry={setShowCountry}
          setCountry={setCountry}
          darkMode={darkMode}
        ></Country>
      ))}
    </div>
  );
}

function Country({
  country,
  population,
  region,
  capital,
  img,
  setShowCountry,
  setCountry,
  darkMode,
}) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div
      style={darkMode ? { backgroundColor: "#2B3844" } : {}}
      className="cuntry-box"
      onClick={() => {
        setShowCountry(true);
        setCountry(country);
        scrollToTop();
      }}
    >
      <img className="flag" alt="" src={img} />
      <div className="info-box" style={darkMode ? { color: "white" } : {}}>
        <p className="country" style={darkMode ? { color: "white" } : {}}>
          {"Country: " + country}
        </p>
        <p className="population" style={darkMode ? { color: "white" } : {}}>
          {population}
        </p>
        <p className="region" style={darkMode ? { color: "white" } : {}}>
          {region}
        </p>
        <p className="capital" style={darkMode ? { color: "white" } : {}}>
          {capital}
        </p>
      </div>
    </div>
  );
}

function CountryData({ setShowCountry, country, data, darkMode }) {
  const [infoCountry, setInfoCountry] = useState(
    [...data].filter((el) => el.name.common === country)
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="box-bountry-data">
      <button
        className="back-button"
        style={darkMode ? { backgroundColor: "#2B3844", color: "white" } : {}}
        onClick={() => setShowCountry(false)}
      >
        &larr; Back
      </button>
      <div className="container-country-data">
        <img
          style={
            darkMode
              ? {
                  backgroundColor: "#202C36",
                }
              : {}
          }
          className="img-country-data"
          alt=""
          src={infoCountry[0].flags.png ? infoCountry[0].flags.png : "none"}
        />
        <div className="container-info-country">
          <div className="frist-info-box">
            <p
              className="common-name"
              style={darkMode ? { color: "white" } : {}}
            >
              {infoCountry[0].name.common ? infoCountry[0].name.common : "none"}
            </p>
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Native Name:{"   "}
              {infoCountry[0].altSpellings
                ? infoCountry[0].altSpellings[1]
                : "none"}
            </p>
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Population:{"   "}
              {infoCountry[0].population
                ? infoCountry[0].population.toLocaleString("en-US")
                : "none"}
            </p>
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Region: {infoCountry[0].region ? infoCountry[0].region : "none"}
            </p>
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Sub Region:{" "}
              {infoCountry[0].subregion ? infoCountry[0].subregion : "none"}
            </p>
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Capital:{" "}
              {infoCountry[0].capital
                ? infoCountry[0].capital.join("-")
                : "none"}
            </p>
          </div>
          <div className="second-info-box">
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Top Level Domain:{" "}
              {infoCountry[0].tld ? infoCountry[0].tld[0] : "none"}
            </p>
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Currencies:{" "}
              {infoCountry[0].currencies
                ? Object.values(infoCountry[0].currencies)[0].name
                : "none"}
            </p>
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Languages:{" "}
              {infoCountry[0].languages
                ? Object.values(infoCountry[0].languages).join(" , ")
                : "none"}
            </p>
          </div>
          <div className="border-box">
            <p
              className="info-paese"
              style={darkMode ? { color: "white" } : {}}
            >
              Border Countries:
            </p>
            {infoCountry[0].borders
              ?.map((el) => [...data].filter((element) => element.cca3 === el))
              .map((el, i) => (
                <button
                  style={
                    darkMode
                      ? { color: "white", backgroundColor: "#2B3844" }
                      : {}
                  }
                  key={i}
                  className="btn-border"
                  onClick={() => {
                    setInfoCountry(
                      [...data].filter(
                        (element) => element.name.common === el[0].name.common
                      )
                    );
                    scrollToTop();
                  }}
                >
                  {el[0].name.common}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

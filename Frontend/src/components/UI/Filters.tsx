import { useEffect, useState } from "react";

/** this could be replaced with API data */
const CONTINENTS = [
  "Europe",
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Oceania",
] as const;
const COUNTRIES: Record<(typeof CONTINENTS)[number], string[]> = {
  Europe: ["Germany", "Italy", "Spain", "Portugal", "Poland", "Austria"],
  Asia: ["Japan", "China", "Thailand", "Vietnam"],
  Africa: ["Morocco", "Kenya", "South Africa"],
  "North America": ["USA", "Canada", "Mexico"],
  "South America": ["Brazil", "Argentina", "Peru"],
  Oceania: ["Australia", "New Zealand"],
};

const PLACES: Record<string, string[]> = {
  Germany: ["Hamburg", "Berlin", "Munich", "Cologne"],
  Italy: ["Rome", "Milan", "Naples", "Florence"],
  Spain: ["Barcelona", "Madrid", "Valencia", "Seville"],
  Portugal: ["Lisbon", "Porto", "Faro"],
  Poland: ["Warsaw", "Krakow", "Gdansk"],
  Austria: ["Vienna", "Salzburg", "Graz"],
  Japan: ["Tokyo", "Osaka", "Kyoto"],
  China: ["Shanghai", "Beijing", "Shenzhen"],
  Thailand: ["Bangkok", "Chiang Mai", "Phuket"],
  Vietnam: ["Hanoi", "Da Nang", "Ho Chi Minh City"],
  // ...add more as needed
};
const SKILLS = [
  "Cooking",
  "Farm work",
  "English Teaching",
  "Gardening",
  "hostel work",
  "Child care",
  "Animal care",
  "Photography",
];

const Filters = () => {
  return (
    <div className="flex items-center p-4 bg-white rounded shadow">
      <form className="flex flex-wrap">
        <details className="dropdown">
          <summary className="btn m-1">Countinents</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </details>

        <details className="dropdown">
          <summary className="btn m-1">countries</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </details>

        <details className="dropdown">
          <summary className="btn m-1">places</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </details>

        <details className="dropdown">
          <summary className="btn m-1">jobs</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </details>
      </form>
    </div>
  );
};

export default Filters;

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
      <form>
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="Continents filter"
        />

        <details class="dropdown">
          <summary class="btn m-1">open or close</summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </details>

        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="Counteries filter"
        />
        <input
          className="btn"
          type="checkbox"
          name="frameworks"
          aria-label="skills filter"
        />
        <input className="btn btn-square" type="reset" value="×" />
      </form>
    </div>
  );
};

export default Filters;

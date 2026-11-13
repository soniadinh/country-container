
/* =====================================
   COUNTRY EXPLORER
   STEP 3: API INTEGRATION
===================================== */

// API base URL
const API_URL = "https://countries.dev";

// Get HTML elements
const countryContainer =
    document.getElementById("country-container");

const statusMessage =
    document.getElementById("status-message");

const searchForm =
    document.getElementById("search-form");

const searchInput =
    document.getElementById("search-input");

const clearButton =
    document.getElementById("clear-button");

const totalCountries =
    document.getElementById("total-countries");

const totalRegions =
    document.getElementById("total-regions");

const searchResults =
    document.getElementById("search-results");

const regionFilter =
    document.getElementById("region-filter");

const detailsContainer =
    document.getElementById("details-container");

const detailsPlaceholder =
    document.getElementById("details-placeholder");


// Store country information
let allCountries = [];
let currentCountries = [];

console.log("Country Explorer JavaScript connected!");



/* =====================================
   FETCH ALL COUNTRIES
===================================== */

const fetchCountries = async () => {

    try {

        // Show loading message
        statusMessage.textContent = "Loading countries...";

        // Send API request
        const response = await fetch(
            `${API_URL}/countries?fields=name,alpha2Code,capital,population,region,flag,flags&sort=name&limit=250`
        );

        // Check API response
        if (!response.ok) {
            throw new Error("Unable to load countries.");
        }

        // Convert JSON into JavaScript data
        const data = await response.json();

        // Store country data
        allCountries = data;
        currentCountries = data;

        // Display countries
        displayCountries(data);

        // Update statistics
        updateStatistics(data);

        console.log("Countries loaded successfully!");
        console.log(data);

    } catch (error) {

        // Display error message
        statusMessage.textContent =
            "Sorry! Unable to load countries. Please try again.";

        console.error("API Error:", error);

    }

};

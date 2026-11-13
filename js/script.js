
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


/* =====================================
   DISPLAY COUNTRY CARDS
===================================== */

// Get flag image URL
const getFlagURL = (country) => {

    if (country.flags && country.flags.svg) {
        return country.flags.svg;
    }

    if (
        typeof country.flag === "string" &&
        country.flag.startsWith("http")
    ) {
        return country.flag;
    }

    return null;
};


// Create and display country cards
const displayCountries = (countries) => {

    // Clear previous cards
    countryContainer.replaceChildren();

    // Check if countries exist
    if (countries.length === 0) {

        statusMessage.textContent =
            "No countries found. Try another search.";

        return;
    }

    // Display number of results
    statusMessage.textContent =
        `Showing ${countries.length} countries`;

    // Loop through each country
    countries.forEach((country) => {

        // Create card
        const card = document.createElement("article");
        card.className = "country-card";

        // Create flag area
        const flagArea = document.createElement("div");
        flagArea.className = "country-flag";

        const flagURL = getFlagURL(country);

        if (flagURL) {

            const flagImage = document.createElement("img");

            flagImage.src = flagURL;
            flagImage.alt = `Flag of ${country.name}`;
            flagImage.loading = "lazy";

            flagArea.appendChild(flagImage);

        } else {

            flagArea.textContent = country.flag || "🌍";

        }

        // Create country name
        const name = document.createElement("h3");
        name.textContent = country.name;

        // Create capital
        const capital = document.createElement("p");

        const capitalName = Array.isArray(country.capital)
            ? country.capital.join(", ")
            : country.capital;

        capital.textContent =
            `Capital: ${capitalName || "Not available"}`;

        // Create population
        const population = document.createElement("p");

        population.textContent =
            `Population: ${
                Number(country.population || 0).toLocaleString()
            }`;

        // Create region
        const region = document.createElement("p");

        region.textContent =
            `Region: ${country.region || "Not available"}`;

        // Create details button
        const detailsButton = document.createElement("button");

        detailsButton.textContent = "View Details";
        detailsButton.className = "details-button";

        // Open country details when clicked
        detailsButton.addEventListener("click", () => {
            fetchCountryDetails(country.name);
        });

        // Add everything to the card
        card.append(
            flagArea,
            name,
            capital,
            population,
            region,
            detailsButton
        );

        // Add card to webpage
        countryContainer.appendChild(card);

    });

};


// Update dashboard statistics

const updateStatistics = (countries) => {

    // Total countries
    totalCountries.textContent =
        allCountries.length.toLocaleString();

    // Find unique regions
    const regions = new Set(
        allCountries.map((country) => country.region)
            .filter(Boolean)
    );

    // Total regions
    totalRegions.textContent = regions.size;

    // Search results
    searchResults.textContent = countries.length;

};



// Search for a country

const searchCountries = async (countryName) => {

    try {

        statusMessage.textContent = "Searching countries...";

        // Create API URL
        const url =
            `${API_URL}/name/${encodeURIComponent(countryName)}` +
            `?fields=name,alpha2Code,capital,population,region,flag,flags`;

        // Fetch matching countries
        const response = await fetch(url);

        // Handle country not found
        if (response.status === 404) {

            currentCountries = [];

            displayCountries([]);
            updateStatistics([]);

            return;
        }

        if (!response.ok) {
            throw new Error("Country search failed.");
        }

        // Convert response to JSON
        const data = await response.json();

        // Store search results
        currentCountries = data;

        // Display search results
        displayCountries(data);

        // Update statistics
        updateStatistics(data);

    } catch (error) {

        statusMessage.textContent =
            "Search failed. Please try again.";

        console.error("Search error:", error);

    }

};



// Display one country's details

const fetchCountryDetails = async (countryName) => {

    try {

        detailsPlaceholder.textContent =
            "Loading country details...";

        detailsContainer.replaceChildren();

        const response = await fetch(
            `${API_URL}/name/${encodeURIComponent(countryName)}` +
            `?fields=name,capital,population,region,subregion,area,currencies,languages,flag,flags`
        );

        if (!response.ok) {
            throw new Error("Unable to load country details.");
        }

        const data = await response.json();

        // Find exact country match
        const country = data.find(
            item => item.name.toLowerCase() === countryName.toLowerCase()
        ) || data[0];

        // Clear placeholder
        detailsPlaceholder.textContent = "";

        // Create details card
        const detailsCard = document.createElement("div");
        detailsCard.className = "country-details-card";

        // Country name
        const heading = document.createElement("h3");
        heading.textContent = country.name;

        // Flag
        const flagURL = getFlagURL(country);

        const flag = document.createElement("div");
        flag.className = "details-flag";

        if (flagURL) {
            const image = document.createElement("img");
            image.src = flagURL;
            image.alt = `Flag of ${country.name}`;
            flag.appendChild(image);
        } else {
            flag.textContent = country.flag || "🌍";
        }

        // Helper to create information rows
        const addInfo = (label, value) => {

            const item = document.createElement("div");
            item.className = "detail-item";

            const title = document.createElement("h4");
            title.textContent = label;

            const text = document.createElement("p");
            text.textContent = value;

            item.append(title, text);

            return item;
        };

        // Format data
        const capital = Array.isArray(country.capital)
            ? country.capital.join(", ")
            : country.capital;

        const currencies = (country.currencies || [])
            .map(item => `${item.name} (${item.symbol || item.code})`)
            .join(", ");

        const languages = (country.languages || [])
            .map(item => item.name)
            .join(", ");

        // Add information to the card
        const infoGrid = document.createElement("div");
        infoGrid.className = "details-grid";

        infoGrid.append(
            addInfo("Capital", capital || "Not available"),

            addInfo(
                "Population",
                Number(country.population || 0).toLocaleString()
            ),

            addInfo("Region", country.region || "Not available"),

            addInfo("Subregion", country.subregion || "Not available"),

            addInfo(
                "Area",
                country.area
                    ? `${Number(country.area).toLocaleString()} km²`
                    : "Not available"
            ),

            addInfo("Currency", currencies || "Not available"),

            addInfo("Languages", languages || "Not available")
        );

        // Assemble details
        detailsCard.append(flag, heading, infoGrid);

        detailsContainer.appendChild(detailsCard);

        // Scroll to country details
        document.getElementById("country-details")
            .scrollIntoView({ behavior: "smooth" });

    } catch (error) {

        detailsPlaceholder.textContent =
            "Unable to load country details.";

        console.error("Details error:", error);

    }

};



// Search form event
searchForm.addEventListener("submit", (event) => {

    // Prevent page reload
    event.preventDefault();

    const countryName = searchInput.value.trim();

    if (countryName === "") {

        statusMessage.textContent =
            "Please enter a country name.";

        return;
    }

    searchCountries(countryName);

});


// Clear button event
clearButton.addEventListener("click", () => {

    searchInput.value = "";

    regionFilter.value = "all";

    currentCountries = allCountries;

    displayCountries(allCountries);

    updateStatistics(allCountries);

    detailsContainer.replaceChildren();

    detailsPlaceholder.textContent =
        "Select a country card to discover more information.";

});


// Region filter event
regionFilter.addEventListener("change", () => {

    const selectedRegion = regionFilter.value;

    let filteredCountries = currentCountries;

    if (selectedRegion !== "all") {

        filteredCountries = currentCountries.filter(
            country => country.region === selectedRegion
        );

    }

    displayCountries(filteredCountries);

    updateStatistics(filteredCountries);

});


// Load countries when webpage opens
fetchCountries();

var map = L.map('map').setView([51.505, -0.09], 13);  // This binding "map" stores the information pulled from the API for us to use here 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ADD CUSTOM MARKER ICON 
const customIcon = L.icon({ 
    iconUrl: "images/icon-location.svg"
}); 

async function fetchIP() { // queue this up 
    const ip = document.getElementById("IPInput").value; 
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}&ipAddress=${ip}`); // uses key from config file to access API data 
    const data = await response.json(); // .json method parses json strings into usable JS objects that we can access 

    showIP(data); // when you have the data, call showIP and pass it this data 
}

// function of how to update the values 
function updateDisplay(id, value) { 
    const el = document.getElementById(id); 
    el.textContent = value || '--'; 
    el.style.display = 'block'; 
}

// fetchIP(); // call the async first 
    
function showIP(data) { // when showIP is used, follow the below instructions 

    // RENDER MAP TO THE LOCATION OF IP GIVEN 
    map.setView([data.location.lat, data.location.lng], 13);

    // INCLUDE MARKER ON MAP RENDER
    L.marker([data.location.lat, data.location.lng], { icon: customIcon}).addTo(map); 

    // UPDATE DISPLAY ACCORDING TO THIS PATTERN 
    updateDisplay("ip-display", data.ip); // dot notation since we don't concantenate here 
    updateDisplay("location-display", `${data.location.city}, ${data.location.region} ${data.location.postalCode}`); // as opposed to here 
    updateDisplay("timezone-display", `UTC ${data.location.timezone}`); 
    updateDisplay("isp-display", data.isp); 
}

const form = document.getElementById("form"); 
form.addEventListener("submit", (e) => { 
    e.preventDefault(); 
    fetchIP(); 
}); 

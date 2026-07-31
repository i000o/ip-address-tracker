var map = L.map('map').setView([51.505, -0.09], 13);  // This binding "map" stores the information pulled from the API for us to use here 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ADD CUSTOM MARKER ICON 
const customIcon = L.icon({ 
    iconUrl: "images/icon-location.svg"
}); 

let currentMarker = null; 
const errorSpan = document.getElementById('error-span'); 

async function fetchIP() { // queue this up 
    const ip = document.getElementById("IPInput").value; 

    try { 
        const ipParam = ip ? `&ipAddress=${ip}` : '';
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}${ipParam}`);

        if (!response.ok) { 
            throw new Error(`API responded with status ${response.status}`)
        } 
        
        const data = await response.json(); 
        showIP(data); 
    } catch (error) { 
        console.error("Failed to fetch IP data:", error); 
        errorSpan.textContent = 'IP address not found. Please try again.'; 
        errorSpan.style.display = 'block'; 
    }
}

// function of how to update the values 
function updateDisplay(id, value) { 
    const el = document.getElementById(id); 
    el.textContent = value || '--'; 
    el.style.display = 'block'; 
}

// fetchIP(); // call the async first 
    
function showIP(data) { 

    // RENDER MAP TO THE LOCATION OF IP GIVEN 
    map.setView([data.location.lat, data.location.lng], 13);

    // INCLUDE MARKER ON MAP RENDER

    if (currentMarker) { 
        map.removeLayer(currentMarker); 
    }
   currentMarker =  L.marker([data.location.lat, data.location.lng], { icon: customIcon}).addTo(map); 


    // UPDATE DISPLAY ACCORDING TO THIS PATTERN 
    updateDisplay("ip-display", data.ip); 
    updateDisplay("location-display", `${data.location.city}, ${data.location.region} ${data.location.postalCode}`); 
    updateDisplay("timezone-display", `UTC ${data.location.timezone}`); 
    updateDisplay("isp-display", data.isp); 
}

const form = document.getElementById("form"); 
form.addEventListener("submit", (e) => { 
    e.preventDefault(); 
    fetchIP(); 
}); 

fetchIP(); 
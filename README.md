# Tip Calculator

[Live Site URL](https://i000o.github.io/ip-address-tracker/)  
![Outcome](/images/mobile-screenshot.png)

---

## Table of contents

- [Purpose & Scope](#purpose-and-scope)
- [Decisions](#decisions)
- [Debugging](#debugging)
- [Future](#future)

---

## Purpose & Scope

This is an IP Address Tracker which uses the [IP Geolocation API by Ipity](https://geo.ipify.org/) with map generation from [LeafletJS](https://leafletjs.com/). Its features include

- Takes user IP on page load and returns data on location, city, region, ISP and timezone relative to UTC.
- Renders a map image with marker specifying location and surrounding area.
- Allows zoom tooling on map and draggable reorientation.
- Clears old markers from map on page load.
- Shows error state on failure to retrieve.

`#tailwind` `#vanillajs` `#leaflet` `#api`

---

## Decisions

**API key stored in a separate config file**
Used a `config.js` file to store the API key, excluded from version control via `.gitignore`, to avoid compromising security by exposing it publicly.

**Hidden spans over dynamic DOM insertion**
Initially considered building the display elements dynamically once API data arrived, since nothing should render before the fetch resolves. Reworked this to use spans hidden by default and toggled visible via a shared `updateDisplay()` function once data is returned — because data volume is fixed, the use of `appendChild`/`replaceChildren` added complexity without benefit for a static shape like this.

**Single function to update all display fields**
Built one `updateDisplay(id, value)` function to update each of the four result fields, rather than repeating the same logic for four instances, including a fallback (`|| '--'`) for empty/missing values.

---

## Debugging

**API not defaulting to user's IP when input is empty**
Per the ipify docs, omitting the `ipAddress` param should default to the caller's own IP. Initially the fetch always appended `&ipAddress=` even when the input was empty, sending a blank value instead of omitting the param entirely — which caused the default behaviour to fail. Fixed by conditionally building the URL, only appending `&ipAddress=${ip}` when the input has a value.

**Marker duplication on repeated searches**
Each search added a new marker without removing the previous one, causing markers to stack up on the map. Stored the active marker in a `currentMarker` variable and called `map.removeLayer(currentMarker)` before adding a new one.

**Map cut off after layout changes**
The map appeared cut off/incorrectly sized after adjusting surrounding layout (breakpoints, background image). Leaflet calculates the map container's size once on init and doesn't detect later layout shifts. Fixed by calling `map.invalidateSize()` on `load` and `resize`.

---

## Future

- Add loading state while the fetch is in progress, so the UI doesn't appear frozen between submit and response.
- Improve error handling to distinguish between "invalid IP format" and "API/network failure" rather than a single generic error message.

---

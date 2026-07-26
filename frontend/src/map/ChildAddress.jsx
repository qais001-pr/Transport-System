import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Recenter map when lat/lng change
function Recenter({ lat, lng }) {
  const map = useMap();
  if (lat != null && lng != null) {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }
  return null;
}

// Handle map clicks
function ClickableMap({
  setLat,
  setLng,
  setPickupAddress,
  setSearch,
  setLatitude,
  setLongitude,
  manualSelectionRef,
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setLat(lat);
      setLng(lng);

      setLatitude(lat);
      setLongitude(lng);

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const resp = await axios.get(url, {
          headers: {
            "User-Agent": "VanPoolingApp/1.0 (your-email@example.com)",
          },
        });
        if (resp.data?.display_name) {
          setPickupAddress(resp.data.display_name);
          setSearch(resp.data.display_name); // update input box
          manualSelectionRef.current = true;
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching address from map click");
      }
    },
  });
  return null;
}

export default function ChildAddress({
  pickupAddress,
  setPickupAddress,
  setLatitude,
  setLongitude,
}) {
  const [lat, setLat] = useState(33.5848);
  const [lng, setLng] = useState(73.0658);
  const [search, setSearch] = useState(pickupAddress || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchTimer = useRef(null);
  const manualSelectionRef = useRef(false);

  // Keep input box in sync if parent changes pickupAddress
  useEffect(() => {
    setSearch(pickupAddress || "");
  }, [pickupAddress]);

  useEffect(() => {
    if (manualSelectionRef.current) {
      manualSelectionRef.current = false;
      return;
    }

    if (!search || search.trim().length < 3) {
      setSuggestions([]);
      setSearchError("");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = window.setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&limit=5&countrycodes=pk&dedupe=1&q=${encodeURIComponent(
          search + ", Pakistan",
        )}`;
        const resp = await axios.get(url, {
          headers: {
            "User-Agent": "VanPoolingApp/1.0 (your-email@example.com)",
          },
        });

        const results = resp.data || [];

        setSuggestions(results);
        setShowSuggestions(true);

        if (!results.length) {
          setSearchError("No addresses found for this query.");
        }
      } catch (err) {
        console.error(err);
        setSuggestions([]);
        setSearchError("Unable to fetch address suggestions.");
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [search]);

  const applySuggestion = (result) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);

    setLat(newLat);
    setLng(newLng);
    setLatitude(newLat);
    setLongitude(newLng);
    setPickupAddress(result.display_name);
    setSearch(result.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;

    if (suggestions.length > 0) {
      applySuggestion(suggestions[0]);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&limit=5&countrycodes=pk&dedupe=1&q=${encodeURIComponent(
        search + ", Pakistan",
      )}`;
      const resp = await axios.get(url, {
        headers: { "User-Agent": "VanPoolingApp/1.0 (your-email@example.com)" },
      });

      if (!resp.data.length) {
        setSearchError("Address not found!");
        return;
      }

      applySuggestion(resp.data[0]);
    } catch (err) {
      console.error(err);
      setSearchError("Error searching address");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <div style={{ marginBottom: 6, position: "relative" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          placeholder="e.g. House 12, Street 5, F-10, Islamabad"
          style={{ padding: 6, width: "70%" }}
        />
        <button
          type="button"
          onClick={handleSearch}
          style={{ padding: 6, marginLeft: 5 }}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: 0,
              width: "70%",
              maxHeight: 210,
              overflowY: "auto",
              background: "white",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              zIndex: 1000,
            }}
          >
            {suggestions.map((result) => (
              <button
                key={`${result.place_id}-${result.osm_id}`}
                type="button"
                onMouseDown={() => applySuggestion(result)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}

        {searchError && (
          <div style={{ color: "#b91c1c", marginTop: 6, fontSize: 13 }}>
            {searchError}
          </div>
        )}
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={18}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[lat, lng]}>
          <Popup>{pickupAddress || "Selected location 📍"}</Popup>
        </Marker>
        <Recenter lat={lat} lng={lng} />
        <ClickableMap
          setLat={setLat}
          setLng={setLng}
          setPickupAddress={setPickupAddress}
          setSearch={setSearch}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          manualSelectionRef={manualSelectionRef}
        />
      </MapContainer>
    </div>
  );
}

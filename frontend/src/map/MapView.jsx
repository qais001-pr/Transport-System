import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { motion } from "framer-motion";
import { Bus, Home, School, Building } from "lucide-react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function createStopIcon(order, status) {
  const bg =
    status === "completed"
      ? "#16a34a"
      : status === "current"
        ? "#2563eb"
        : "#e5e7eb";

  const color = status === "upcoming" ? "#374151" : "#ffffff";

  // Lucide "home" SVG (inline)
  const houseSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10L12 3l9 7"></path>
      <path d="M9 21V12h6v9"></path>
    </svg>
  `;

  return L.divIcon({
    html: `
      <div style="position:relative;width:42px;height:42px;">
        
        <!-- Main Icon -->
        <div style="
          width:36px;
          height:36px;
          background:${bg};
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
        ">
          ${houseSvg}
        </div>

        <!-- 🔢 Number Badge (top-right) -->
        <div style="
          position:absolute;
          top:-6px;
          right:-6px;
          background:#111827;
          color:white;
          font-size:10px;
          font-weight:700;
          width:18px;
          height:18px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid white;
        ">
         ${order}
        </div>

      </div>
    `,
    className: "",
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -40],
  });
}

function createSchoolIcon() {
  const schoolSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10L12 3l9 7"></path>
      <path d="M4 10v9h16v-9"></path>
      <path d="M9 21V12h6v9"></path>
    </svg>
  `;

  return L.divIcon({
    html: `
      <div style="position:relative;width:42px;height:42px;">
        
        <div style="
          width:36px;
          height:36px;
          background:#f59e0b;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid white;
          box-shadow:0 3px 8px rgba(0,0,0,0.3);
        ">
          ${schoolSvg}
        </div>

        <!-- Label -->
        <div style="
          position:absolute;
          bottom:-18px;
          left:50%;
          transform:translateX(-50%);
          background:#111827;
          color:white;
          font-size:10px;
          padding:2px 6px;
          border-radius:6px;
          white-space:nowrap;
        ">
          SCHOOL
        </div>

      </div>
    `,
    className: "",
    iconSize: [42, 50],
    iconAnchor: [21, 42],
  });
}

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

function RoutingController({
  latitude,
  longitude,
  stops = [],
  schoolLocation,
  isNavigating,
  showRoute,
}) {
  const map = useMap();
  const routingRef = useRef(null);

  const shouldShowRoute = showRoute !== undefined ? showRoute : isNavigating;

  useEffect(() => {
    if (!map || !latitude || !longitude || !shouldShowRoute) return;
    if (!stops?.length && (!schoolLocation?.lat || !schoolLocation?.lng))
      return;

    const validStops = stops.filter(
      (s) =>
        typeof s.lat === "number" &&
        typeof s.lng === "number" &&
        !isNaN(s.lat) &&
        !isNaN(s.lng),
    );

    // Remove previous routing
    if (routingRef.current && map) {
      try {
        map.removeControl(routingRef.current);
      } catch (e) {
        console.log("Error removing routing:", e);
      }
      routingRef.current = null;
    }

    const safeWaypoints = [
      L.latLng(latitude, longitude),
      ...validStops.map((s) => L.latLng(Number(s.lat), Number(s.lng))),
      schoolLocation?.lat && schoolLocation?.lng
        ? L.latLng(Number(schoolLocation.lat), Number(schoolLocation.lng))
        : null,
    ].filter(Boolean);

    const routing = L.Routing.control({
      waypoints: safeWaypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: (i, wp) => {
        // Skip marker for driver's current location (i === 0)
        if (i === 0) return null;

        // If this is the last waypoint and it's the school, don't create a stop marker
        if (
          i === safeWaypoints.length - 1 &&
          schoolLocation?.lat &&
          schoolLocation?.lng
        ) {
          return null;
        }

        const stop = validStops[i - 1];

        if (!stop) return null;

        return L.marker(wp.latLng, {
          icon: createStopIcon(stop.order ?? i, stop.status ?? "upcoming"),
        });
      },
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "driving",
        alternatives: true,
      }),
      lineOptions: {
        styles: [
          {
            color: "#2563eb",
            weight: 6,
            opacity: 0.8,
          },
          {
            color: "#ffffff",
            weight: 2,
            opacity: 1,
          },
        ],
      },
      altLineOptions: {
        styles: [
          {
            color: "#93c5fd",
            weight: 5,
            opacity: 0.5,
          },
          {
            color: "#ffffff",
            weight: 2,
            opacity: 0.6,
          },
        ],
      },
      show: true,
      showAlternatives: shouldShowRoute ? false : true,
      fitSelectedRoutes: true,
    }).addTo(map);

    routing.on("routesfound", (e) => {
      console.log("ROUTE FOUND:", e.routes);
    });

    routing.on("routingerror", (e) => {
      console.log("ROUTING ERROR:", e.error);
    });

    routingRef.current = routing;

    return () => {
      if (routingRef.current && map) {
        try {
          map.removeControl(routingRef.current);
        } catch (e) {
          console.log("Error cleaning up routing:", e);
        }
      }
    };
  }, [map, stops, latitude, longitude, shouldShowRoute]);

  return null;
}

function AnimatedVanMarker({ latitude, longitude }) {
  const map = useMap();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Update position when latitude/longitude changes or map zoom changes
  useEffect(() => {
    if (map && latitude && longitude) {
      const updatePosition = () => {
        const point = map.latLngToContainerPoint([latitude, longitude]);
        const newPosition = { x: point.x - 16, y: point.y - 16 };
        setPosition(newPosition);
        setTargetPosition(newPosition);
      };

      updatePosition();

      // Listen to zoom events to update position
      map.on("zoom", updatePosition);
      map.on("move", updatePosition);

      return () => {
        map.off("zoom", updatePosition);
        map.off("move", updatePosition);
      };
    }
  }, [map, latitude, longitude]);

  // Handle movement animation when location changes significantly
  useEffect(() => {
    if (map && latitude && longitude) {
      const point = map.latLngToContainerPoint([latitude, longitude]);
      const newPosition = { x: point.x - 16, y: point.y - 16 };

      // Check if this is a significant movement (more than 5 pixels)
      const distance = Math.sqrt(
        Math.pow(newPosition.x - position.x, 2) +
          Math.pow(newPosition.y - position.y, 2),
      );

      if (distance > 5) {
        // Calculate direction of movement
        const dx = newPosition.x - position.x;
        const dy = newPosition.y - position.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        setRotation(angle);

        setTargetPosition(newPosition);
        setIsMoving(true);

        // Update actual position after animation
        setTimeout(() => {
          setPosition(newPosition);
          setIsMoving(false);
        }, 5000);
      }
    }
  }, [latitude, longitude, position]);

  return (
    <motion.div
      className="absolute z-[10000] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        width: 32,
        height: 32,
      }}
      animate={
        isMoving
          ? {
              left: targetPosition.x,
              top: targetPosition.y,
              // rotate: rotation,
            }
          : {
              // rotate: rotation,
            }
      }
      transition={{ duration: 5, ease: "linear" }}
    >
      <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg drop-shadow-lg">
        <Bus className="h-6 w-6" />
      </div>
    </motion.div>
  );
}

export default function MapView({
  latitude,
  longitude,
  stops = [],
  schoolLocation,
  isNavigating,
  showRoute,
}) {
  return (
    <MapContainer
      center={[latitude || 33.6844, longitude || 73.0479]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <AnimatedVanMarker latitude={latitude} longitude={longitude} />

      {stops
        ?.filter((s) => s.lat && s.lng)
        .map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createStopIcon(stop.order, stop.status)}
          >
            <Popup>
              <div style={{ padding: "4px 0", fontSize: "14px" }}>
                <div style={{ fontWeight: "700", marginBottom: "4px" }}>
                  Stop {stop.order}
                </div>
                <div style={{ marginBottom: "4px" }}>{stop.student}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  {stop.address}
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  Distance: {stop.distance?.toFixed(2)} km
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {schoolLocation?.lat && schoolLocation?.lng && (
        <Marker
          position={[schoolLocation.lat, schoolLocation.lng]}
          icon={createSchoolIcon()}
        >
          <Popup>
            <div>
              <strong>🏫 {schoolLocation.name || "School"}</strong>
            </div>
          </Popup>
        </Marker>
      )}

      <RoutingController
        latitude={latitude}
        longitude={longitude}
        stops={stops}
        schoolLocation={schoolLocation}
        isNavigating={isNavigating}
        showRoute={showRoute}
      />
      <Recenter lat={latitude} lng={longitude} />
    </MapContainer>
  );
}

// | Zoom | Meaning     |
// | ---- | ----------- |
// | 0    | Whole world |
// | 5    | Country     |
// | 10   | City        |
// | 15   | Streets     |
// | 18+  | Buildings   |

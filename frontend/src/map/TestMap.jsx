import MapView from "./MapView";

export default function TestMap() {
  return (
    <div style={{ height: "100vh" }}>
      <MapView lat={33.68} lng={73.04} />
    </div>
  );
}
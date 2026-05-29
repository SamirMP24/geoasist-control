import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

function AttendanceMap({
  latitud,
  longitud
}) {

  return (

    <MapContainer
      center={[latitud, longitud]}
      zoom={16}
      scrollWheelZoom={true}
      className="
        h-[500px]
        w-full
        rounded-2xl
      "
    >

      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
"
      />

      <Marker
        position={[latitud, longitud]}
      >

        <Popup>
          Ubicación del trabajador
        </Popup>

      </Marker>

    </MapContainer>
  );
}

export default AttendanceMap;
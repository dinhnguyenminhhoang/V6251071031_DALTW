import { Button } from "antd";
import { CgClose } from "react-icons/cg";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useState } from "react";

const BranchMap = ({ latitude, longitude, name, address, onClose }) => {
  const [currentPosition, setCurrentPosition] = useState(null);

  // Lấy vị trí hiện tại
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, []);

  const AddRoutingMachine = () => {
    const map = useMap();

    useEffect(() => {
      if (currentPosition) {
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(currentPosition.lat, currentPosition.lng), // Điểm bắt đầu (vị trí hiện tại)
            L.latLng(latitude, longitude), // Điểm kết thúc (địa điểm đánh dấu)
          ],
          routeWhileDragging: true, // Cho phép kéo đường đi
          show: true,
        }).addTo(map);

        return () => map.removeControl(routingControl);
      }
    }, [currentPosition, latitude, longitude, map]);

    return null;
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Button
        className="absolute top-2 right-2 z-10 border border-red-500"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: "50%",
          zIndex: 1000,
        }}
      >
        <CgClose color="red" />
      </Button>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marker cho địa điểm được đánh dấu */}
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {address}
          </Popup>
        </Marker>

        {/* Marker cho vị trí hiện tại */}
        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]}>
            <Popup>Vị trí hiện tại của bạn</Popup>
          </Marker>
        )}

        {/* Routing (Đường đi) */}
        {currentPosition && <AddRoutingMachine />}
      </MapContainer>
    </div>
  );
};

export default BranchMap;

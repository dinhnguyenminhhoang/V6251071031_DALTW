import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { getBranchesDetaiil } from "@/service/branchs";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

const BrachesFrom = ({ initialValues, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [latitude, setLatitude] = useState(initialValues?.Latitude || 10.8231);
  const [longitude, setLongitude] = useState(
    initialValues?.Longitude || 106.6297
  );

  const handleFinish = (values) => {
    onSave(values);
  };

  useEffect(() => {
    if (initialValues) {
      getBranchesDetaiil({ branchesid: initialValues })
        .then((response) => response.data)
        .then((data) => {
          if (data.Success) {
            form.setFieldsValue(data.ResultData);
            setLatitude(data.ResultData.Latitude);
            setLongitude(data.ResultData.Longitude);
          }
        });
    }
  }, [initialValues]);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setLatitude(lat);
    setLongitude(lng);
    form.setFieldsValue({
      Latitude: lat,
      Longitude: lng,
    });
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item
        name="Name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please input the branch name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Address"
        label="Address"
        rules={[
          {
            required: true,
            message: "Please input the branch address!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="Latitude"
        label="Latitude"
        rules={[
          {
            required: true,
            message: "Please input the latitude!",
          },
        ]}
      >
        <Input value={latitude} />
      </Form.Item>
      <Form.Item
        name="Longitude"
        label="Longitude"
        rules={[
          {
            required: true,
            message: "Please input the longitude!",
          },
        ]}
      >
        <Input value={longitude} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: "8px" }}>
          Cancel
        </Button>
      </Form.Item>

      <div style={{ height: "400px", width: "100%" }}>
        {/* Điều chỉnh chiều cao và chiều rộng */}
        <MapContainer
          center={[latitude, longitude]} // Đặt center bản đồ theo tọa độ
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenReady={(map) => map.target.on("click", handleMapClick)} // Thêm sự kiện click
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[latitude, longitude]}>
            <Popup>
              <strong>Branch Location</strong>
              <br />
              Latitude: {latitude}
              <br />
              Longitude: {longitude}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </Form>
  );
};

export default BrachesFrom;

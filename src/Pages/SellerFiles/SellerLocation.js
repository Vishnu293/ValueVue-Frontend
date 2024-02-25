import { Box, Card, Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../HeaderFiles/Navbar";
import Category from "../HomeLayouts/Category";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Loading";

const GOOGLE_MAPS_API_KEY = "AIzaSyC-7H1dWirXia_4m4I2drN1ID9SVFIE3Sk";
//AIzaSyC-7H1dWirXia_4m4I2drN1ID9SVFIE3Sk
//AIzaSyCNAFWcEGz59qyWo9-UU2VhDVriQJdpDlM

const SellerLocation = () => {
  const navigate = useNavigate();
  const { sellerid } = useParams();
  const [selectedSeller, setSelectedSeller] = useState("");
  const { lat } = useSelector((state) => state.location);
  const { lng } = useSelector((state) => state.location);
  const { description } = useSelector((state) => state.location);
  const [dlng, setDlng] = useState(0);
  const [dlat, setDlat] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const getSingleSeller = async () => {
    try {
      const singleSellerUrl = `http://localhost:8080/seller/get/${sellerid}`;
      const response = await axios.get(singleSellerUrl);
      setSelectedSeller(response.data);

    if (Array.isArray(response?.data?.sellerCords)) {
      setDlat(response?.data?.sellerCords[0]);
      setDlng(response?.data?.sellerCords[1]);
    } else if (response?.data?.sellerCords && response?.data?.sellerCords.lat && response?.data?.sellerCords.lng) {
      setDlat(response?.data?.sellerCords.lat);
      setDlng(response?.data?.sellerCords.lng);
    } else {
      console.error("Invalid coordinates format for seller:", response.data);
    }
      console.log(response);
      console.log(lat)
      console.log(lng)
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw error;
    }
  };

  useEffect(() => {
    setLoading(true);
    getSingleSeller();
  }, []);

  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer();

  const fetchData = async () => {
    console.log("current location", typeof(lat), lng, description)
    try {
      await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (typeof lat === 'number' && typeof lng === 'number') {
      showMap(lng, lat);
      setLoading(false)
    } else {
      console.error("Invalid latitude or longitude values");
      setLoading(false)
    }
  } catch (error) {
      console.error("Error fetching location data:", error);
      setLoading(false)
    }
  };

  useEffect(() => {
    if(selectedSeller !== ""){
      fetchData();
    }
  }, [selectedSeller]);

  const showMap = (lng, lat) => {
    if (window.google && window.google.maps) {
      let map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });
      const sourceMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        label: "Source",
      });
      const destinationMarker = new window.google.maps.Marker({
        position: { lat: dlat, lng: dlng },
        map: map,
        label: "Destination",
      });

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(sourceMarker.getPosition());
      bounds.extend(destinationMarker.getPosition());

      map.fitBounds(bounds);

      const maxZoom = 15;
      const zoom = map.getZoom();
      if (zoom > maxZoom) {
        map.setZoom(maxZoom);
      }

      const request = {
        origin: { lat, lng },
        destination: { lat: dlat, lng: dlng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(result);
        } else {
          console.error("Error getting directions:", status);
        }
      });
    } else {
      console.error("Google Maps API is not available");
    }
  };

  return (
    <Box>
      <Navbar />
      <Category />
      <Icon style={{ cursor: 'pointer', padding: '1.5rem', marginLeft: '1rem',  marginBottom: '0.5rem',color: "black"}} onClick={() => navigate(-1)}><ArrowBackIcon/></Icon>
      {loading && <Loading/>}
      <Card
        id="map"
        sx={{
          margin: "0 auto",
          height: "80vh",
          width: "90vw",
        }}
      >
      </Card>
    </Box>
  );
};

export default SellerLocation;
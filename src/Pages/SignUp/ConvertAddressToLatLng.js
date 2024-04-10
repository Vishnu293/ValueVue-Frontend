import axios from "axios";

const MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const ConvertAddressToLatLng = async (
  formData,
  setFormData,
  addressFields,
  coordsField
) => {
  const fullAddress = addressFields.map((field) => formData[field]).join(", ");
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        fullAddress
      )}&key=${MAPS_KEY}`
    );
    const results = response.data.results;
    if (results.length > 0) {
      const location = results[0].geometry.location;
      setFormData((prevData) => ({
        ...prevData,
        [coordsField]: {
          lat: location.lat,
          lng: location.lng,
        },
      }));
    }
  } catch (error) {
    console.error("Error converting address to coordinates:", error);
  }
};

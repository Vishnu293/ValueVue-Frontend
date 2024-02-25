import axios from 'axios';

const YOUR_API_KEY = "AIzaSyC-7H1dWirXia_4m4I2drN1ID9SVFIE3Sk";

export const ConvertAddressToLatLng = async (formData, setFormData, addressFields, coordsField) => {
  const fullAddress = addressFields.map(field => formData[field]).join(', ');
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        fullAddress
      )}&key=${YOUR_API_KEY}`
    );
    const results = response.data.results;
    console.log(results)
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
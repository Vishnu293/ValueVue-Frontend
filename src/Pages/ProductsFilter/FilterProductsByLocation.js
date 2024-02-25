import React, { useState, useEffect } from "react";
import axios from "axios";
import haversine from "./Haversine";

const FilterProductsByLocation = (products, userCoordinates, maxDistance) => {
  const [sellerDetails, setSellerDetails] = useState([]);

  const getSellersForMap = async () => {
    await axios
      .get("http://localhost:8080/seller/loc/get")
      .then((res) => {
        setSellerDetails(res.data);
      })
      .catch((error) => {
        console.error("Error fetching sellers for map:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getSellersForMap();
      console.log(sellerDetails);
    };

    fetchData();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const sellerId = product.sellerId;
      if (!sellerId) {
        return false;
      }

      console.log(sellerId);

      const seller = sellerDetails.find((seller) => seller.id === sellerId._id);

      console.log(seller);

      if (!seller || seller?.coordinates?.length !== 2) {
        return false;
      }

      console.log(seller.coordinates[0]);
      // const latValues = seller.map((seller) => seller.coordinates.lat);

      // console.log(latValues);

      const distance = haversine(
        userCoordinates.lat,
        userCoordinates.lng,
        seller.coordinates[0],
        seller.coordinates[1]
      );
      product.distance = distance;
      return distance <= maxDistance;
    })
    .sort((a, b) => a.distance - b.distance);

  return filteredProducts;
};

export default FilterProductsByLocation;

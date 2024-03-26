import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Button,
  CardContent,
  Typography,
  CardMedia,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Category from "../HomeLayouts/Category.js";
import Navbar from "../HeaderFiles/Navbar.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "../Loading.js";
import NavigationPD from "./NavigationPD.js";
import { useNavigate } from "react-router-dom";
import { selectLocation } from "../../redux/location/locationSlice.js";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Out from "../../Assets/outofstock.png";
import In from "../../Assets/instock.png";
import Low from "../../Assets/lowinstock.png";

const ProductDetails = ({ productsList }) => {
  const dispatch = useDispatch();
  const locationn = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { productid } = useParams();
  const [selectedProduct, setSelectedProduct] = useState("");
  const selectedUser = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);
  const newLocation = {
    description: selectedUser?.currentUser?.data?.userCity,
    lat: selectedUser?.currentUser?.data?.userCords[0],
    lng: selectedUser?.currentUser?.data?.userCords[1],
  };

  const renderFeatures = (features) => {
    if (!features) return null;

    return Object.entries(features).map(([key, value]) => {
      if (typeof value === "object") {
        return (
          <Box key={key}>
            <Box
              sx={{
                display: "flex",
                padding: "0.2rem 0 0.3rem 2rem",
              }}
            >
              <Typography
                sx={{
                  color: "text.primary",
                  flexBasis: "40%",
                  fontSize: "90%",
                }}
              >
                {value.name}
              </Typography>
              <Typography
                sx={{
                  color: "text.primary",
                  flexBasis: "10%",
                  fontSize: "90%",
                }}
              >
                -
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  flexBasis: "50%",
                  fontSize: "90%",
                }}
              >
                {value.value}
              </Typography>
            </Box>
            <Divider sx={{ width: "110%" }} />
          </Box>
        );
      } else {
        return (
          <Box key={key}>
            <Box
              sx={{
                display: "flex",
                padding: "0.2rem 0 0.3rem 2rem",
              }}
            >
              <Typography
                sx={{
                  color: "text.primary",
                  flexBasis: "40%",
                  fontSize: "90%",
                }}
              >
                {key}
              </Typography>
              <Typography
                sx={{
                  color: "text.primary",
                  flexBasis: "10%",
                  fontSize: "90%",
                }}
              >
                -
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  flexBasis: "50%",
                  fontSize: "90%",
                }}
              >
                {value}
              </Typography>
            </Box>
            <Divider sx={{ width: "110%" }} />
          </Box>
        );
      }
    });
  };

  useEffect(() => {
    console.log("Effect triggered");
    console.log("Current pathname:", locationn.pathname);
    if (locationn.pathname === "/") {
      console.log("Current pathname:", locationn.pathname);
      console.log("Updating location in Redux");
      dispatch(selectLocation(newLocation));
    }
  }, [locationn.pathname, dispatch]);

  const getSingleProduct = async () => {
    try {
      const singleProductUrl = `http://localhost:8080/product/get/${productid}`;
      const response = await axios.get(singleProductUrl);
      setSelectedProduct(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw error;
    }
  };

  const openSellerLocation = async (selectedProduct) => {
    try {
      navigate(`../seller/location/${selectedProduct.sellerId._id}`);
    } catch (error) {
      console.error("Error navigating to seller location:", error);
    }
  };

  const openSellerDetailsPage = (productId) => {
    const sellerId = selectedProduct?.sellerId?._id;
    if (sellerId) {
      navigate(`../seller/details/${sellerId}`);
    } else {
      console.error("Seller ID is not available.");
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  if (!selectedProduct) {
    return <Loading />;
  }

  const getBase64FromBuffer = (buffer, mimetype) => {
    return `data:${mimetype};base64,${buffer.toString("base64")}`;
  };

  const imageData = selectedProduct?.productImage?.buffer;
  const dataUrl = imageData
    ? getBase64FromBuffer(imageData, selectedProduct?.productImage?.mimetype)
    : null;

  return (
    <Box>
      <Navbar />
      <Category />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          fontSize: "20px",
          gap: 4,
          padding: "1rem",
          marginLeft: "1rem",
        }}
      >
        <NavigationPD selectedProduct={selectedProduct} />
      </div>
      <Box
        sx={{
          display: "flex",
          margin: "15px",
          height: "80vh",
          maxHeight: "fit-content",
          width: "93vw",
          margin: "0 auto",
          gap: 2,
        }}
      >
        <Card
          sx={{
            padding: "20px",
            flexBasis: "80%",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", height: "70%", gap: 2 }}>
            <CardMedia
              component="img"
              sx={{
                width: "40%",
                maxWidth: "40%",
                maxHeight: "110%",
                objectFit: "contain",
                alignSelf: "flex-start",
                border: "1px solid black",
                borderRadius: "5%",
                padding: "0.5rem",
              }}
              image={dataUrl || selectedProduct.productImage}
              alt={selectedProduct.productName}
            />
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "50%" }}
            >
              <CardContent sx={{ flex: "2 2" }}>
                <Typography sx={{ fontSize: "200%", fontWeight: "500" }}>
                  {selectedProduct.productName}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: "150%", marginLeft: "1.5rem" }}
                >
                  {selectedProduct.productCategory}
                </Typography>
                <Typography sx={{ fontSize: "200%", marginLeft: "1.5rem" }}>
                  Rs. {selectedProduct.productPrice}/-
                </Typography>
                <Box
                  sx={{
                    margin: "1.5rem 0 1.5rem 0",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "120%", paddingBottom: "0.5rem" }}
                  >
                    <strong>Product Features:</strong>
                  </Typography>
                  {renderFeatures(selectedProduct.productFeatures)}
                  {renderFeatures(selectedProduct.customFeatures)}
                </Box>
              </CardContent>
            </Box>
          </Box>
          <Box sx={{ display: "flex", height: "30%", width: "100%" }}>
            <CardContent>
              <Typography variant="body1">
                <strong>Product Description: </strong>
                <Typography
                  component="span"
                  color="text.secondary"
                  sx={{
                    fontSize: "1rem",
                    textTransform: "none",
                    marginLeft: "0.5rem",
                  }}
                >
                  {selectedProduct.productDesc}
                </Typography>
              </Typography>
            </CardContent>
          </Box>
          <img
            src={
              selectedProduct?.productStock === "Out of Stock"
                ? Out
                : selectedProduct?.productStock === "Low in Stock"
                ? Low
                : In
            }
            width={"8%"}
            style={{
              padding: "2rem 0 1rem 0",
              position: "absolute",
              right: "1rem",
              top: "-1rem",
            }}
          />
        </Card>
        <Card
          sx={{
            display: "flex",
            padding: "10px",
            flexBasis: "20%",
            position: "relative",
          }}
        >
          <Box sx={{ alignItems: "center", padding: "0.5rem 1rem" }}>
            <Box>
              <Typography
                sx={{
                  fontSize: "150%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <strong style={{ fontSize: "100%" }}>Seller Details</strong>
              </Typography>
            </Box>
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "8rem",
                  height: "8rem",
                  objectFit: "contain",
                }}
                image={`data:${
                  selectedProduct?.sellerId?.sellerAvatar?.mimetype
                };base64,${selectedProduct?.sellerId?.sellerAvatar?.buffer?.toString(
                  "base64"
                )}`}
                alt={selectedProduct?.sellerId?.sellerAvatar}
              />
              <Typography sx={{ fontSize: "100%", textAlign: "center" }}>
                {selectedProduct.sellerId.sellerName}
              </Typography>
              <Typography sx={{ fontSize: "100%", textAlign: "center" }}>
                {`${selectedProduct.sellerId.sellerDoor}, ${selectedProduct.sellerId.sellerStreet}, ${selectedProduct.sellerId.sellerCity}`}
              </Typography>
              <Typography sx={{ fontSize: "100%", textAlign: "center" }}>
                {selectedProduct.sellerId.sellerEmail}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "2rem",
                  textAlign: "center",
                }}
              >
                {currentUser ? (
                  <Button
                    variant="contained"
                    sx={{
                      alignSelf: "center",
                      height: "fit-content",
                      width: "80%",
                      marginBottom: "5px",
                      fontWeight: "600",
                      "&:hover": { color: "gold" },
                    }}
                    onClick={() => openSellerLocation(selectedProduct)}
                  >
                    Get Location
                  </Button>
                ) : null}
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: "center",
                    height: "fit-content",
                    width: "80%",
                    marginBottom: "5px",
                    fontWeight: "600",
                    "&:hover": { color: "gold" },
                  }}
                  onClick={() => openSellerDetailsPage(selectedProduct._id)}
                >
                  Seller Details
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default ProductDetails;

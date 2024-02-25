import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Skeleton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import Navbar from "../HeaderFiles/Navbar.js";
import SearchProducts from "../HomeLayouts/SearchProducts.js";
import ProductsElectronic from "../ProductsFiles/ProductsElectronic.js";
import ProductsHealth from "../ProductsFiles/ProductsHealth.js";
import ProductsOffice from "../ProductsFiles/ProductsOffice.js";
import ProductsGrocery from "../ProductsFiles/ProductsGrocery.js";
import ProductsOthers from "../ProductsFiles/ProductsOthers.js";
import ProductsPersonal from "../ProductsFiles/ProductsPersonal.js";
import Category from "../HomeLayouts/Category.js";

const ProductsCategoryPage = ({ productsCategory }) => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayAllProducts, setDisplayAllProducts] = useState(false);
  const productsPerPage = 20;
  const API = `http://localhost:8080/product/category/${productsCategory}`;
  const selectedLocation = useSelector((state) => state.location);
  const userLat = selectedLocation.lat;
  const userLng = selectedLocation.lng;

  const openProductDetails = async (productId) => {
    try {
      navigate(`/product/${productId._id}`);
    } catch (error) {
      console.error("Error navigating to product details:", error);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      setProductsList(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLat !== null && userLng !== null) {
      getProducts();
    }
  }, [userLat, userLng]);

  if (productsList.length === 0 && !productsList) {
    return <p>No Products Available</p>;
  }

  const handleSeeMore = () => {
    setDisplayAllProducts(true);
  };

  const getCategoryComponent = () => {
    switch (productsCategory) {
      case "Electronics":
        return <ProductsElectronic />;
      case "Grocery and Food":
        return <ProductsGrocery />;
      case "Health and Wellness":
        return <ProductsHealth />;
      case "Beauty and Personal Care":
        return <ProductsPersonal />;
      case "Office and Stationery":
        return <ProductsOffice />;
      case "Others":
        return <ProductsOthers />;
      default:
        return <p>No Products Available</p>;
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f0f0f0" }}>
      <Navbar />
      <Category />
      <div
        style={{
          padding: "1rem",
          paddingBottom: "0px",
          marginLeft: "1rem",
        }}
      >
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
              "&:active": {
                color: "red",
              }
            }}
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <Typography>{productsCategory}</Typography>
        </Breadcrumbs>
      </div>
      <SearchProducts category={productsCategory} />
      {getCategoryComponent()}

      {loading ? (
        <Card
          sx={{ backgroundColor: "white", padding: "20px", margin: "15px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              style={{ fontSize: "25px" }}
            >{`${productsCategory} You Like`}</h1>
          </div>
          <Box
            sx={{
              backgroundColor: "white",
              paddingTop: "7px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {[...Array(5)].map((_, index) => (
              <Card
                key={index}
                sx={{
                  width: "250px",
                  height: "340px",
                  margin: "0.5rem",
                  padding: "0 10px",
                  maxHeight: "400px",
                }}
              >
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  sx={{
                    width: "100%",
                    height: "200px",
                    marginTop: "15px",
                  }}
                />
                <CardContent
                  sx={{
                    padding: "0 20px",
                    paddingTop: "10px",
                    "&.MuiCardContent-root:last-child": {
                      paddingBottom: "10px",
                      minHeight: "150px",
                    },
                  }}
                >
                  <Typography>
                    <Skeleton animation="wave" sx={{ width: "100%" }} />
                  </Typography>
                  <Typography>
                    <Skeleton animation="wave" width="40%" />
                  </Typography>
                  <Typography>
                    <Skeleton animation="wave" width="60%" />
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Card>
      ) : (
        <Card
          sx={{ backgroundColor: "white", padding: "20px", margin: "15px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              style={{ fontSize: "25px" }}
            >{`${productsCategory} You Like`}</h1>
            {!displayAllProducts && (
              <Button
                variant="contained"
                onClick={handleSeeMore}
                sx={{
                  textAlign: "center",
                  marginLeft: "auto",
                  fontWeight: "600",
                  "&:hover": { color: "gold" },
                }}
              >
                See More
              </Button>
            )}
          </div>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {(displayAllProducts
              ? productsList.filter(
                  (product) => product.productCategory === productsCategory
                )
              : productsList
                  .filter(
                    (product) => product.productCategory === productsCategory
                  )
                  .slice(0, productsPerPage)
            ).map((productItem, productIndex) => {
              const imageData = productItem.productImage?.buffer;
              const dataUrl = imageData
                ? `data:${
                    productItem.productImage.mimetype
                  };base64,${imageData.toString("base64")}`
                : null;
              return (
                <Button
                  key={productItem.productId}
                  onClick={() => {
                    openProductDetails(productItem);
                  }}
                  sx={{
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.1s ease-in-out",
                    },
                  }}
                >
                  <Card
                    sx={{
                      width: "250px",
                      maxHeight: "400px",
                      margin: "0.5rem",
                      padding: "0 10px",
                      cursor: "pointer",
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: "200px",
                        backgroundSize: "contain",
                        marginTop: "15px",
                        padding: "0px",
                      }}
                      image={dataUrl}
                      title={productItem.productName}
                    />
                    <CardContent
                      sx={{
                        padding: "0 20px",
                        paddingTop: "10px",
                        "&.MuiCardContent-root:last-child": {
                          paddingBottom: "10px",
                          minHeight: "150px",
                        },
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ textTransform: "none" }}
                      >
                        {productItem.productName}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", textTransform: "none" }}
                      >
                        {productItem.sellerId.sellerName} -{" "}
                        {productItem.productCategory}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ textAlign: "center", textTransform: "none" }}
                      >
                        Rs. {productItem.productPrice}/-
                      </Typography>
                    </CardContent>
                  </Card>
                </Button>
              );
            })}
          </Box>
          <Box sx={{ textAlign: "center", margin: "1rem" }}>
            {displayAllProducts && (
              <Typography
                variant="caption"
                sx={{
                  marginTop: 2,
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                All products are displayed.
              </Typography>
            )}
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default ProductsCategoryPage;

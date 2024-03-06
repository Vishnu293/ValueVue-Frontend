import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const SearchProducts = ({ category }) => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isSearchInitiated, setIsSearchInitiated] = useState(false);
  const API = "http://localhost:8080/product/user/get";
  const nAPI = "http://localhost:8080/product/get";
  const selectedLocation = useSelector((state) => state.location);
  const userLat = selectedLocation.lat;
  const userLng = selectedLocation.lng;
  const menuItems = [
    "Electronics",
    "Grocery and Food",
    "Beauty and Personal Care",
    "Health and Wellness",
    "Office and Stationery",
    "Others",
  ];
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isAutoHighlightEnabled, setAutoHighlightEnabled] = useState(false);

  const openProductDetails = async (productId) => {
    try {
      navigate(`/product/${productId._id}`);
    } catch (error) {
      console.error("Error navigating to product details:", error);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    await axios
      .get(API, {
        params: {
          userLat: userLat,
          userLng: userLng,
          maxDistance: 50,
        },
      })
      .then((res) => {
        setProductsList(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllProducts = async () => {
    setLoading(true);
    await axios
      .get(nAPI)
      .then((res) => {
        setProductsList(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userLat !== null && userLng !== null) {
      getProducts();
    }
    else {
      getAllProducts();
    }
  }, [userLat, userLng]);

  const getAutocompleteOptions = () => {
    if (searchName.trim() === "") {
      setAutocompleteOptions([]);
      return;
    }

    let filteredProductsForAutocomplete = productsList;

    if (!isHomePage) {
      filteredProductsForAutocomplete = productsList.filter(
        (product) => product.productCategory === searchCategory
      );
    }

    const options = filteredProductsForAutocomplete
      .filter((product) =>
        product.productName.toLowerCase().includes(searchName.toLowerCase())
      )
      .map((product) => product.productName);
    setAutocompleteOptions(options);
  };

  useEffect(() => {
    if (!isHomePage) {
      setSearchCategory(category);
    }
    getAutocompleteOptions();
  }, [productsList, searchCategory, category]);

  useEffect(() => {
    getAutocompleteOptions();
  }, [searchName]);

  if (!productsList) {
    return <p>No Products Available</p>;
  }

  const sortedProducts = [...productsList].sort(
    (a, b) => a.productPrice - b.productPrice
  );

  const handleSearch = () => {
    const modifiedSearchName = searchName.replace(/\s/g, "").toLowerCase();

    const filtered = sortedProducts.filter((product) => {
      const productNameWithoutSpaces = product.productName
        .replace(/\s/g, "")
        .toLowerCase();

      const nameMatch =
        productNameWithoutSpaces.includes(modifiedSearchName) ||
        modifiedSearchName === "";

      const categoryMatch =
        product.productCategory === searchCategory || searchCategory === "";

      return nameMatch && categoryMatch;
    });
    setFilteredProducts(filtered);
    setIsSearchInitiated(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectBlur = () => {
    if (searchCategory !== "") {
      handleSearch();
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Card
      sx={{
        backgroundColor: "white",
        padding: "20px",
        margin: "15px",
        marginTop: "15px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: "25px" }}>Search For Products</h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isHomePage ? "space-between" : "center",
          gap: 50,
          width: "80vw",
          margin: "20px auto",
        }}
      >
        <Autocomplete
          options={autocompleteOptions}
          value={searchName}
          onChange={(event, newValue) => setSearchName(newValue)}
          onInputChange={() => getAutocompleteOptions()}
          disableClearable
          freeSolo
          autoHighlight={isAutoHighlightEnabled}
          sx={{
            width: isHomePage ? "40%" : "70%",
            height: "99%",
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="filled-basic"
              label="Search by Name"
              variant="filled"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                endAdornment: (
                  <IconButton
                    onClick={handleSearch}
                    sx={{
                      padding: "0",
                      marginLeft: "0",
                      margin: "0",
                      position: "absolute",
                      right: "10px",
                      top: "16px",
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          )}
        />
        {isHomePage ? (
          <FormControl
            variant="outlined"
            sx={{
              width: "40%",
            }}
          >
            <InputLabel id="productCategory">Search by Category</InputLabel>
            <Select
              labelId="productCategorySelect"
              id="productCategorySelect"
              label="Category"
              variant="filled"
              name="productCategory"
              disableUnderline
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              sx={{
                width: "100%",
              }}
              onFocus={handleSelectBlur}
              onKeyPress={handleKeyPress}
            >
              {menuItems.map((menuItem, menuItemIndex) => (
                <MenuItem key={menuItemIndex} value={menuItem}>
                  {menuItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
      </div>
      {isSearchInitiated && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          {filteredProducts.map((productItem, productIndex) => {
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
                    transform: "scale(1.005)",
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
      )}
    </Card>
  );
};

export default SearchProducts;

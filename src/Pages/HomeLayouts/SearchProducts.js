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
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
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
  const API = "http://localhost:8080/product/get";
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
    "All",
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

  useEffect(() => {
    if (userLat !== null && userLng !== null) {
      getProducts();
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
    let filtered;

    if (searchCategory === "All") {
      filtered = sortedProducts.filter((product) => {
        const modifiedSearchName = searchName.replace(/\s/g, "").toLowerCase();
        const productNameWithoutSpaces = product.productName
          .replace(/\s/g, "")
          .toLowerCase();

        const nameMatch =
          productNameWithoutSpaces.includes(modifiedSearchName) ||
          modifiedSearchName === "";

        return nameMatch;
      });
    } else {
      filtered = sortedProducts.filter((product) => {
        const modifiedSearchName = searchName.replace(/\s/g, "").toLowerCase();
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
    }

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

  if (isSearchInitiated && filteredProducts.length === 0) {
    return (
      <ThemeProvider theme={lightTheme}>
        <Card
          sx={{
            backgroundColor: "white",
            padding: "20px",
            margin: "15px",
            marginTop: "20px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: "1.5rem",
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            >
              Search for Products
            </Typography>
          </Box>
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
                        <SearchIcon sx={{ fontSize: "20px" }} />
                      </IconButton>
                    ),
                  }}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyUp={handleKeyPress}
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
                  onKeyUp={handleKeyPress}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {menuItems.map((menuItem, menuItemIndex) => (
                    <MenuItem key={menuItemIndex} value={menuItem}>
                      {menuItem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
          </div>
          <Box sx={{ textAlign: "center", margin: "1rem" }}>
            <Typography
              variant="caption"
              sx={{
                marginTop: 2,
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              No products found.
            </Typography>
          </Box>
        </Card>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <Card
        sx={{
          backgroundColor: "white",
          padding: "20px",
          margin: "15px",
          marginTop: "20px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "1.5rem",
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
          >
            Search for Products
          </Typography>
        </Box>
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
                      <SearchIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  ),
                }}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyUp={handleKeyPress}
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
                onKeyUp={handleKeyPress}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
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
              width: "100%",
              justifyContent: "flex-start",
              margin: "2.5rem 1rem 1.5rem 1rem",
              gap: 2,
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
                <Box
                  key={productItem.productId}
                  onClick={() => {
                    openProductDetails(productItem);
                  }}
                  sx={{
                    margin: "-0.5rem",
                    "&:hover": {
                      boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
                      transition: "boxShadow 0.1s ease-in-out",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "240px",
                      height: "fit-content",
                      maxHeight: "325px",
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
                        component="div"
                        fontSize="16px"
                        sx={{
                          textAlign: "left",
                          textTransform: "none",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 2,
                          lineClamp: 2,
                        }}
                      >
                        {productItem.productName}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="text.secondary"
                        fontSize="12px"
                        sx={{
                          textAlign: "left",
                          textTransform: "none",
                          margin: "0.2rem 0",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 2,
                          lineClamp: 2,
                        }}
                      >
                        {productItem.productCategory}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          textAlign: "left",
                          textTransform: "none",
                          marginTop: "0.5rem",
                        }}
                      >
                        <b style={{ fontSize: "16px" }}>
                          ₹ {productItem.productPrice}/-
                        </b>
                      </Typography>
                    </CardContent>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Card>
    </ThemeProvider>
  );
};

export default SearchProducts;

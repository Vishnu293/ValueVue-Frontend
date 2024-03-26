import {
  Box,
  Card,
  Button,
  CardContent,
  Typography,
  CardMedia,
  Divider,
  Icon,
  Tab,
  Tabs,
  Paper,
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../HeaderFiles/Navbar";
import Category from "../HomeLayouts/Category";
import ImageSlider from "../ImageSlider";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Loading";

const SellerDetails = () => {
  const navigate = useNavigate();
  const { sellerid } = useParams();
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);
  const [firstCategoryOpen, setFirstCategoryOpen] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const getSingleSeller = async () => {
    try {
      const singleSellerUrl = `http://localhost:8080/seller/get/${sellerid}`;
      const response = await axios.get(singleSellerUrl);
      setSelectedSeller(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching single seller:", error);
      throw error;
    }
  };

  const fetchProductCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/product/seller/${sellerid}`
      );
      const products = response.data;
      const uniqueCategories = [
        ...new Set(products.map((product) => product.productCategory)),
      ];

      const categoriesWithProducts = uniqueCategories.map((category, index) => {
        const filteredProducts = products.filter(
          (product) => product.productCategory === category
        );
        return { category, products: filteredProducts, open: index === 0 };
      });

      setProductCategories(categoriesWithProducts);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  const openSellerLocation = async () => {
    try {
      navigate(`../seller/location/${selectedSeller._id}`);
    } catch (error) {
      console.error("Error navigating to seller location:", error);
    }
  };

  const callSeller = () => {
    const phoneNumber = selectedSeller?.sellerMobile;
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      console.error("No phone number available");
    }
  };

  const handleSubcategoryClick = (index) => {
    const updatedCategories = productCategories.map((category, i) => ({
      ...category,
      open: i === index ? !category.open : false,
    }));

    if (index !== 0) {
      updatedCategories[0].open = false;
    }

    setProductCategories(updatedCategories);
    setSelectedCategoryIndex(index);
    setSelectedCategoryProducts(updatedCategories[index].products);
  };

  const openProductDetails = async (productId) => {
    try {
      navigate(`/product/${productId._id}`);
    } catch (error) {
      console.error("Error navigating to product details:", error);
    }
  };

  useEffect(() => {
    setSelectedCategoryProducts(
      productCategories[selectedCategoryIndex]?.products || []
    );
  }, [productCategories, selectedCategoryIndex]);

  useEffect(() => {
    setLoading(true);
    getSingleSeller();
    fetchProductCategories();
  }, []);

  useEffect(() => {
    if (productCategories.length > 0) {
      const updatedCategories = [...productCategories];
      setFirstCategoryOpen(true);
      setProductCategories(updatedCategories);
    }
  }, [productCategories.length]);

  useEffect(() => {
    setActiveTab(0);
  }, []);

  return (
    <Box>
      <Navbar />
      <Category />
      <Icon
        sx={{
          cursor: "pointer",
          marginLeft: "1.5rem",
          marginBottom: "0.5rem",
          marginTop: "1rem",
          color: "black",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </Icon>
      {loading && <Loading />}
      <Card
        sx={{
          display: "flex",
          backgroundColor: "white",
          padding: "20px",
          height: "80vh",
          width: "93vw",
          margin: "0 auto",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Box sx={{ alignItems: "center", pl: 2, pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: "1rem",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: "8rem",
                  height: "8rem",
                  objectFit: "contain",
                  alignSelf: "flex-start",
                  marginRight: "1rem",
                  flex: "10%",
                }}
                image={selectedSeller?.sellerAvatar}
                alt={selectedSeller?.sellerName}
              />
              <Box
                sx={{
                  flex: "75%",
                }}
              >
                <Typography sx={{ fontSize: "200%" }}>
                  {selectedSeller.sellerName}
                </Typography>
                <Typography sx={{ fontSize: "100%" }}>
                  {`${selectedSeller?.sellerDoor}, ${selectedSeller?.sellerStreet}, ${selectedSeller?.sellerCity}, `}
                  <br />{" "}
                  {`${selectedSeller?.sellerDistrict}, ${selectedSeller?.sellerState}, `}
                  <br />{" "}
                  {` ${selectedSeller?.sellerCountry}, ${selectedSeller?.sellerZipCode}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: "15%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                {currentUser ? (
                  <Button
                    variant="contained"
                    sx={{
                      alignSelf: "center",
                      width: "100%",
                      height: "fit-content",
                      marginBottom: "5px",
                      fontWeight: "600",
                      "&:hover": { color: "gold" },
                    }}
                    onClick={() => openSellerLocation(selectedSeller)}
                  >
                    Get Location
                  </Button>
                ) : null}
                {currentUser ? (
                  <Button
                    variant="contained"
                    sx={{
                      alignSelf: "center",
                      width: "100%",
                      height: "fit-content",
                      marginBottom: "5px",
                      fontWeight: "600",
                      "&:hover": { color: "gold" },
                    }}
                    onClick={callSeller}
                  >
                    Call us
                  </Button>
                ) : null}
              </Box>
            </Box>
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                backgroundColor: "gold",
                height: "0.5rem",
                "&.MuiTabs-root": {
                  minHeight: "40px",
                },
              }}
            >
              {/* <Tab
                label="Home"
                sx={{
                  color: "black",
                  fontWeight: "600",
                  width: "15%",
                  "&.Mui-selected": {
                    color: "white",
                  },
                  backgroundColor:
                    activeTab === 0 ? "darkgoldenrod" : "transparent",
                }}
                onClick={() => setActiveTab(0)}
              /> */}
              <Tab
                label="Our Products"
                sx={{
                  color: "black",
                  fontWeight: "600",
                  width: "15%",
                  "&.Mui-selected": {
                    color: "white",
                  },
                  backgroundColor:
                    activeTab === 0 ? "darkgoldenrod" : "transparent",
                }}
                onClick={() => setActiveTab(0)}
              />
              <Tab
                label="About us"
                sx={{
                  color: "black",
                  fontWeight: "600",
                  width: "15%",
                  "&.Mui-selected": {
                    color: "white",
                  },
                  backgroundColor:
                    activeTab === 1 ? "darkgoldenrod" : "transparent",
                }}
                onClick={() => setActiveTab(1)}
              />
              <Tab
                label="Contact us"
                sx={{
                  color: "black",
                  fontWeight: "600",
                  width: "15%",
                  "&.Mui-selected": {
                    color: "white",
                  },
                  backgroundColor:
                    activeTab === 2 ? "darkgoldenrod" : "transparent",
                }}
                onClick={() => setActiveTab(2)}
              />
            </Tabs>
            {/* {activeTab === 0 && (
              <Box>
                <Box
                  sx={{
                    padding: "1rem 0",
                  }}
                >
                  <ImageSlider images={images} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      textAlign: "center",
                      margin: "1.5rem 0 0.5rem 0",
                      fontSize: "100%",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    ABOUT US{" "}
                  </Typography>
                  <Typography>
                    To adjust the position of the custom arrows in the
                    ImageSlider component, you can set the position of the
                    arrows relative to the slider itself. Here's how you can
                    modify the position of the arrows to appear on the sides of
                    the slider
                  </Typography>
                </Box>
              </Box>
            )} */}
            {activeTab === 0 && (
              <Box
                sx={{
                  margin: "1rem 0",
                  display: "flex",
                  gap: "1rem",
                  height: "50vh",
                }}
              >
                <Paper
                  sx={{
                    flexBasis: "30%",
                    overflowY: "auto",
                    maxHeight: "calc(82vh - 100px)",
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    subheader={
                      <ListSubheader
                        component="div"
                        id="nested-list-subheader"
                        sx={{
                          color: "black",
                          fontSize: "1rem",
                          fontWeight: "600",
                        }}
                      >
                        Categories
                      </ListSubheader>
                    }
                  >
                    {productCategories.map((category, index) => (
                      <div key={category.category}>
                        <ListItemButton
                          onClick={() => handleSubcategoryClick(index)}
                        >
                          <ListItemText
                            primary={`${category.category} (${category.products.length})`}
                            primaryTypographyProps={{
                              fontSize: "0.9rem",
                              color: category.open ? "black" : "#666",
                            }}
                          />
                          {category.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse
                          in={category.open}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {category.products.map((product) => (
                              <ListItemButton key={product._id}>
                                <ListItemText secondary={product.productName} />
                              </ListItemButton>
                            ))}
                          </List>
                        </Collapse>
                      </div>
                    ))}
                  </List>
                </Paper>
                <Box sx={{ flex: 1, overflowY: "auto", height: "50vh" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1rem",
                      padding: "0.5rem",
                      minHeight: "100%",
                    }}
                  >
                    {selectedCategoryProducts.map((product, index) => (
                      <Box
                        key={product._id}
                        onClick={() => {
                          openProductDetails(product);
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
                            width: "200px",
                            height: "fit-content",
                            maxHeight: "325px",
                            cursor: "pointer",
                            margin: "1rem",
                          }}
                        >
                          <CardMedia
                            sx={{
                              height: "200px",
                              backgroundSize: "contain",
                              marginTop: "7.5px",
                              padding: "0px",
                            }}
                            component="img"
                            image={
                              product.productImage?.buffer
                                ? `data:${
                                    product.productImage.mimetype
                                  };base64,${product.productImage.buffer.toString(
                                    "base64"
                                  )}`
                                : ""
                            }
                            title={product.productName}
                          />
                          <CardContent
                            sx={{
                              padding: "0 20px",
                              paddingTop: "10px",
                              "&.MuiCardContent-root:last-child": {
                                paddingBottom: "10px",
                                minHeight: "calc(50% - 1rem)",
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
                              {product.productName}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="body2"
                              color="text.secondary"
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
                              {product.productCategory}
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
                                ₹ {product.productPrice}/-
                              </b>
                            </Typography>
                          </CardContent>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            {activeTab === 1 && (
              <>
                <Box
                  sx={{
                    padding: "1rem 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "1.5rem 0 1rem 0",
                      fontSize: "100%",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    ABOUT US{" "}
                  </Typography>
                  <Typography>
                    {" "}
                    To adjust the position of the custom arrows in the
                    ImageSlider component, you can set the position of the
                    arrows relative to the slider itself. Here's how you can
                    modify the position of the arrows to appear on the sides of
                    the slider
                  </Typography>
                </Box>
              </>
            )}
            {activeTab === 2 && (
              <>
                <Box
                  sx={{
                    padding: "1rem 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "1.5rem 0 1rem 0",
                      fontSize: "100%",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    CONTACT US{" "}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    <LocationOnIcon sx={{ marginRight: "10px" }} />
                    <b
                      style={{
                        paddingRight: "5.2rem",
                      }}
                    >
                      Address:
                    </b>
                    {`${selectedSeller?.sellerDoor}, ${selectedSeller?.sellerStreet}, ${selectedSeller?.sellerCity}, `}{" "}
                    {`${selectedSeller?.sellerDistrict}, ${selectedSeller?.sellerState}, `}{" "}
                    {`${selectedSeller?.sellerCountry}, ${selectedSeller?.sellerZipCode}`}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    <PersonIcon sx={{ marginRight: "10px" }} />{" "}
                    <b
                      style={{
                        paddingRight: "3.65rem",
                      }}
                    >
                      Seller name:
                    </b>
                    {`${selectedSeller.sellerName}`}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    <CallIcon sx={{ marginRight: "10px" }} />{" "}
                    <b
                      style={{
                        paddingRight: "4.3rem",
                      }}
                    >
                      Mobile no.:
                    </b>
                    {`${selectedSeller.sellerMobile}`}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: "10px",
                    }}
                  >
                    <EmailIcon sx={{ marginRight: "10px" }} />{" "}
                    <b
                      style={{
                        paddingRight: "6.7rem",
                      }}
                    >
                      Email:
                    </b>
                    {`${selectedSeller.sellerEmail}`}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default SellerDetails;

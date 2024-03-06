import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Card,
  Icon,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Input,
  InputAdornment,
  Button,
  IconButton,
  FormControl,
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Add = () => {
  const navigate = useNavigate();
  const { currentSeller } = useSelector((state) => state.seller);

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productCategory: "",
    productDesc: "",
    productStock: "",
    productImage: null,
    sellerId: currentSeller.data._id,
    productFeatures: {},
    customFeatures: {},
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProductData({
        ...productData,
        productImage: file,
      });
    } else {
      Swal.fire({
        title: "Invalid Image Format",
        text: "Please select a valid image file.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const onFeatureChange = (e, featureName) => {
    const { value } = e.target;
    setProductData({
      ...productData,
      productFeatures: {
        ...productData.productFeatures,
        [featureName]: value,
      },
    });
  };

  const onCustomFeatureNameChange = (e, key) => {
    const { value } = e.target;
    setProductData({
      ...productData,
      customFeatures: {
        ...productData.customFeatures,
        [key]: { ...productData.customFeatures[key], name: value },
      },
    });
  };

  const onCustomFeatureValueChange = (e, key) => {
    const { value } = e.target;
    setProductData({
      ...productData,
      customFeatures: {
        ...productData.customFeatures,
        [key]: { ...productData.customFeatures[key], value: value },
      },
    });
  };

  const addCustomFeature = () => {
    const updatedCustomFeatures = { ...productData.customFeatures };
    const newIndex = Object.keys(updatedCustomFeatures).length + 1;
    updatedCustomFeatures[newIndex] = { name: "", value: "" };
    setProductData({
      ...productData,
      customFeatures: updatedCustomFeatures,
    });
  };

  const removeCustomFeature = (key) => {
    const updatedCustomFeatures = { ...productData.customFeatures };
    delete updatedCustomFeatures[key];
    setProductData({
      ...productData,
      customFeatures: updatedCustomFeatures,
    });
  };

  const Add = () => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(productData)) {
      if (key === "productFeatures" || key === "customFeatures") {
        // Convert productFeatures and customFeatures to JSON strings
        formData.append(key, JSON.stringify(value));
      } else if (key === "productImage") {
        formData.append(key, value); // Append the file directly
      } else {
        formData.append(key, value);
      }
    }
    axios
      .post("http://localhost:8080/product/add", formData)
      .then((res) => {
        Swal.fire({
          title: "Product Added Successful!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          title: "Product Added Failed!",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const renderFeatureInputs = () => {
    const { productCategory } = productData;
    switch (productCategory) {
      case "Electronics":
        return (
          <>
            <TextField
              label="Type"
              onChange={(e) => onFeatureChange(e, "Type")}
              fullWidth
            />
            <TextField
              label="Brand"
              onChange={(e) => onFeatureChange(e, "Brand")}
              fullWidth
            />
            <TextField
              label="Model"
              onChange={(e) => onFeatureChange(e, "Model")}
              fullWidth
            />
            <TextField
              label="Dimensions"
              onChange={(e) => onFeatureChange(e, "Dimensions")}
              fullWidth
            />
            <TextField
              label="Power"
              onChange={(e) => onFeatureChange(e, "Power")}
              fullWidth
            />
          </>
        );
      case "Grocery and Food":
        return (
          <>
            <TextField
              label="Ingredients"
              onChange={(e) => onFeatureChange(e, "Ingredients")}
              fullWidth
            />
            <TextField
              label="Nutritional Information"
              onChange={(e) => onFeatureChange(e, "NutritionalInformation")}
              fullWidth
            />
            <TextField
              label="Net Weight"
              onChange={(e) => onFeatureChange(e, "NetWeight")}
              fullWidth
            />
            <TextField
              label="Packaging Type"
              onChange={(e) => onFeatureChange(e, "PackagingType")}
              fullWidth
            />
            <TextField
              label="Certifications"
              onChange={(e) => onFeatureChange(e, "Certifications")}
              fullWidth
            />
          </>
        );
      case "Beauty and Personal Care":
        return (
          <>
            <TextField
              label="Ingredients"
              onChange={(e) => onFeatureChange(e, "Ingredients")}
              fullWidth
            />
            <TextField
              label="Skin Type"
              onChange={(e) => onFeatureChange(e, "SkinType")}
              fullWidth
            />
            <TextField
              label="Usage Instructions"
              onChange={(e) => onFeatureChange(e, "UsageInstructions")}
              fullWidth
            />
            <TextField
              label="Safety Information"
              onChange={(e) => onFeatureChange(e, "SafetyInformation")}
              fullWidth
            />
            <TextField
              label="Product Benefits"
              onChange={(e) => onFeatureChange(e, "ProductBenefits")}
              fullWidth
            />
          </>
        );
      case "Health and Wellness":
        return (
          <>
            <TextField
              label="Ingredients"
              onChange={(e) => onFeatureChange(e, "Ingredients")}
              fullWidth
            />
            <TextField
              label="Nutritional Information"
              onChange={(e) => onFeatureChange(e, "NutritionalInfo")}
              fullWidth
            />
            <TextField
              label="Usage Instructions"
              onChange={(e) => onFeatureChange(e, "UsageInstructions")}
              fullWidth
            />
            <TextField
              label="Safety Information"
              onChange={(e) => onFeatureChange(e, "SafetyInformation")}
              fullWidth
            />
            <TextField
              label="Product Benefits"
              onChange={(e) => onFeatureChange(e, "ProductBenefits")}
              fullWidth
            />
          </>
        );
      case "Office and Stationery":
        return (
          <>
            <TextField
              label="Material Type"
              onChange={(e) => onFeatureChange(e, "MaterialType")}
              fullWidth
            />
            <TextField
              label="Size or Dimensions"
              onChange={(e) => onFeatureChange(e, "SizeorDimensions")}
              fullWidth
            />
            <TextField
              label="Colors"
              onChange={(e) => onFeatureChange(e, "Colors")}
              fullWidth
            />
            <TextField
              label="Durability"
              onChange={(e) => onFeatureChange(e, "Durability")}
              fullWidth
            />
            <TextField
              label="Packaging Type"
              onChange={(e) => onFeatureChange(e, "PackagingType")}
              fullWidth
            />
          </>
        );
      case "Others":
        return (
          <>
            <TextField
              label="Dimensions"
              onChange={(e) => onFeatureChange(e, "Dimensions")}
              fullWidth
            />
            <TextField
              label="Packaging Type"
              onChange={(e) => onFeatureChange(e, "PackagingType")}
              fullWidth
            />
            <TextField
              label="Usage Instructions"
              onChange={(e) => onFeatureChange(e, "UsageInstructions")}
              fullWidth
            />
            <TextField
              label="Safety Information"
              onChange={(e) => onFeatureChange(e, "SafetyInformation")}
              fullWidth
            />
            <TextField
              label="Warranty Information"
              onChange={(e) => onFeatureChange(e, "WarrantyInformation")}
              fullWidth
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderCustomFeatures = () => {
    return Object.keys(productData.customFeatures).map((key) => (
      <Box key={key} sx={{ display: "flex", gap: "10px", width: "100%" }}>
        <TextField
          label="Feature Name"
          variant="outlined"
          value={productData.customFeatures[key].name}
          onChange={(e) => onCustomFeatureNameChange(e, key)}
          fullWidth
        />
        <TextField
          label="Feature Value"
          variant="outlined"
          value={productData.customFeatures[key].value}
          onChange={(e) => onCustomFeatureValueChange(e, key)}
          fullWidth
        />
        <IconButton onClick={() => removeCustomFeature(key)}>
          <RemoveIcon />
        </IconButton>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        margin: "0 auto",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Icon
        style={{
          cursor: "pointer",
          padding: "1.5rem",
          marginLeft: "1rem",
          marginBottom: "0.5rem",
          color: "black",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </Icon>

      <Typography
        sx={{ textAlign: "center", marginBottom: "6vh", fontSize: "30px" }}
      >
        Add a Product
      </Typography>
      <Card
        sx={{
          width: "90vw",
          height: "75vh",
          justifyContent: "center",
          padding: "40px",
          margin: "0 auto",
          position: "relative",
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexBasis: "calc(100% / 3)",
              gap: 2,
            }}
          >
            <TextField
              id="productName"
              label="Product Name"
              variant="outlined"
              value={productData.productName}
              name="productName"
              onChange={onChange}
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TextField
                id="productPrice"
                label="Product Price"
                variant="outlined"
                value={productData.productPrice}
                name="productPrice"
                onChange={onChange}
                fullWidth
                sx={{ flexBasis: "50%" }}
              />
              <FormControl
                variant="outlined"
                fullWidth
                sx={{
                  flexBasis: "50%",
                }}
              >
                <InputLabel id="productStockLabel">Product Stock</InputLabel>
                <Select
                  labelId="productStockLabel"
                  id="productStock"
                  label="Stock Available"
                  value={productData.productStock}
                  name="productStock"
                  onChange={onChange}
                >
                  <MenuItem value="In Stock">In Stock</MenuItem>
                  <MenuItem value="Low in Stock">Low in Stock</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              multiline
              rows={2}
              label="Description"
              maxRows={Infinity}
              style={{ width: "100%", height: "50px", marginBottom: "20px" }}
              value={productData.productDesc}
              name="productDesc"
              onChange={onChange}
            />
            <FormControl
              variant="outlined"
              fullWidth
              sx={{
                marginTop: "0.5rem",
              }}
            >
              <InputLabel id="productCategory">Category</InputLabel>
              <Select
                id="productCategorySelect"
                label="Category"
                value={productData.productCategory}
                name="productCategory"
                onChange={onChange}
              >
                <MenuItem value={"Electronics"}>Electronics</MenuItem>
                <MenuItem value={"Grocery and Food"}>Grocery and Food</MenuItem>
                <MenuItem value={"Beauty and Personal Care"}>
                  Beauty and Personal Care
                </MenuItem>
                <MenuItem value={"Health and Wellness"}>
                  Health and Wellness
                </MenuItem>
                <MenuItem value={"Office and Stationery"}>
                  Office and Stationery
                </MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormHelperText sx={{ textAlign: "center", marginBottom: "0.5rem" }}>
                Select an Image file
              </FormHelperText>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                name="productImage"
                onChange={onImageChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton component="span">
                      <CloudUploadIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexBasis: "calc(100% / 3)",
              gap: 2,
            }}
          >
            <Typography sx={{ textAlign: "left" }}>Add Features:</Typography>
            {/* Rendering additional feature inputs based on the selected category */}
            {renderFeatureInputs()}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexBasis: "calc(100% / 3)",
            }}
          >
            {/* Custom feature inputs */}
            <Typography sx={{ textAlign: "left", paddingBottom: "1rem" }}>
              Custom Features:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              {/* Render custom features */}
              {renderCustomFeatures()}
              <IconButton onClick={addCustomFeature}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={Add}
          sx={{
            marginTop: "20px",
            fontWeight: "600",
            "&:hover": { color: "gold" },
            position: "absolute",
            bottom: "1.5rem",
          }}
        >
          Add
        </Button>
      </Card>
    </Box>
  );
};

export default Add;

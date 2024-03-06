import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
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
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Edit = () => {
  const navigate = useNavigate();
  const { productid } = useParams();
  const [saveFlag, setSaveFlag] = useState(true);
  const [resetFlag, setResetFlag] = useState(true);
  const menuItems = [
    "Electronics",
    "Grocery and Food",
    "Beauty and Personal Care",
    "Health and Wellness",
    "Office and Stationery",
    "Others",
  ];

  const [modifiedProductDetails, setModifiedProductDetails] = useState({
    productName: "",
    productPrice: "",
    productCategory: "",
    productDesc: "",
    productStock: "",
    productImage: null,
    productFeatures: {},
    customFeatures: {},
  });
  const [checkProductDetails, setCheckProductDetails] = useState({
    productName: "",
    productPrice: "",
    productCategory: "",
    productDesc: "",
    productStock: "",
    productImage: null,
    productFeatures: {},
    customFeatures: {},
  });

  const productDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/product/get/${productid}`
      );
      setModifiedProductDetails(res.data);
      setCheckProductDetails(res.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    productDetails();
  }, [productid]);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "productImage") {
      const file = e.target.files[0];

      if (file && file.type.startsWith("image/")) {
        setModifiedProductDetails({
          ...modifiedProductDetails,
          [name]: file,
        });
      } else {
        Swal.fire({
          title: "Invalid Image Format",
          text: "Please select a valid image file.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      setModifiedProductDetails({
        ...modifiedProductDetails,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    if (
      modifiedProductDetails.productName === checkProductDetails.productName &&
      modifiedProductDetails.productPrice ===
        checkProductDetails.productPrice &&
      modifiedProductDetails.productCategory ===
        checkProductDetails.productCategory &&
      modifiedProductDetails.productStock ===
        checkProductDetails.productStock &&
      modifiedProductDetails.productDesc === checkProductDetails.productDesc &&
      modifiedProductDetails.productImage ===
        checkProductDetails.productImage &&
      JSON.stringify(modifiedProductDetails.productFeatures) ===
        JSON.stringify(checkProductDetails.productFeatures) &&
      JSON.stringify(modifiedProductDetails.customFeatures) ===
        JSON.stringify(checkProductDetails.customFeatures)
    ) {
      setSaveFlag(false);
      setResetFlag(false);
    } else {
      setSaveFlag(true);
      setResetFlag(true);
    }
  }, [modifiedProductDetails]);

  const onFeatureChange = (e, featureName) => {
    const { value } = e.target;
    setModifiedProductDetails({
      ...modifiedProductDetails,
      productFeatures: {
        ...modifiedProductDetails.productFeatures,
        [featureName]: value,
      },
    });
  };

  const onCustomFeatureNameChange = (e, key) => {
    const { value } = e.target;
    setModifiedProductDetails({
      ...modifiedProductDetails,
      customFeatures: {
        ...modifiedProductDetails.customFeatures,
        [key]: { ...modifiedProductDetails.customFeatures[key], name: value },
      },
    });
  };

  const onCustomFeatureValueChange = (e, key) => {
    const { value } = e.target;
    setModifiedProductDetails({
      ...modifiedProductDetails,
      customFeatures: {
        ...modifiedProductDetails.customFeatures,
        [key]: { ...modifiedProductDetails.customFeatures[key], value: value },
      },
    });
  };

  const addCustomFeature = () => {
    const updatedCustomFeatures = { ...modifiedProductDetails.customFeatures };
    const newIndex = Object.keys(updatedCustomFeatures).length + 1;
    updatedCustomFeatures[newIndex] = { name: "", value: "" };
    setModifiedProductDetails({
      ...modifiedProductDetails,
      customFeatures: updatedCustomFeatures,
    });
  };

  const removeCustomFeature = (key) => {
    const updatedCustomFeatures = { ...modifiedProductDetails.customFeatures };
    delete updatedCustomFeatures[key];
    setModifiedProductDetails({
      ...modifiedProductDetails,
      customFeatures: updatedCustomFeatures,
    });
  };

  const Reset = () => {
    setModifiedProductDetails(checkProductDetails);
  };

  const Save = async () => {
    const formData = new FormData();

    const modifiedData = { ...modifiedProductDetails };
    modifiedData.productFeatures = JSON.stringify(modifiedData.productFeatures);
    modifiedData.customFeatures = JSON.stringify(modifiedData.customFeatures);

    for (const [key, value] of Object.entries(modifiedData)) {
      const sanitizedValue = value !== undefined ? value : "";
      formData.append(key, sanitizedValue);
    }

    await axios
      .post(`http://localhost:8080/product/edit/${productid}`, formData)
      .then((res) => {
        Swal.fire({
          title: "Update Successful!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          title: "Update Failed!",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const renderFeatureInputs = () => {
    const { productCategory, productFeatures } = modifiedProductDetails;

    switch (productCategory) {
      case "Electronics":
        return (
          <>
            <TextField
              label="Type"
              onChange={(e) => onFeatureChange(e, "Type")}
              value={productFeatures?.Type || ""}
              fullWidth
            />
            <TextField
              label="Brand"
              onChange={(e) => onFeatureChange(e, "Brand")}
              value={productFeatures?.Brand || ""}
              fullWidth
            />
            <TextField
              label="Model"
              onChange={(e) => onFeatureChange(e, "Model")}
              value={productFeatures?.Model || ""}
              fullWidth
            />
            <TextField
              label="Dimensions"
              onChange={(e) => onFeatureChange(e, "Dimensions")}
              value={productFeatures?.Dimensions || ""}
              fullWidth
            />
            <TextField
              label="Power"
              onChange={(e) => onFeatureChange(e, "Power")}
              value={productFeatures?.Power || ""}
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
              value={productFeatures?.Ingredients || ""}
              fullWidth
            />
            <TextField
              label="Nutritional Information"
              onChange={(e) => onFeatureChange(e, "NutritionalInformation")}
              value={productFeatures?.NutritionalInformation || ""}
              fullWidth
            />
            <TextField
              label="Net Weight"
              onChange={(e) => onFeatureChange(e, "NetWeight")}
              value={productFeatures?.NetWeight || ""}
              fullWidth
            />
            <TextField
              label="Packaging Type"
              onChange={(e) => onFeatureChange(e, "PackagingType")}
              value={productFeatures?.PackagingType || ""}
              fullWidth
            />
            <TextField
              label="Certifications"
              onChange={(e) => onFeatureChange(e, "Certifications")}
              value={productFeatures?.Certifications || ""}
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
              value={productFeatures?.Ingredients || ""}
              fullWidth
            />
            <TextField
              label="Skin Type"
              onChange={(e) => onFeatureChange(e, "SkinType")}
              value={productFeatures?.SkinType || ""}
              fullWidth
            />
            <TextField
              label="Usage Instructions"
              onChange={(e) => onFeatureChange(e, "UsageInstructions")}
              value={productFeatures?.UsageInstructions || ""}
              fullWidth
            />
            <TextField
              label="Safety Information"
              onChange={(e) => onFeatureChange(e, "SafetyInformation")}
              value={productFeatures?.SafetyInformation || ""}
              fullWidth
            />
            <TextField
              label="Product Benefits"
              onChange={(e) => onFeatureChange(e, "ProductBenefits")}
              value={productFeatures?.ProductBenefits || ""}
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
              value={productFeatures?.Ingredients || ""}
              fullWidth
            />
            <TextField
              label="Nutritional Information"
              onChange={(e) => onFeatureChange(e, "NutritionalInfo")}
              value={productFeatures?.NutritionalInfo || ""}
              fullWidth
            />
            <TextField
              label="Usage Instructions"
              onChange={(e) => onFeatureChange(e, "UsageInstructions")}
              value={productFeatures?.UsageInstructions || ""}
              fullWidth
            />
            <TextField
              label="Safety Information"
              onChange={(e) => onFeatureChange(e, "SafetyInformation")}
              value={productFeatures?.SafetyInformation || ""}
              fullWidth
            />
            <TextField
              label="Product Benefits"
              onChange={(e) => onFeatureChange(e, "ProductBenefits")}
              value={productFeatures?.ProductBenefits || ""}
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
              value={productFeatures?.MaterialType || ""}
              fullWidth
            />
            <TextField
              label="Size or Dimensions"
              onChange={(e) => onFeatureChange(e, "SizeorDimensions")}
              value={productFeatures?.SizeorDimensions || ""}
              fullWidth
            />
            <TextField
              label="Colors"
              onChange={(e) => onFeatureChange(e, "Colors")}
              value={productFeatures?.Colors || ""}
              fullWidth
            />
            <TextField
              label="Durability"
              onChange={(e) => onFeatureChange(e, "Durability")}
              value={productFeatures?.Durability || ""}
              fullWidth
            />
            <TextField
              label="Packaging Type"
              onChange={(e) => onFeatureChange(e, "PackagingType")}
              value={productFeatures?.PackagingType || ""}
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
              value={productFeatures?.Dimensions || ""}
              fullWidth
            />
            <TextField
              label="Packaging Type"
              onChange={(e) => onFeatureChange(e, "PackagingType")}
              value={productFeatures?.PackagingType || ""}
              fullWidth
            />
            <TextField
              label="Usage Instructions"
              onChange={(e) => onFeatureChange(e, "UsageInstructions")}
              value={productFeatures?.UsageInstructions || ""}
              fullWidth
            />
            <TextField
              label="Safety Information"
              onChange={(e) => onFeatureChange(e, "SafetyInformation")}
              value={productFeatures?.SafetyInformation || ""}
              fullWidth
            />
            <TextField
              label="Warranty Information"
              onChange={(e) => onFeatureChange(e, "WarrantyInformation")}
              value={productFeatures?.WarrantyInformation || ""}
              fullWidth
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderCustomFeatures = () => {
    const { customFeatures } = modifiedProductDetails;

    const isCustomFeaturesEmpty =
      !customFeatures || Object.keys(customFeatures).length === 0;

    if (isCustomFeaturesEmpty) {
      return (
        <IconButton onClick={addCustomFeature}>
          <AddIcon />
        </IconButton>
      );
    }

    return Object.keys(customFeatures).map((key) => (
      <Box key={key} sx={{ display: "flex", gap: "10px", width: "100%" }}>
        <TextField
          label="Feature Name"
          variant="outlined"
          value={customFeatures[key]?.name || ""}
          onChange={(e) => onCustomFeatureNameChange(e, key)}
          fullWidth
        />
        <TextField
          label="Feature Value"
          variant="outlined"
          value={customFeatures[key]?.value || ""}
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
        Edit the Product
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
              value={modifiedProductDetails.productName}
              name="productName"
              onChange={(e) => {
                onChange(e);
              }}
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
                value={modifiedProductDetails.productPrice}
                name="productPrice"
                onChange={(e) => {
                  onChange(e);
                }}
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
                  value={modifiedProductDetails.productStock}
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
              value={modifiedProductDetails.productDesc}
              name="productDesc"
              onChange={(e) => {
                onChange(e);
              }}
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
                labelId="productCategorySelect"
                id="productCategorySelect"
                label="Category"
                value={modifiedProductDetails.productCategory}
                name="productCategory"
                onChange={(e) => {
                  onChange(e);
                }}
              >
                {menuItems.map((menuItem, menuItemIndex) => (
                  <MenuItem key={menuItemIndex} value={menuItem}>
                    {menuItem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormHelperText
                sx={{ textAlign: "center", marginBottom: "0.5rem" }}
              >
                Select an image file
              </FormHelperText>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                name="productImage"
                onChange={onChange}
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
              {renderCustomFeatures()}
              <IconButton onClick={addCustomFeature}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            position: "absolute",
            bottom: "1.5rem",
          }}
        >
          <Button
            disabled={!resetFlag}
            variant="contained"
            color="error"
            onClick={() => {
              Reset();
            }}
            sx={{
              marginTop: "20px",
              fontWeight: "600",
              "&:hover": { color: "gold" },
            }}
          >
            Reset
          </Button>
          <Button
            disabled={!saveFlag}
            variant="contained"
            color="primary"
            onClick={() => {
              Save();
            }}
            sx={{
              marginTop: "20px",
              fontWeight: "600",
              "&:hover": { color: "gold" },
            }}
          >
            Save
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Edit;

import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

const NavigationPD = ({ selectedProduct }) => {
  const formatCategory = (category) => {
    return category.toLowerCase().replace(/\s/g, "");
  };

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <Link style={{color: "blue"}} to="/">Home</Link>
      <Link style={{color: "blue"}} to={`/${formatCategory(selectedProduct.productCategory)}`}>
        {selectedProduct.productCategory}
      </Link>
      <Typography>{selectedProduct.productName}</Typography>
    </Breadcrumbs>
  );
};

export default NavigationPD;

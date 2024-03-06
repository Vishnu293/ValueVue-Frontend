import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

const NavigationPD = ({ selectedProduct }) => {
  const { currentUser } = useSelector((state) => state.user);

  const formatCategory = (category) => {
    return category.toLowerCase().replace(/\s/g, "");
  };

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <Link style={{ color: "blue" }} to="/">
        Home
      </Link>
      {currentUser ? (
        <Link
          style={{ color: "blue" }}
          to={`/${formatCategory(selectedProduct.productCategory)}`}
        >
          {selectedProduct.productCategory}
        </Link>
      ) : null}
      <Typography>{selectedProduct.productName}</Typography>
    </Breadcrumbs>
  );
};

export default NavigationPD;

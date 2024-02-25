import Products from "../ProductsFiles/Products.js";
import Backtotop from "../FooterFiles/Backtotop.js";
import Footer from "../FooterFiles/Footer.js";
import Category from "./Category.js";
import Navbar from "../HeaderFiles/Navbar.js";
import SellerTable from "../SellerFiles/SellerTable.js";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import SearchProducts from "./SearchProducts.js";
import ProductsElectronic from "../ProductsFiles/ProductsElectronic.js";
import ProductsGrocery from "../ProductsFiles/ProductsGrocery.js";
import ProductsPersonal from "../ProductsFiles/ProductsPersonal.js";
import ProductsHealth from "../ProductsFiles/ProductsHealth.js";
import ProductsOffice from "../ProductsFiles/ProductsOffice.js";
import ProductsOthers from "../ProductsFiles/ProductsOthers.js";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  selectLocation
} from "../../redux/location/locationSlice.js";
import CategoryAlpha from "./CategoryAlpha.js";

const HomePage = () => {
  const dispatch = useDispatch();
  const locationn = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const selectedUser = useSelector((state) => state.user);
  const newLocation = {
    description: selectedUser?.currentUser?.data?.userCity,
    lat: selectedUser?.currentUser?.data?.userCords.lat,
    lng: selectedUser?.currentUser?.data?.userCords.lng,
  };

  useEffect(() => {
    if (locationn.pathname === "/") {
      dispatch(selectLocation(newLocation));
    }
  }, [locationn.pathname, dispatch, newLocation]);

  return (
    <Box sx={{ backgroundColor: "#f0f0f0" }}>
      <Navbar />
      <Category />
      {currentUser ? <CategoryAlpha /> : null}
      {currentUser ? <Box sx={{height: "3rem"}}></Box> : null}
      {currentSeller ? <SellerTable /> : null}
      {currentUser ? <SearchProducts /> : null}
      {currentUser ? <Products /> : null}
      {currentUser ? <ProductsElectronic /> : null}
      {currentUser ? <ProductsGrocery /> : null}
      {currentUser ? <ProductsPersonal /> : null}
      {currentUser ? <ProductsHealth /> : null}
      {currentUser ? <ProductsOffice /> : null}
      {currentUser ? <ProductsOthers /> : null}
      <Backtotop />
      <Footer />
    </Box>
  );
};
export default HomePage;
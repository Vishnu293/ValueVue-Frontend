import Products from "../ProductsFiles/Products.js";
import Backtotop from "../FooterFiles/Backtotop.js";
import Footer from "../FooterFiles/Footer.js";
import Category from "./Category.js";
import Navbar from "../HeaderFiles/Navbar.js";
import SellerTable from "../SellerFiles/SellerTable.js";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import SearchProducts from "./SearchProducts.js";
import AccessDialog from "./AccessDialog.js";
import ProductsElectronic from "../ProductsFiles/ProductsElectronic.js";
import ProductsGrocery from "../ProductsFiles/ProductsGrocery.js";
import ProductsPersonal from "../ProductsFiles/ProductsPersonal.js";
import ProductsHealth from "../ProductsFiles/ProductsHealth.js";
import ProductsOffice from "../ProductsFiles/ProductsOffice.js";
import ProductsOthers from "../ProductsFiles/ProductsOthers.js";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { selectLocation } from "../../redux/location/locationSlice.js";
import CategoryAlpha from "./CategoryAlpha.js";

const HomePage = () => {
  const dispatch = useDispatch();
  const locationn = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const selectedUser = useSelector((state) => state.user);
  const newLocation = {
    description: selectedUser?.currentUser?.data?.userCity,
    lat:
      selectedUser?.currentUser?.data?.userCords.lat !== null &&
      selectedUser?.currentUser?.data?.userCords.lat !== undefined
        ? selectedUser?.currentUser?.data?.userCords.lat
        : selectedUser?.currentUser?.data?.userCords[0],
    lng:
      selectedUser?.currentUser?.data?.userCords.lng !== null &&
      selectedUser?.currentUser?.data?.userCords.lng !== undefined
        ? selectedUser?.currentUser?.data?.userCords.lng
        : selectedUser?.currentUser?.data?.userCords[1],
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
      {currentUser ? <Box sx={{ height: "3rem" }}></Box> : null}
      {!currentUser && !currentSeller ? <AccessDialog /> : null}
      {currentSeller ? <SellerTable /> : null}
      {currentUser || (!currentUser && !currentSeller) ? (
        <SearchProducts />
      ) : null}
      {currentUser || (!currentUser && !currentSeller) ? <Products /> : null}
      {currentUser || (!currentUser && !currentSeller) ? (
        <ProductsElectronic />
      ) : null}
      {currentUser || (!currentUser && !currentSeller) ? (
        <ProductsGrocery />
      ) : null}
      {currentUser || (!currentUser && !currentSeller) ? (
        <ProductsPersonal />
      ) : null}
      {currentUser || (!currentUser && !currentSeller) ? (
        <ProductsHealth />
      ) : null}
      {currentUser || (!currentUser && !currentSeller) ? (
        <ProductsOffice />
      ) : null}
      {currentUser || (!currentUser && !currentSeller) ? (
        <ProductsOthers />
      ) : null}
      <Backtotop />
      <Footer />
    </Box>
  );
};
export default HomePage;

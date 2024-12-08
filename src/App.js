import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainSignup from "./Pages/SignUp/MainSignup.js";
import MainSignin from "./Pages/SignIn/MainSignin.js";
import HomePage from "./Pages/HomeLayouts/HomePage.js";
import UserProfile from "./Pages/UserFiles/UserProfile.js";
import UserProfileEdit from "./Pages/UserFiles/UserProfileEdit.js";
import SellerProfileEdit from "./Pages/SellerFiles/SellerProfileEdit.js";
import SellerProfile from "./Pages/SellerFiles/SellerProfile.js";
import ProductDetails from "./Pages/ProductsFiles/ProductDetails.js";
import { useSelector } from "react-redux";
import Add from "./Pages/ProductsModify/Add.js";
import Edit from "./Pages/ProductsModify/Edit.js";
import SellerLocation from "./Pages/SellerFiles/SellerLocation.js";
import SellerDetails from "./Pages/SellerFiles/SellerDetails.js";
import Contact from "./Pages/HomeLayouts/Contact.js";
import About from "./Pages/HomeLayouts/About.js";
import Loading from "./Pages/Loading.js";
import ProductsCategoryPage from "./Pages/ProductCategories/ProductsCategoryPage.js";
import PageNotFound from "./Pages/PageNotFound/PageNotFound.js";
import Cookies from "js-cookie";
import UnAuthorized from "./Pages/PageNotFound/UnAuthorized.js";
import InvalidPage from "./Pages/PageNotFound/InvalidPage.js";

const App = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentSeller } = useSelector((state) => state.seller);
  const [loading, setLoading] = useState(true);
  const login = Cookies.get("login");
  const sellerLogin = Cookies.get("sellerLogin");

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(delay);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route exact path="/contact" element={<Contact />}></Route>
        <Route exact path="/about" element={<About />}></Route>
        <Route
          exact
          path="/electronics"
          element={<ProductsCategoryPage productsCategory="Electronics" />}
        ></Route>
        <Route
          exact
          path="/groceryandfood"
          element={<ProductsCategoryPage productsCategory="Grocery and Food" />}
        ></Route>
        <Route
          exact
          path="/healthandwellness"
          element={
            <ProductsCategoryPage productsCategory="Health and Wellness" />
          }
        ></Route>
        <Route
          exact
          path="/beautyandpersonalcare"
          element={
            <ProductsCategoryPage productsCategory="Beauty and Personal Care" />
          }
        ></Route>
        <Route
          exact
          path="/officeandstationery"
          element={
            <ProductsCategoryPage productsCategory="Office and Stationery" />
          }
        ></Route>
        <Route
          exact
          path="/others"
          element={<ProductsCategoryPage productsCategory="Others" />}
        ></Route>
        <Route
          exact
          path="/signup"
          element={login || sellerLogin ? <PageNotFound /> : <MainSignup />}
        ></Route>
        <Route
          exact
          path="/signin"
          element={login || sellerLogin ? <PageNotFound /> : <MainSignin />}
        ></Route>
        <Route
          exact
          path="/userprofile"
          element={login ? <UserProfile /> : <UnAuthorized />}
        ></Route>
        <Route
          exact
          path="/userprofile/edit"
          element={login ? <UserProfileEdit /> : <UnAuthorized />}
        ></Route>
        <Route
          exact
          path="/sellerprofile"
          element={sellerLogin ? <SellerProfile /> : <UnAuthorized />}
        ></Route>
        <Route
          exact
          path="/product/:productid"
          element={<ProductDetails />}
        ></Route>
        <Route
          exact
          path="/sellerprofile/edit"
          element={sellerLogin ? <SellerProfileEdit /> : <UnAuthorized />}
        ></Route>
        <Route
          exact
          path="/product/add"
          element={sellerLogin ? <Add /> : <UnAuthorized />}
        ></Route>
        <Route exact path="*" element={<InvalidPage />}></Route>
        <Route
          exact
          path="/product/edit/:productid"
          element={sellerLogin ? <Edit /> : <UnAuthorized />}
        ></Route>
        <Route
          exact
          path="/seller/location/:sellerid"
          element={login || sellerLogin ? <SellerLocation /> : <UnAuthorized />}
        ></Route>
        <Route
          exact
          path="/seller/details/:sellerid"
          element={login || sellerLogin ? <SellerDetails /> : <UnAuthorized />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

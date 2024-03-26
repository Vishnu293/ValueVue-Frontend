import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Card, Dialog, DialogActions } from "@mui/material";
import Swal from "sweetalert2";
import Loading from "../Loading";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const SellerTable = ({}) => {
  const navigate = useNavigate();
  const { currentSeller } = useSelector((state) => state.seller);
  const sellerId = currentSeller?.data?._id;
  const [productsList, setProductsList] = useState([]);
  const API = `http://localhost:8080/product/seller/${sellerId}`;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const editProductDetails = async (productId) => {
    if (productId && productId?.rowData?.length > 0) {
      navigate(`/product/edit/${productId.rowData[0]}`);
    } else {
      console.error("Invalid productId:", productId);
    }
  };

  const viewProductDetails = async (productId) => {
    try {
      navigate(`/product/${productId.rowData[0]}`);
    } catch (error) {
      console.error("Error navigating to product details:", error);
    }
  };

  const deleteProductDetails = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `want to delete, ${productId.rowData[1]}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmDelete(productId);
      }
    });
  };

  const handleCloseDialogs = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = (productId) => {
    axios
      .delete(`http://localhost:8080/product/delete/${productId.rowData[0]}`)
      .then((res) => {
        Swal.fire({
          title: "Delete Successful!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        getProducts(API);
      })
      .catch((err) => {
        Swal.fire({
          title: "Delete Failed!",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      });
  };

  const columns = [
    {
      accessorKey: "_id",
      name: "_id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      accessorKey: "_id",
      name: "productName",
      label: "Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      accessorKey: "_id",
      name: "productPrice",
      label: "Price",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      accessorKey: "_id",
      name: "productCategory",
      label: "Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      accessorKey: "_id",
      name: "productDesc",
      label: "Description",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          const maxLength = 20;
          const truncatedDesc = value.split(" ").slice(0, maxLength).join(" ");
          const showFullDesc = () => alert(value);

          return (
            <div title={value}>
              {truncatedDesc}{" "}
              {value.split(" ").length > maxLength && (
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={showFullDesc}
                >
                  ...
                </span>
              )}
            </div>
          );
        },
      },
    },
    {
      accessorKey: "_id",
      name: "actions",
      label: "Actions",
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => {
          return (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <Button
                  onClick={() => viewProductDetails(tableMeta)}
                  variant="contained"
                  color="secondary"
                  sx={{
                    minWidth: "0px",
                    width: "10px",
                    height: "30px",
                  }}
                >
                  <VisibilityIcon />
                </Button>
                <Button
                  onClick={() => editProductDetails(tableMeta)}
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: "0px",
                    width: "10px",
                    height: "30px",
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  onClick={() => deleteProductDetails(tableMeta)}
                  variant="contained"
                  color="error"
                  sx={{
                    minWidth: "0px",
                    width: "10px",
                    height: "30px",
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </>
          );
        },
      },
    },
  ];

  const getProducts = async (url) => {
    await axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        let dataArr = res.data.map((obj, index) => ({ ...obj, id: index + 1 }));
        setProductsList(dataArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("Fetching products...");
    if (sellerId) {
      getProducts(API);
    }
  }, [API, sellerId]);

  if (!productsList) {
    return <Loading />;
  }

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              backgroundColor: "gold",
            },
          },
        },
      },
    });

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <Box>
        <Card
          sx={{ backgroundColor: "white", padding: "20px", margin: "15px", marginTop: "1.2rem" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: "25px" }}>Your Products:</h1>
            <Button
              variant="contained"
              sx={{
                textAlign: "centre",
                marginLeft: "auto",
                fontWeight: "600",
                "&:hover": { color: "gold" },
              }}
              onClick={() => navigate("product/add")}
            >
              Add Product
            </Button>
          </div>
          <Card sx={{ marginTop: "15px" }}>
            <MUIDataTable
              data={productsList.filter(
                (product) => product.sellerId._id === sellerId
              )}
              columns={columns}
              options={{
                selectableRows: "none",
                viewColumns: false,
                filter: false,
              }}
            />
          </Card>
        </Card>
        <div>
          <div>
            <Dialog open={openDeleteDialog} onClose={() => {}}>
              <DialogActions>
                <Button
                  onClick={handleCloseDialogs}
                  color="primary"
                  sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  color="primary"
                  variant="contained"
                  sx={{ fontWeight: "600", "&:hover": { color: "gold" } }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default SellerTable;

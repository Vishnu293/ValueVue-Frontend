import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, Card, Dialog, DialogActions, DialogTitle, FormControlLabel } from "@mui/material";
import Swal from "sweetalert2";
import Loading from "../Loading";
import Delete from "../ProductsModify/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MUIDataTable from "mui-datatables";

const SellerTable = ({}) => {
  const navigate = useNavigate();
  const { currentSeller } = useSelector((state) => state.seller);
  const sellerId = currentSeller?.data?._id;
  const [productsList, setProductsList] = useState([]);
  const API = `http://localhost:8080/product/seller/${sellerId}`;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const editProductDetails = async (productId) => {
    if (productId && productId?.rowData?.length>0) {
      navigate(`/product/edit/${productId.rowData[0]}`);
    } else {
      console.error("Invalid productId:", productId);
    }
  };

  const toggleOpenDialog = () =>{
    setOpenDeleteDialog(!openDeleteDialog)
  }

  const viewProductDetails = async (productId) => {
    try {
      navigate(`/product/${productId.rowData[0]}`);
    } catch (error) {
      console.error("Error navigating to product details:", error);
    }
  };

  const deleteProductDetails = (productDetails) => {
    // setSelectedProduct(productDetails);
    // toggleOpenDialog();
    Swal.fire({
      title: "Update Failed!",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  const handleCloseDialogs = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    // axios
    //   .delete(`http://localhost:8080/product/delete/${selectedProduct._id}`)
    //   .then((res) => {
    //     Swal.fire({
    //       title: "Update Successful!",
    //       icon: "success",
    //       confirmButtonText: "OK",
    //     });
    //     getProducts(API);
    //   })
    //   .catch((err) => {
    //     Swal.fire({
    //       title: "Update Failed!",
    //       icon: "error",
    //       confirmButtonText: "OK",
    //     });
    //   });
    // setOpenDeleteDialog(false);
  };

  const columns = [
    {
      name: "_id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "productName",
      label: "Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "productPrice",
      label: "Price",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "productCategory",
      label: "Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "productDesc",
      label: "Description",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "Action Button",
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
  // const columns = useMemo(() => [
  //   {
  //     accessorKey: "_id",
  //     header: "ID",
  //     size: 250,
  //   },
  //   {
  //     accessorKey: "productName",
  //     header: "Name",
  //     size: 250,
  //   },
  //   {
  //     accessorKey: "productPrice",
  //     header: "Price",
  //     size: 150,
  //   },
  //   {
  //     accessorKey: "productCategory",
  //     header: "Category",
  //     size: 250,
  //   },
  //   {
  //     accessorKey: "productDesc",
  //     header: "Description",
  //     size: 400,
  //   },
  //   {
  //     header: "Actions",
  //     size: 298,
  //     Cell: ({ renderedCellValue, row }) => (
  //       <Box
  //       sx={{
  //         display: "flex",
  //         gap: 1,
  //         justifyContent: "start",
  //         alignItems: "start",
  //       }}
  //     >
  //       <Button
  //         onClick={() => viewProductDetails(row.original)}
  //         variant="contained"
  //         color="secondary"
  //         sx={{
  //           minWidth: "0px",
  //           width: "10px",
  //           height: "30px",
  //         }}
  //       >
  //         <VisibilityIcon />
  //       </Button>
  //       <Button
  //         onClick={() => editProductDetails(row.original)}
  //         variant="contained"
  //         color="primary"
  //         sx={{
  //           minWidth: "0px",
  //           width: "10px",
  //           height: "30px",
  //         }}
  //       >
  //         <EditIcon />
  //       </Button>
  //       <Button
  //         onClick={() => deleteProductDetails(row.original)}
  //         variant="contained"
  //         color="error"
  //         sx={{
  //           minWidth: "0px",
  //           width: "10px",
  //           height: "30px",
  //         }}
  //       >
  //         <DeleteIcon />
  //       </Button>
  //     </Box>
  //     ),
  //   },
  // ]);

  const table = useMaterialReactTable({
    columns,
    data: productsList.filter((product) => product.sellerId._id === sellerId),
    // enableRowActions: true,
    // positionActionsColumn: "last",
    enableFullScreenToggle: false,
    enableColumnResizing: true,
    initialState: { pagination: { pageSize: 10 } },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "2vh",
        fontWeight: "300",
      },
    },
    muiTableHeadCellProps: {
      sx: (theme) => ({
        backgroundColor: "gold",
      }),
    },
  });

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

  return (
    <Box>
      <Card sx={{ backgroundColor: "white", padding: "20px", margin: "15px" }}>
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
          {/* <MaterialReactTable 
            columns={columns}
            data={productsList.filter(product => product.sellerId._id === sellerId)}
            enableFullScreenToggle={false}
            enableColumnResizing
            enableHiding={false}
            enableColumnActions={false}
            enableSorting={false}
            initialState={{
              density: 'compact',
            }}
            muiTableBodyCellProps={{
              sx: { fontSize: "2vh",
              fontWeight: "300" },
            }}
            muiTableHeadCellProps={{
              sx: { backgroundColor: 'gold' },
            }}
           /> */}
          <MUIDataTable
            data={productsList.filter(
              (product) => product.sellerId._id === sellerId
            )}
            columns={columns}
            options={{
              selectableRows: "none",
            }}
          />
        </Card>
      </Card>
      <div>
        {/* Delete Confirmation Dialog */}
        {/* <Delete
          open={openDeleteDialog}
          selectedProduct={selectedProduct}
          handleCloseDialogs={handleCloseDialogs}
          handleConfirmDelete={handleConfirmDelete}
        /> */}
        <div>
        <Dialog open={openDeleteDialog} onClose={()=> {}}>
            {/* <DialogTitle>{`Delete ${selectedProduct}?`}</DialogTitle> */}
            <DialogActions>
            <Button onClick={handleCloseDialogs} color="primary" sx={{ fontWeight: "600", "&:hover": {color: "gold"} }}>
                Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" variant="contained" sx={{fontWeight: "600", "&:hover": {color: "gold"}}}>
                Delete
            </Button>
            </DialogActions>
      </Dialog>
    </div>
      </div>
    </Box>
  );
};

export default SellerTable;

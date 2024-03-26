import { createTheme } from "@mui/material/styles";

// Light theme
export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d6",
      dark: "#2f60b2",
    },
    secondary: {
      main: "#ffd700",
      dark: "#b59410",
    },
    type: "light",
  },
  typography: {
    fontFamily: "Arial, Helvetica, Raleway",
    fontSize: "15px",
    fontWeightRegular: 400,
    fontWeightBold: 700,
  },
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#115293",
    },
    secondary: {
      main: "#ffd700",
      dark: "#ffab00",
    },
    type: "dark",
  },
  typography: {
    fontFamily: "Arial, Helvetica, Raleway",
    fontSize: "15px",
    fontWeightRegular: 400,
    fontWeightBold: 600,
  },
});

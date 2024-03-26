import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "../MyTheme";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Backtotop = () => {
  function scrollToTop(smooth = false) {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      document.documentElement.scrollTop = 0;
    }
  }

  const ScrollToTop = ({
    top = 20,
    className = "",
    color = "black",
    smooth = false,
    component = "",
    viewBox = "0 0 256 256",
    svgPath = "M222.138,91.475l-89.6-89.6c-2.5-2.5-6.551-2.5-9.051,0l-89.6,89.6c-2.5,2.5-2.5,6.551,0,9.051s6.744,2.5,9.244,0L122,21.85  V249.6c0,3.535,2.466,6.4,6,6.4s6-2.865,6-6.4V21.85l78.881,78.676c1.25,1.25,2.992,1.875,4.629,1.875s3.326-0.625,4.576-1.875  C224.586,98.025,224.638,93.975,222.138,91.475z",
    width = "28",
    height = "28",
    ...props
  }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const onScroll = () => {
        setVisible(document.documentElement.scrollTop >= top);
      };
      onScroll();
      document.addEventListener("scroll", onScroll);
      return () => document.removeEventListener("scroll", onScroll);
    }, [top]);

    return (
      <>
        <ThemeProvider theme={lightTheme}>
          {visible && (
            <div
              className={`scroll-to-top ${className}`}
              onClick={() => scrollToTop(smooth)}
              {...props}
            >
              {component || (
                <Fab
                  color="primary"
                  aria-label="totop"
                  disableRipple
                  sx={{
                    position: "fixed",
                    bottom: "40px",
                    right: "40px",
                    zIndex: "2",
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                    "&: hover": {
                      backgroundColor: (theme) => theme.palette.primary.dark,
                      color: (theme) => theme.palette.secondary.main,
                    },
                  }}
                >
                  <KeyboardArrowUpIcon
                    sx={{
                      fontSize: "30px",
                    }}
                  />
                </Fab>
              )}
            </div>
          )}
        </ThemeProvider>
      </>
    );
  };
  const isSmoothScrollSupported =
    "scrollBehavior" in document.documentElement.style;

  return <ScrollToTop smooth={isSmoothScrollSupported} />;
};
export default Backtotop;

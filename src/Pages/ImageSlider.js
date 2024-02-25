import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const customArrowStyle = {
  fontSize: "50px",
  borderRadius: "50%",
  color: "black",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,
  cursor: "pointer",
};

const CustomPrevArrow = React.memo((props) => (
  <ArrowBackIosNew
    style={{
      ...props.style,
      left: "10px",
      ...customArrowStyle,
    }}
    onClick={props.onClick}
  />
));

const CustomNextArrow = React.memo((props) => (
  <ArrowForwardIos
    style={{
      ...props.style,
      right: "10px",
      ...customArrowStyle,
    }}
    onClick={props.onClick}
  />
));

const ImageSlider = ({ images }) => {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "30px",
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    initialSlide: 0,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            style={{
              width: "90%",
              objectFit: "contain",
            }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;

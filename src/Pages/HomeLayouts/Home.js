import React from "react";

const Home = () => {
  return (
    <div
      className="homecont"
      id="Home"
      style={{
        width: "fit-content",
        margin: "1rem",
      }}
    >
      <div
        className="head1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "0.5rem",
        }}
      >
        <h1 style={{fontSize: "x-large"}}>Products You May Like</h1>
        <a
          style={{
            cursor: "pointer",
            position: "relative",
            top: "3px",
          }}
        >
          See More&gt;
        </a>
      </div>
    </div>
  );
};

export default Home;

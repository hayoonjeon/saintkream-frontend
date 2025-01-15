import React from "react";

const CustomOverlay = ({ closeOverlay }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "auto",
        padding: "10px 15px",
        border: "0px solid #888",
        borderRadius: "8px",
        backgroundColor: "white",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
        fontSize: "13px",
        textAlign: "center",
        transform: "translateY(-65px)",
      }}
    >
      <div>판매자 기본 거래 위치</div>
      <div
        style={{
          position: "absolute",
          top: "1px",
          right: "1px",
          cursor: "pointer",
          fontSize: "8px",
          color: "black",
          fontWeight: "bold",
        }}
        onClick={closeOverlay}
      >
        ✖
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0",
          height: "0",
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "10px solid white",
        }}
      />
    </div>
  );
};

export default CustomOverlay;
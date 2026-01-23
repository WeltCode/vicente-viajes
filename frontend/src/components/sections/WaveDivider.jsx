import React from "react";

const WaveDivider = ({
  position = "bottom",
  variant = "wave",
  className = "",
  fillColor = "#e3f2f1",
}) => {
  const isTop = position === "top";

  const waves = {
    wave: (
      <path
        d="M0 120L48 108C96 96 192 72 288 66C384 60 480 72 576 84C672 96 768 108 864 102C960 96 1056 72 1152 60C1248 48 1344 48 1392 48L1440 48L1440 200L0 200Z"
        fill={fillColor}
      />
    ),
    curve: (
      <path
        d="M0 120C240 30 480 0 720 0C960 0 1200 30 1440 120L1440 200L0 200Z"
        fill={fillColor}
      />
    ),
    tilt: (
      <path
        d="M0 0L1440 120L1440 200L0 200Z"
        fill={fillColor}
      />
    ),
  };

  return (
    <div
      className={`absolute ${
        isTop ? "top-0 rotate-180" : "bottom-0"
      } left-0 right-0 overflow-hidden leading-[0] ${className}`}
      style={{ height: "150px", marginBottom: "-2px" }}
    >
      <svg
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        {waves[variant]}
      </svg>
    </div>
  );
};

export default WaveDivider;

// components/Avatar.js
import React from "react";

export default function Avatar({ src, alt = "Avatar", size = 40 }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: size, height: size, borderRadius: "50%" }}
      loading="lazy"
    />
  );
}

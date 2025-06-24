// components/Button.js
import React from "react";

export default function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

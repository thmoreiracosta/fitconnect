// components/Badge.js
import React from "react";

export default function Badge({ children }) {
  return (
    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
      {children}
    </span>
  );
}

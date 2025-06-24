// components/Textarea.js
import React from "react";

export default function Textarea({ label, id, value, onChange, placeholder = "", className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1 font-medium">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

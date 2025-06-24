import React from "react";

/**
 * Componente Select genérico.
 * 
 * Props:
 * - options: array de objetos { value, label }
 * - value: valor selecionado
 * - onChange: função chamada ao selecionar (evento padrão onChange do select)
 * - ...props: qualquer outra prop é passada para o <select>
 */
export default function Select({ options = [], value, onChange, ...props }) {
  return (
    <select value={value} onChange={onChange} {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
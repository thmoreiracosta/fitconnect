import React from "react";

// Wrapper do Avatar
export function Avatar({ className = "", children, ...props }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full w-16 h-16 bg-gray-100 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

// Imagem do Avatar (renderiza fallback se falhar)
export function AvatarImage({ src, alt = "Avatar", fallback, ...props }) {
  const [imgError, setImgError] = React.useState(false);

  if (!src || imgError) {
    return fallback || null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="object-cover w-full h-full"
      onError={() => setImgError(true)}
      {...props}
    />
  );
}

// Fallback do Avatar (ex: iniciais do usuário ou ícone)
export function AvatarFallback({ children, ...props }) {
  return (
    <span
      className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600 font-bold text-xl"
      {...props}
    >
      {children}
    </span>
  );
}
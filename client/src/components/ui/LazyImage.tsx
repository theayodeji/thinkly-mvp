import React, { useState } from "react";
import clsx from "clsx";

type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string; // optional blurred preview
  fallback?: string; // optional error fallback
};

export function LazyImage({
  src,
  alt,
  className,
  placeholder,
  fallback,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg bg-bg-muted",
        className
      )}
    >
      {/* Placeholder */}
      {placeholder && !loaded && !error && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain blur-lg scale-105"
        />
      )}

      {/* Main image */}
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={clsx(
            "w-full h-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      ) : (
        // Fallback on error
        <div className="flex items-center justify-center w-full h-full text-text-muted text-sm">
          {fallback ? (
            <img
              src={fallback}
              alt="Fallback"
              className="w-1/2 h-auto opacity-70"
            />
          ) : (
            "Image not available"
          )}
        </div>
      )}
    </div>
  );
}

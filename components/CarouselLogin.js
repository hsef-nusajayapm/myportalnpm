"use client";
import React from "react";

export default function CarouselLogin() {
  const images = ["/img/img1.jpg", "/img/img2.jpg", "/img/img3.jpg"];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000); // 4 detik slide otomatis
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full min-h-[470px] overflow-hidden">
      {/* wrapper yang digeser */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`slide-${i}`}
            className="w-full flex-shrink-0 object-cover h-full"
          />
        ))}
      </div>

      {/* optional: indikator bulatan */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-gray-400/50"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

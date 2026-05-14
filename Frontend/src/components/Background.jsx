import React from "react";
import imgg1 from "../assets/imgg1.jpg";
import imgg2 from "../assets/imgg2.jpg";
import imgg3 from "../assets/imgg3.jpg";
import imgg4 from "../assets/imgg4.jpg";

function Background({ heroCount }) {
    const images = [imgg3, imgg2, imgg4, imgg1];

    return (
        <div className="w-full h-full relative overflow-hidden bg-white">
            {/* All images stacked with fade transition */}
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Hero ${index + 1}`}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        heroCount === index ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}
            
            {/* Subtle overlay for better text readability on images if text overflows, though Hero covers text mostly */}
            <div className='absolute inset-0 bg-gradient-to-l from-transparent to-white/30 pointer-events-none'></div>
        </div>
    );
}

export default Background;

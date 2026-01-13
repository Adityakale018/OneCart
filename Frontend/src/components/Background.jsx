import React from "react";
import imgg1 from "../assets/imgg1.jpg";
import imgg2 from "../assets/imgg2.jpg";
import imgg3 from "../assets/imgg3.jpg";
import imgg4 from "../assets/imgg4.jpg";

function Background({ heroCount }) {
    const images = [imgg3, imgg2, imgg4, imgg1];

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-900">
            {/* All images stacked with fade transition */}
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Hero ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        heroCount === index ?  'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}
            
            {/* Optional: Purple gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-600/10 pointer-events-none'></div>
            
            {/* Optional: Bottom fade gradient */}
            <div className='absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none'></div>
        </div>
    );
}

export default Background;

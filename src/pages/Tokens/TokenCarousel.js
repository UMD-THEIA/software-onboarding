import React, { useRef } from "react";
import Token from "./Token";
import "./token.css";
import '../../App.css'


const TokenCarousel = ({ tokens }) => {
    const carouselRef = useRef(null);
  
    const handleWheelScroll = (event) => {
      event.preventDefault();
      if (carouselRef.current) {
        carouselRef.current.scrollBy({
          left: event.deltaY * 1.5, // Adjusts scroll speed
          behavior: "smooth",
        });
      }
    };
  
    return (
      <div className="token-carousel-container">
        <div className="token-carousel" ref={carouselRef} onWheel={handleWheelScroll}>
          {tokens.map((token, index) => (
            <Token
              key={index}
              image={token.image}
              title={token.title}
              date={token.date}
              summary={token.summary}
              url={token.url}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default TokenCarousel;
  
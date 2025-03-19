import React, { useRef } from "react";
import Token from "./Token";
import "./carousel.css";
import '../../App.css';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TokenCarousel = ({ tokens }) => {
  const carouselRef = useRef(null);

  const scrollAmount = 320; // Adjust based on token width + gap

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="token-carousel-wrapper">
      <button className="carousel-arrow left" onClick={scrollLeft}>
        <FaChevronLeft />
      </button>
      <div className="token-carousel-container">
        <div className="token-carousel" ref={carouselRef}>
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
      <button className="carousel-arrow right" onClick={scrollRight}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default TokenCarousel;

import React, { useRef, useState, useEffect } from "react";
import Token from "./Token";
import MiniToken from "./MiniToken";
import "./carousel.css";
import "../../App.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TokenCarousel = ({ tokens, useMiniToken = false }) => {
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollAmount = 320; // Adjust based on token width + gap

  useEffect(() => {
    const carousel = carouselRef.current;
    const checkScrollPosition = () => {
      if (carousel) {
        const { scrollLeft, scrollWidth, clientWidth } = carousel;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
      }
    };

    checkScrollPosition();
    carousel?.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      carousel?.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

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
      {showLeftArrow && (
        <button className="carousel-arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
      )}
      <div className="token-carousel-container">
        <div className="token-carousel" ref={carouselRef}>
          {tokens.map((token, index) => (
            useMiniToken ? (
              <MiniToken key={index} title={token.title} date={token.date} url={token.url} />
            ) : (
              <Token key={index} image={token.image} title={token.title} date={token.date} summary={token.summary} url={token.url} />
            )
          ))}
        </div>
      </div>
      {showRightArrow && (
        <button className="carousel-arrow right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default TokenCarousel;

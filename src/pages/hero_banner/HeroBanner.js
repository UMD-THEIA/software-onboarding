import React from "react";
import "./HeroBanner.css";
import "../../App.css";

const HeroBanner = ({ title, subtitle }) => {

  const gridpath = process.env.PUBLIC_URL + "/images/grid-pattern.png";

  return (
    <section className="hero-banner">
      <div className="hero-banner__background">
        <img
          src={gridpath}
          alt="Background Pattern"
          className="hero-banner__image"
        />
      </div>

      <div className="hero-banner__content">
        <h1 className="hero-banner__title">{title}</h1>
        <p className="hero-banner__subtitle">{subtitle}</p>
      </div>
    </section>
  );
};

export default HeroBanner;
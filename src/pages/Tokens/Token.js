import React from "react";
import { useNavigate } from "react-router-dom";
import './token.css'
import '../../App.css'


const Token = ({ image, title, date, summary, url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener noreferrer"); // Open external links in a new tab
    } else {
      navigate(url); // Navigate internally
    }
  };

  return (
    <div className="token" onClick={handleClick}>
      <div className="token-image-container">
        <img src={process.env.PUBLIC_URL + image} alt={title} className="token-image" />
      </div>
      <div className="token-content">
        <div className="token-info">
          <p className="token-date">{date}</p>
          <p className="token-title">{title}</p>
          <p className="token-summary">{summary}</p>
        </div>
      </div>
    </div>
  );
};


export default Token;
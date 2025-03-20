import React from "react";
import { useNavigate } from "react-router-dom";
import "./token.css";
import "../../App.css";

const MiniToken = ({ title, date, url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener noreferrer");
    } else {
      navigate(url);
    }
  };

  return (
    <div className="article-token" onClick={handleClick}>
      <div className="article-token-content">
        <p className="article-token-title">{title}</p>
        <p className="article-token-date">{date}</p>
      </div>
    </div>
  );
};

export default MiniToken;

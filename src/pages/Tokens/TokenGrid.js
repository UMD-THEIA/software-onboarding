import React from "react";
import Token from "./Token";
import "./grid.css";
import "../../App.css";

const TokenGrid = ({ tokens }) => {
  return (
    <div className="token-grid-container">
      <div className="token-grid-wrapper">
        <div className="token-grid">
          {tokens.map((token, index) => (
            <div key={index} className="token-grid-item">
              <Token
                image={token.image}
                title={token.title}
                date={token.date}
                summary={token.summary}
                url={token.url}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenGrid;

import React, { useRef, useState, useLayoutEffect } from "react";
import TaskToken from "./TaskToken.js";
import './TaskCarousel.css'
import '../../App.css'


const TaskCarousel = ({ name, tokens }) => {
  const tokenRef = useRef(null);
  const [bottomPad, setBottomPad] = useState(0);

  useLayoutEffect(() => {
    if (tokenRef.current) {
      setBottomPad(tokenRef.current.offsetHeight);
    }
  }, []);
  return (
    <div className="task-token-carousel-wrapper">
      <div className="task-token-carousel-container">
        <h1>{name}</h1>
        <div className="task-token-carousel" style={{ paddingBottom: bottomPad }}>
          {tokens.map((token, index) => (
            <div key={index} className="task-token-item" ref={index === 0 ? tokenRef : null}>
              <TaskToken title={token.title} date={token.date} summary={token.summary} details={token.details} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCarousel;

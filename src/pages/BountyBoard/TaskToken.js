import React, { useState } from "react";
import "../../App.css";
import "./TaskToken.css";

const Token = ({ title, date, summary, details }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button type="button" className="task-token" onClick={(e) => { e.stopPropagation(); setOpen(true); }} aria-haspopup="dialog" aria-expanded={open} >
                <div className="task-token-content">
                    <div className="task-token-info">
                        <p className="task-token-title">{title}</p>
                        <p className="task-token-date">{date}</p>
                        <p className="task-token-summary">{summary}</p>
                    </div>
                </div>
            </button>

            {open && (
                <div className="modal-overlay" onMouseDown={() => setOpen(false)} role="presentation" >
                    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => e.stopPropagation()}>
                        <div className="modal-button-close">
                            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close popup">
                                x
                            </button>
                        </div>
                        <div className="modal-header">
                            <h2 id="modal-title">{title}</h2>
                        </div>
                        <div className="modal-body">
                            <p>{date}</p>
                            <p>{summary}</p>
                            <hr />
                            <div className="token-details">
                                {typeof details === "string" ? <p>{details}</p> : details}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Token;

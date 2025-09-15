import './tutorial.css'
import { IoMdAlert } from "react-icons/io";

export default function TutorialNote({ children }) {
  return (
    <div className="admonition">
      <p className="admonition-title"><IoMdAlert style={{ color: "white", fontSize: "1.5em", verticalAlign: "middle" }} /> <strong>Note</strong></p>
      <p className="admonition-last">{children}</p>
    </div>
  );
}

import '../../App.css'
import './codebase.css'
import CodeBlock from "../../CodeBlock.js"
import { Link } from "react-router-dom"



export default function DockerKubos() {


  function CustomLink({ to, children, ...props }) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <div className="leftText">
        <h1><a href="github.com/UMD-THEIA/kubos-builder" target="_blank" rel="noreferrer">kubos-builder</a></h1>
        <h3 className="lastUpdate">Last updated September 3rd, 2025</h3>

      </div>
    </>
  );
}
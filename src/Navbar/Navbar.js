import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { FaGithub } from "react-icons/fa";
import './navbar.css'
import '../App.css'

export default function Navbar() {
  const imagePath = process.env.PUBLIC_URL + "/images/SATDEV-LOGO-EXPORT 1.png";


  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <img src={imagePath} className="patch" alt="" /> THEIA Software
      </Link>
      <ul>
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/setup">Setup</CustomLink>
        <CustomLink to="/tutorials">Tutorials</CustomLink>
        <CustomLink to="/codebase">Codebase</CustomLink>
        <CustomLink to="/bountyboard">Tasks</CustomLink>
        <CustomLink to="/github">Github</CustomLink>
        <div className="header-tabs"><a href="https://github.com/UMD-THEIA" rel="noreferrer" target="_blank"><FaGithub size={25} className="ul-icon" /></a></div>
      </ul>
    </nav>
  )
}

export function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <div className="header-tabs">
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    </div>
  )
}
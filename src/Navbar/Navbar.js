import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './navbar.css'
import '../App.css'

export default function Navbar() {
  const imagePath = process.env.PUBLIC_URL + "/images/SATDEV-LOGO-EXPORT 1.png";


  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <img src={imagePath} class="patch" alt=""/> THEIA Software
      </Link>
      <ul>
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/setup">Setup</CustomLink>
        <CustomLink to="/rust">Rust</CustomLink>
        <CustomLink to="/docker">Docker</CustomLink>
        <CustomLink to="/github">Github</CustomLink>

      </ul>
    </nav>
  )
}

export function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}
import '../../App.css'
import { Outlet } from "react-router-dom";
import TokenCarousel from '../Tokens/TokenCarousel';


const tokens = [
  {
    title: "First Mission App",
    date: "September 10, 2025",
    url: "/tutorials/first-mission-app"
  },
  {
    title: "App Register",
    date: "September 11, 2025",
    url: "/tutorials/app-register"
  },
];

export default function Tutorials() {

  return (
    <div>
      <h1>Homepage for Tutorials</h1>
      <TokenCarousel tokens={tokens} useMiniToken={true} />
      <Outlet /> {/* This will render nested routes */}
    </div>
  );    
  }
import '../App.css'
import { Outlet } from "react-router-dom";
import TokenCarousel from './Tokens/TokenCarousel';


const tokens = [
  {
    title: "docker-kubos",
    date: "March 20, 2025",
    url: "/codebase/docker-kubos"
  },
  {
    title: "flight-software",
    date: "March 20, 2025",
    url: "/codebase/flight-software"
  },
  {
    title: "hardware-simulators",
    date: "March 20, 2025",
    url: "/codebase/hardware-simulators"
  },
  {
    title: "kubos-builder",
    date: "March 20, 2025",
    url: "/codebase/kubos-builder"
  },
  {
    title: "flightsoftware/libs",
    date: "March 20, 2025",
    url: "/codebase/libs"
  },
];

export default function Codebase() {

  return (
    <div>
      <h1>Homepage for Exploring Codebase</h1>
      <TokenCarousel tokens={tokens} useMiniToken={true} />
      <Outlet /> {/* This will render nested routes */}
    </div>
  );    
  }
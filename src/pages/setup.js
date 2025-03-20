import '../App.css'
import { Outlet } from "react-router-dom";

export default function Setup() {

  return (
    <div>
      <h1>How to set up your Development Environment</h1>
      <Outlet />
    </div>
  );    
  }
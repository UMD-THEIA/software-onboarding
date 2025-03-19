import '../App.css'
import { Outlet } from "react-router-dom";

export default function Setup() {

  return (
    <div>
      <h1>Homepage for Setting up Development Environment</h1>
      <Outlet /> {/* This will render nested routes */}
    </div>
  );    
  }
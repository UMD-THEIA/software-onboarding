import '../App.css'
import { Outlet } from "react-router-dom";

export default function Codebase() {

  return (
    <div>
      <h1>Homepage for Exploring Codebase</h1>
      <Outlet /> {/* This will render nested routes */}
    </div>
  );    
  }
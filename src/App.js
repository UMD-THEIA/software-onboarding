import { Route, Routes, HashRouter } from "react-router-dom"
import ScrollToTop from "./ScrollToTop";

import './App.css';
import Navbar from './Navbar/Navbar.js'

import Home from "./pages/home.js"
import Rust from "./pages/rust.js"
import Docker from "./pages/docker.js"
import Github from "./pages/github.js"
import Setup from "./pages/setup.js"
import Kubos from "./pages/kubos.js"
import LinuxTutorial from "./pages/linux.js"
import Codebase from "./pages/codebase.js"

import SetupHome from "./pages/setup_pages/home.js"
import Arch from "./pages/setup_pages/arch.js"
import Mac from "./pages/setup_pages/mac.js"
import Nixos from "./pages/setup_pages/nixos.js"
import Ubuntu from "./pages/setup_pages/ubuntu.js"
import Windows from "./pages/setup_pages/windows.js"

import CodebaseHome from "./pages/codebase_pages/home.js";
import DockerKubos from "./pages/codebase_pages/docker-kubos.js";
import FlightSoftware from "./pages/codebase_pages/flight-software.js";
import HardwareSimulators from "./pages/codebase_pages/hardware-simulators.js";
import KubosBuilder from "./pages/codebase_pages/kubos-builder.js";
import CodebaseLibs from "./pages/codebase_pages/libs.js";
import BountyBoard from "./pages/BountyBoard/BountyBoard.js";


function App() {

  return (
    <HashRouter>
      <ScrollToTop />

      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="setup" element={<Setup />}>
            <Route index element={<SetupHome />} />
            <Route path="arch" element={<Arch />} />
            <Route path="mac" element={<Mac />} />
            <Route path="nixos" element={<Nixos />} />
            <Route path="ubuntu" element={<Ubuntu />} />
            <Route path="windows" element={<Windows />} />
          </Route>
          <Route path="rust" element={<Rust />} />
          <Route path="docker" element={<Docker />} />
          <Route path="github" element={<Github />} />
          <Route path="codebase" element={<Codebase />}>
            <Route index="" element={<CodebaseHome />} />
            <Route path="docker-kubos" element={<DockerKubos />} />
            <Route path="flight-software" element={<FlightSoftware />} />
            <Route path="hardware-simulators" element={<HardwareSimulators />} />
            <Route path="kubos-builder" element={<KubosBuilder />} />
            <Route path="libs" element={<CodebaseLibs />} />
          </Route>
          <Route path="kubos" element={<Kubos />} />
          <Route path="linuxtutorial" element={<LinuxTutorial />} />
          <Route path="bountyboard" element={<BountyBoard /> } />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
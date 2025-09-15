import '../../App.css'
import CodeBlock from "../../CodeBlock.js"
import { Link } from "react-router-dom"
import './tutorial.css'
import TutorialNote from './TutorialNote.js'



export default function FirstMissionAppTutorial() {

  return (
    <>
      <div className="leftText">
        <h1><a href="https://kubos-preservation-group.github.io/kubos/tutorials/first-mission-app.html" target="_blank" rel="noreferrer">Creating Your First Mission Application</a></h1>
        <h3 className="lastUpdate">Last updated September 10th, 2025</h3>
        <TutorialNote>
          <p> In general, I will rewrite most of the "Creating Your First Mission Application" tutorial here but mark it up with comments where I feel it is necessary.</p>
        </TutorialNote>


        <p className="tutorial-text">Mission applications are user-created programs which are used to control satellite behavior and execute mission logic.</p>
        <p className="tutorial-text">These applications are registered with the <a href="https://kubos-preservation-group.github.io/kubos/ecosystem/services/app-service.html">applications service</a>, which is responsible for tracking versioning and controlling application upgrades and rollbacks.</p>
        <p className="tutorial-text">This tutorial guides the user through the process of creating a basic mission application using Python3.</p>
        <p className="tutorial-text">At the end of the tutorial, the user will have a mission application which is capable of querying the monitor service for current system memory usage and then storing that data into the telemetry database.</p>
        <p className="tutorial-text">You will go through this tutorial entirely within your development environemnt in the kubos container.</p>

        <h2 className='tutorial-text'>Setup</h2>
        <TutorialNote>
          <p>I am assuming that if you are here, you have already set up the kubos container by following the "<a href="../#/tutorials/docker-setup">Running docker-kubos</a>" tutorial.</p>
        </TutorialNote>
        <ul className='tutorial-text'>
          <li>Make sure you have the docker kubos container set up and running</li>
          <li>The container already has the KubOS source repo at: <code>/home/kubos/.kubos/kubos/</code></li>
          <li>During startup, the container has already automatically started up the <code>monitor-service</code> and <code>telemetry-service</code></li>
          <li>Now, before you start creating the mission application, you will want to open up <code>docker-kubos</code> in an ide like vscode.</li>
          <li>Then create a new branch in flight-software. I recommend something like "yourname-onboarding" (<code>git branch yourname-onboarding</code>). You will be writing your mission app in <code>flight-software</code> and then running it inside the container.</li>
        </ul>
      </div>
    </>
  );
}
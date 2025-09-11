import '../../App.css'
import TaskCarousel from "./TaskCarousel.js"
import "./BountyBoard.css";



const easyTasks = [
  // {
  //   title: "Simple Task",
  //   date: "Due: 9/5/2025",
  //   summary: "Brief description of task!",
  //   details: "More info goes here..."
  // },
  {
    title: "First Mission App",
    date: "Due: N/A",
    summary: "You will be creating a mission application for the KubOS simulator we use!",
    details: (
      <>
        Mission applications are user-created programs which are used to control satellite
        behavior and execute mission logic. This tutorial guides the user through the process
        of creating a basic mission application using Python3. Afterward, you will be rewriting
        it in <a href="#/rust" data-discover="true">Rust</a> by yourself. For more information
        about this assignment, visit its <a href="#/tutorials/first-mission-app" data-discover="true">dedicated page</a>!
      </>
    ),
  },
  {
    title: "Registering a Mission Application",
    date: "Due: N/A",
    summary: "Practice registering a Mission Application on our KubOS Simulator!",
    details: (
      <>
        The Kubos applications service is responsible for monitoring and managing all mission applications for a system.
        For more information about this assignment, visit its <a href="#/tutorials/app-register" data-discover="true">dedicated page</a>!
      </>
    ),
  },


];

const mediumTasks = [
  // {
  //   title: "Medium Task",
  //   date: "Due: 12/14/2033",
  //   summary: "Brief description of task!",
  //   details: "More info goes here..."
  // },
  {
    title: "Create Groundstation GUI",
    date: "Due: TBD",
    summary: "Brief description of task!",
    details: "More info goes here..."
  },
  {
    title: "Implement Packet Protocol",
    date: "Due: TBD",
    summary: "Brief description of task!",
    details: "More info goes here..."
  },
  {
    title: "Create Groundstation Database",
    date: "Due: TBD",
    summary: "Brief description of task!",
    details: "More info goes here..."
  },
  {
    title: "OBC Communication with UHF Radio Module",
    date: "Due: TBD",
    summary: "Brief description of task!",
    details: "More info goes here..."
  },
];

const hardTasks = [
  // {
  //   title: "Crazy Task",
  //   date: "13/9/2025",
  //   summary: "Brief description of task!",
  //   details: "More info goes here..."
  // },
];


export default function BountyBoard() {
  return (
    <div className="bounty-board-wrapper">
      <div className="bounty-col">
        <TaskCarousel name={"Easy Tasks"} tokens={easyTasks} />
      </div>
      <div className="bounty-col">
        <TaskCarousel name={"Medium Tasks"} tokens={mediumTasks} />
      </div>
      <div className="bounty-col">
        <TaskCarousel name={"Advanced Tasks"} tokens={hardTasks} />
      </div>
    </div>
  );
}
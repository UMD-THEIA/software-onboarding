import '../../App.css'
import TaskCarousel from "./TaskCarousel.js"
import "./BountyBoard.css";

const easyTasks = [
  {
    title: "Simple Task",
    date: "Due: 9/5/2025",
    summary: "Brief description of task!",
    details: "More info goes here..."
  },

];

const mediumTasks = [
  {
    title: "Medium Task",
    date: "Due: 12/14/2033",
    summary: "Brief description of task!",
    details: "More info goes here..."
  },
];

const hardTasks = [
  {
    title: "Crazy Task",
    date: "13/9/2025",
    summary: "Brief description of task!",
    details: "More info goes here..."
  },
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
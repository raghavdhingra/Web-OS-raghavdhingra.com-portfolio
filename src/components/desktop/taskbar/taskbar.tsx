import TaskList from "./taskList";
import Date from "./date";
import RightTaskPane from "./RightTaskPane";
import "../../../assets/desktop/taskbar.css";

const Taskbar = () => {
  return (
    <div className="taskbar-container">
      <TaskList />
      <Date />
      <RightTaskPane />
    </div>
  );
};
export default Taskbar;

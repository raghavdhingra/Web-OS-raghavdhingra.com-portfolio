import { useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import DropDownCaret from "../../../assets/icons/dropdown.svg";
import { removeActivity } from "@/features/activity/activityActions";
import { activityDropDownToggle } from "@/features/desktop/desktopActions";
import DialogBox from "../dialogBox/dialogBox";
import type { RootState } from "@/store/store";
import "../../../assets/desktop/taskList.css";

const TaskList = ({
  removeActivity,
  activityList,
  activityDropDown,
  activityDropDownToggle,
}: ConnectedProps<typeof connector>) => {
  const [activityName, setActivityName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const showDialog = (name: string, isOpen: boolean) => {
    setActivityName(name);
    setDialogOpen(isOpen);
  };
  const isLoading = activityList.some((activity) => activity?.isLoading);
  const toggleActivity = () => {
    const activityIndex = activityList.findIndex(
      (activity) => activity && activity.name === activityName
    );
    removeActivity(activityIndex);
    setDialogOpen(false);
  };

  return (
    <>
      <DialogBox
        onSuccess={toggleActivity}
        onCancel={() => showDialog("", false)}
        isOpen={dialogOpen}
        successText={"End Task"}
        heading={activityName}
        body={"Are you sure, you want to end the task?"}
      />
      <div className="task-list-container">
        <div className="heading centralise">Tasks</div>
        <div
          className={`task-listing-activity cursor-pointer ${
            activityDropDown ? "task-listing-activity-active" : ""
          }`}
          onClick={() => activityDropDownToggle(!activityDropDown)}
        >
          {isLoading && (
            <div className="centralise">
              <svg height="16px" width="16px" className="loader-rotate">
                <circle className="loader-sm-2" />
              </svg>
            </div>
          )}
          <div className="activity-list-nav-grid">
            <div className="centralise">
              <span className="task-label-full">Activity List</span>
              <span className="task-label-short">Apps</span>
            </div>
            <div className="centralise">
              <div className="down-caret-arrow-translate">▾</div>
            </div>
          </div>
        </div>
        {activityDropDown && (
          <>
            <div className="drop-down-container activity-list-container">
              <div className="drop-drop-caret-pointed-container flex-end">
                <div></div>
                <img
                  src={DropDownCaret}
                  className="drop-drop-caret-pointed"
                  width="13px"
                  alt="drop down"
                />
              </div>
              <div className="drop-down-inner-container activity-inner-container">
                {activityList.length ? (
                  activityList.map(
                    (activity, index) =>
                      activity && (
                        <div
                          className="drop-down-items"
                          key={`activity-${index}`}
                        >
                          <div className="task-list-inner-grid">
                            {activity.isLoading ? (
                              <svg
                                height="20px"
                                width="20px"
                                className="loader-rotate"
                              >
                                <circle className="loader-sm" />
                              </svg>
                            ) : (
                              <span></span>
                            )}
                            <div className="centralise">{activity.name}</div>
                            <div
                              className="centralise activity-close-btn"
                              onClick={() => showDialog(activity.name, true)}
                            >
                              &times;
                            </div>
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <div className="drop-down-items">No Activity</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  activityList: state.activityReducers.activity,
  activityDropDown: state.desktopReducers.activityDropDown,
});

const connector = connect(mapStateToProps, {
  removeActivity,
  activityDropDownToggle,
});
export default connector(TaskList);

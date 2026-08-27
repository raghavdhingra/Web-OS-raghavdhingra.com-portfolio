import { useCallback, useEffect, useRef } from "react";
import { connect, type ConnectedProps } from "react-redux";
import {
  removeActivity,
  toggleActivityMaximise,
  updatePositionActivity,
  updateZIndexActivity,
} from "@/features/activity/activityActions";
import {
  ActivityBody,
  ActivityFooter,
} from "../../../features/activity/ActivityContent";
import fileImage from "../../../assets/icons/file.svg";
import { assetUrl } from "../../../utils/assetUrl";
import type { ActivityWindowState } from "@/types/models";
import "../../../assets/desktop/explorer.css";

interface ExplorerOwnProps {
  activity: ActivityWindowState;
  explorerIndex: number;
}

const Explorer = ({
  activity,
  updateZIndexActivity,
  explorerIndex,
  removeActivity,
  toggleActivityMaximise,
  updatePositionActivity,
}: ExplorerOwnProps & ConnectedProps<typeof connector>) => {
  const explorerRef = useRef<HTMLDivElement>(null);
  const elementToDrag = useRef<HTMLDivElement>(null);

  const updateZIndex = () =>
    updateZIndexActivity({ activityIndex: explorerIndex });
  const closeActivity = () => removeActivity(explorerIndex);

  const dragElement = useCallback(() => {
    try {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      const dragTarget = explorerRef.current ?? elementToDrag.current;
      if (dragTarget) {
        dragTarget.addEventListener("mousedown", (e) => dragMouseDown(e));
      }
      function dragMouseDown(e: MouseEvent) {
        try {
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        } catch {
          return null;
        }
      }
      function elementDrag(e: MouseEvent) {
        try {
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          if (!elementToDrag.current) return;
          const elementHeight = elementToDrag.current.offsetHeight;
          const elementWidth = elementToDrag.current.offsetWidth;
          const elementTopOffset = elementToDrag.current.offsetTop;
          const elementLeftOffset = elementToDrag.current.offsetLeft;
          let topVal = elementTopOffset - pos2;
          let leftVal = elementLeftOffset - pos1;

          if (topVal < 34) topVal = 34;
          if (leftVal < 60) leftVal = 60;

          const windowHeight = window.innerHeight;
          const windowWidth = window.innerWidth;

          if (topVal + elementHeight > windowHeight)
            topVal = windowHeight - elementHeight;

          if (leftVal + elementWidth > windowWidth)
            leftVal = windowWidth - elementWidth;
          updatePositionActivity({
            top: `${topVal}px`,
            left: `${leftVal}px`,
            activityIndex: explorerIndex,
          });
        } catch {
          return null;
        }
      }
      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    } catch {
      return null;
    }
  }, [updatePositionActivity, explorerIndex]);
  const toggleMaximise = () =>
    toggleActivityMaximise({
      activityIndex: explorerIndex,
      isMaximise: !activity.isMaximise,
    });

  useEffect(() => {
    if (!activity.isMaximise) dragElement();
  }, [dragElement, activity]);
  return (
    <div
      className="explorer-container"
      style={{
        top: activity.isMaximise ? "34px" : activity.top,
        left: activity.isMaximise ? "60px" : activity.left,
        height: activity.isMaximise ? "calc(100vh - 35px)" : activity.height,
        width: activity.isMaximise ? "calc(100vw - 62px)" : activity.width,
        zIndex: activity.zIndex,
      }}
      ref={elementToDrag}
      onMouseDown={updateZIndex}
    >
      <div className="explorer-header">
        <div
          className="explorer-header-heading"
          onDoubleClick={toggleMaximise}
          ref={explorerRef}
        >
          <div className="explorer-heading-name-icon-container">
            <div className="centralise">
              <img
                src={assetUrl(
                  activity && activity.image ? activity.image : fileImage
                )}
                height="15px"
                width="15px"
                alt="explorer heading"
              />
            </div>
            <div className="centralise">
              <span>{activity && activity.name}</span>
            </div>
          </div>
        </div>
        <div className="explorer-header-btn-container">
          <div className="explorer-close-btn">-</div>
          <div className="explorer-close-btn" onClick={toggleMaximise}>
            <svg height="18px" width="18px">
              <rect
                x="6px"
                y="6px"
                height="6px"
                width="6px"
                fill="#0000"
                strokeWidth="1.5px"
                stroke="#fff"
              ></rect>
            </svg>
          </div>
          <div
            className="explorer-close-btn explorer-close-color"
            onClick={closeActivity}
          >
            <div className="explorer-close-icon-translate">&times;</div>
          </div>
        </div>
      </div>
      <div className="explorer-body">
        {activity && <ActivityBody activity={activity} />}
      </div>
      {activity?.footerType ? (
        <div className="explorer-footer">
          <ActivityFooter activity={activity} />
        </div>
      ) : null}
    </div>
  );
};

const connector = connect(null, {
  updateZIndexActivity,
  removeActivity,
  toggleActivityMaximise,
  updatePositionActivity,
});
export default connector(Explorer);

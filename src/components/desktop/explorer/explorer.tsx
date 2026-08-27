import { useEffect, useRef } from "react";
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

  const toggleMaximise = () =>
    toggleActivityMaximise({
      activityIndex: explorerIndex,
      isMaximise: !activity.isMaximise,
    });

  useEffect(() => {
    if (activity.isMaximise) return;

    const dragTarget = explorerRef.current;
    const windowEl = elementToDrag.current;
    if (!dragTarget || !windowEl) return;

    let lastX = 0;
    let lastY = 0;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const nextTop = windowEl.offsetTop - (lastY - e.clientY);
      const nextLeft = windowEl.offsetLeft - (lastX - e.clientX);
      lastX = e.clientX;
      lastY = e.clientY;

      const topVal = Math.min(
        window.innerHeight - windowEl.offsetHeight,
        Math.max(34, nextTop)
      );
      const leftVal = Math.min(
        window.innerWidth - windowEl.offsetWidth,
        Math.max(60, nextLeft)
      );

      updatePositionActivity({
        top: `${topVal}px`,
        left: `${leftVal}px`,
        activityIndex: explorerIndex,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      lastX = e.clientX;
      lastY = e.clientY;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    dragTarget.addEventListener("mousedown", onMouseDown);
    return () => {
      dragTarget.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [activity.isMaximise, explorerIndex, updatePositionActivity]);

  return (
    <div
      className={`explorer-container${activity.isMaximise ? " is-maximised" : ""}`}
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
      <header
        className="explorer-header"
        ref={explorerRef}
        onDoubleClick={toggleMaximise}
      >
        <div
          className="explorer-header-controls"
          onMouseDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="explorer-window-btn explorer-window-btn-close"
            aria-label="Close"
            title="Close"
            onClick={closeActivity}
          >
            <span className="explorer-window-glyph" aria-hidden>
              &times;
            </span>
          </button>
          <button
            type="button"
            className="explorer-window-btn explorer-window-btn-min"
            aria-label="Minimize"
            title="Minimize"
            onClick={activity.isMaximise ? toggleMaximise : undefined}
          >
            <span className="explorer-window-glyph explorer-min-bar" aria-hidden />
          </button>
          <button
            type="button"
            className="explorer-window-btn explorer-window-btn-max"
            aria-label={activity.isMaximise ? "Restore" : "Maximize"}
            title={activity.isMaximise ? "Restore" : "Maximize"}
            onClick={toggleMaximise}
          >
            <span
              className={`explorer-window-glyph explorer-max-icon${
                activity.isMaximise ? " is-restore" : ""
              }`}
              aria-hidden
            />
          </button>
        </div>
        <div className="explorer-header-heading">
          {activity.isLoading ? (
            <span className="explorer-header-loader" aria-hidden />
          ) : (
            <img
              src={assetUrl(activity.image || fileImage)}
              height={16}
              width={16}
              alt=""
            />
          )}
          <span className="explorer-header-title" title={activity.name}>
            {activity.name}
          </span>
        </div>
      </header>
      <div className="explorer-body">
        {activity && <ActivityBody activity={activity} />}
      </div>
      {activity.footerType ? (
        <footer className="explorer-footer">
          <ActivityFooter activity={activity} />
        </footer>
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

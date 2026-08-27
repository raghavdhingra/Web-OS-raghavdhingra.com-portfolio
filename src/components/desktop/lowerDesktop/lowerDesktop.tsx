import { useCallback } from "react";
import { connect, type ConnectedProps } from "react-redux";
import {
  dropDownToggle,
  activityDropDownToggle,
  changeStartMenu,
} from "@/features/desktop/desktopActions";
import { createActivity } from "@/features/activity/activityActions";
import NavItem from "./navItem";
import DesktopWorkingArea from "../desktopWorkingArea/desktopWorkingArea";
import { applications } from "@/data/apps";
import { assetUrl } from "@/utils/assetUrl";
import StartMenu from "../startMenu/startMenu";
import type { RootState } from "@/store/store";
import "../../../assets/desktop/lowerDesktop.css";

const LowerDesktop = ({
  activityDropDown,
  dropDownOpen,
  dropDownToggle,
  activityDropDownToggle,
  createActivity,
  isStartMenuOpen,
  changeStartMenu,
  activityList,
}: ConnectedProps<typeof connector>) => {
  const closeDropDown = () => {
    if (dropDownOpen || activityDropDown) {
      dropDownToggle(false);
      activityDropDownToggle(false);
    }
  };
  const hightlightApp = useCallback(
    (name: string) => {
      let isShown = false;
      activityList.forEach((act) => {
        if (act.name === name) isShown = true;
      });
      return isShown;
    },
    [activityList]
  );

  return (
    <div className="lower-desktop-grid" onClick={closeDropDown}>
      <div className="left-navigation-bar">
        <div>
          {applications.defaultApps.map((app, index) => (
            <NavItem
              key={`nav-list-${index}`}
              clickTask={() => {
                changeStartMenu(false);
                createActivity({ name: app.key });
              }}
              hightlight={hightlightApp(app.name)}
            >
              <img
                src={assetUrl(app.image)}
                className="nav-item-image"
                width={app.width}
                alt={app.name}
              />
            </NavItem>
          ))}
        </div>
        <div>
          <NavItem hightlight={isStartMenuOpen}>
            <svg
              height="50px"
              width="50px"
              className="start-icon-container"
              onClick={() => changeStartMenu(!isStartMenuOpen)}
            >
              <circle cx="25px" cy="25px" className="start-icon-svg" />
            </svg>
          </NavItem>
        </div>
      </div>
      {isStartMenuOpen ? <StartMenu /> : <DesktopWorkingArea />}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  dropDownOpen: state.desktopReducers.dropDownOpen,
  activityDropDown: state.desktopReducers.activityDropDown,
  isStartMenuOpen: state.desktopReducers.isStartMenuOpen,
  activityList: state.activityReducers.activity,
});

const connector = connect(mapStateToProps, {
  dropDownToggle,
  createActivity,
  activityDropDownToggle,
  changeStartMenu,
});
export default connector(LowerDesktop);

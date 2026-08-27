import { useEffect, useMemo, useRef, useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { applications } from "@/data/apps";
import { createActivity } from "@/features/activity/activityActions";
import SEARCH_ICON from "@/assets/icons/search.svg";
import { assetUrl } from "@/utils/assetUrl";
import StartItem from "./startItem";
import { changeStartMenu } from "@/features/desktop/desktopActions";
import type { AppDefinition } from "@/types/models";
import "../../../assets/desktop/startMenu.css";

type StartSection = "application" | "social";

const StartMenu = ({
  createActivity,
  changeStartMenu,
}: ConnectedProps<typeof connector>) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchString, setSearchString] = useState("");
  const [startSection, setStartSection] = useState<StartSection>("application");

  const focusOnField = () => {
    searchRef.current?.focus();
  };

  const applicationArray = useMemo(() => {
    const filterApps = (apps: AppDefinition[]) => {
      if (!searchString) return [...apps];
      const searchRegexKey = new RegExp(searchString.trim(), "ig");
      return apps.map((app) => (searchRegexKey.test(app.key) ? app : null));
    };

    if (startSection === "application") {
      return filterApps(applications.allApplications);
    }

    if (startSection === "social") {
      return filterApps(applications.socialApps);
    }

    return [];
  }, [searchString, startSection]);

  useEffect(() => {
    focusOnField();
  }, []);
  const startItemClick = (app: AppDefinition) => {
    if (startSection === "application") {
      createActivity({ name: app.key });
      changeStartMenu(false);
    } else if (startSection === "social" && app.link) {
      window.open(app.link);
    } else {
      return null;
    }
  };
  return (
    <div className="start-menu-container">
      <div className="container-center">
        <div className="start-menu-container-grid">
          <div className="search-field-container">
            <div className="search-field-grid">
              <div className="centralise search-bar-icon-container">
                <img
                  src={SEARCH_ICON}
                  alt="search"
                  width="15px"
                  onClick={focusOnField}
                  className="search-bar-icon"
                />
              </div>
              <input
                type="text"
                className="search-field"
                placeholder="Type to search"
                ref={searchRef}
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="start-application-container">
              {applicationArray && applicationArray.length ? (
                applicationArray.map(
                  (app, index) =>
                    app && (
                      <StartItem
                        key={`nav-list-${index}`}
                        clickTask={() => startItemClick(app)}
                      >
                        <img
                          src={assetUrl(app.image)}
                          className="nav-item-image"
                          width={app.bigWidth}
                          alt={app.name}
                        />
                        <div>{app.name}</div>
                      </StartItem>
                    )
                )
              ) : (
                <div>No Application Found</div>
              )}
            </div>
          </div>
          <div className="start-menu-footer-grid">
            <div
              className={`start-menu-footer-item ${
                startSection === "application"
                  ? "start-menu-footer-item-active"
                  : ""
              }`}
              onClick={() => setStartSection("application")}
            >
              Applications
            </div>
            <div
              className={`start-menu-footer-item
            ${startSection === "social" ? "start-menu-footer-item-active" : ""}
            `}
              onClick={() => setStartSection("social")}
            >
              Social
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const connector = connect(mapStateToProps, { createActivity, changeStartMenu });
export default connector(StartMenu);

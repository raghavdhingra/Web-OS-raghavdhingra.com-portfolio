import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { connect, type ConnectedProps } from "react-redux";
import DesktopIcon from "./desktopIcon";
import ContextMenu from "./ContextMenu";
import Explorer from "../explorer/explorer";
import { createActivity } from "@/features/activity/activityActions";
import {
  resetToDefault,
  changeStartMenu,
  toggleFullScreen,
} from "@/features/desktop/desktopActions";
import DialogBox from "../dialogBox/dialogBox";
import {
  makeDirectoryAction,
  makeFileAction,
} from "@/features/fileSystem/fileSystemActions";
import { resolveEntryIcon, openFileSystemEntry } from "@/features/fileSystem/openEntry";
import type { RootState } from "@/store/store";
import type { FileSystemEntry } from "@/types/models";
import "../../../assets/desktop/desktopWorkingArea.css";

interface NewDirState {
  open: boolean;
  isFolder: boolean;
  name: string;
}

interface ContextPosition {
  top: number;
  left: number;
}

const DesktopWorkingArea = ({
  activityList,
  fileSystems,
  createActivity,
  resetToDefault,
  makeFileAction,
  makeDirectoryAction,
  isFullScreen,
  toggleFullScreen,
  isStartMenuOpen,
  changeStartMenu,
}: ConnectedProps<typeof connector>) => {
  const desktopWorkingRef = useRef<HTMLDivElement>(null);
  const [newDir, setNewDir] = useState<NewDirState>({
    open: false,
    isFolder: false,
    name: "",
  });
  const [contextShown, setContextShown] = useState(false);
  const [resetSettingsOpen, setResetSettingsOpen] = useState(false);
  const [contextPosition, setContextPosition] = useState<ContextPosition>({
    top: 0,
    left: 0,
  });
  const [workingAreaHeight, setWorkingAreaHeight] = useState(0);
  useEffect(() => {
    if (desktopWorkingRef.current)
      setWorkingAreaHeight(desktopWorkingRef.current.clientHeight);
  }, []);
  const contextMenuHeight = 238;

  const contextArray = [
    { name: "Menu", onClick: () => changeStartMenu(!isStartMenuOpen) },
    { name: "Terminal", onClick: () => createActivity({ name: "terminal" }) },
    {
      name: "New File",
      onClick: () => setNewDir({ open: true, isFolder: false, name: "" }),
    },
    {
      name: "New Folder",
      onClick: () => setNewDir({ open: true, isFolder: true, name: "" }),
    },
    {
      name: "Customise Display",
      onClick: () => createActivity({ name: "settings" }),
    },
    {
      name: isFullScreen ? "Exit Full Screen" : "Enter Full Screen",
      onClick: () => toggleFullScreen(),
    },
    { name: "Reset Settings", onClick: () => setResetSettingsOpen(true) },
  ];

  const resetSuccess = () => {
    setResetSettingsOpen(false);
    resetToDefault();
  };
  const startTask = (system: FileSystemEntry) => {
    if (system.type === "file") {
      openFileSystemEntry(system, createActivity);
    } else {
      console.log("Open File Explorer");
    }
  };
  useEffect(() => {
    const node = desktopWorkingRef.current;
    if (!node) return;
    const handleContextMenu = (e: MouseEvent) => {
      try {
        e.preventDefault();
        setContextShown(false);
        setTimeout(() => {
          setContextShown(true);
          let posX = e.clientX;
          let posY = e.clientY;
          const winWidth = window.innerWidth;
          const winHeight = window.innerHeight;
          if (winWidth - 235 < posX) posX = winWidth - 235;
          if (winHeight - (contextMenuHeight + 5) < posY)
            posY = winHeight - (contextMenuHeight + 5);
          setContextPosition({ top: posY, left: posX });
        }, 50);
      } catch {
        return null;
      }
    };
    node.addEventListener("contextmenu", handleContextMenu);
    return () => node.removeEventListener("contextmenu", handleContextMenu);
  }, []);
  const makeNewDir = () => {
    if (newDir.name) {
      if (newDir.isFolder)
        makeDirectoryAction({
          pathArray: ["desktop"],
          folderName: newDir.name,
        });
      else
        makeFileAction({
          pathArray: ["desktop"],
          fileName: newDir.name,
        });
      setNewDir({ ...newDir, name: "", open: false, isFolder: false });
    } else alert("Please Enter a name");
  };
  const renderDesktopIcons = useCallback(
    ({ allIcons }: { allIcons: FileSystemEntry[] }) => {
      const desktopIconHTML: ReactNode[] = [];
      const outerIconsArray: FileSystemEntry[][] = [];
      if (workingAreaHeight) {
        const desktopEntry = allIcons[0];
        if (!desktopEntry || !Array.isArray(desktopEntry.child)) {
          return <></>;
        }
        const desktopIcons = [...desktopEntry.child];
        const numberOfIcons = parseInt(String((workingAreaHeight - 30) / 90)) - 1;
        if (desktopIcons.length > numberOfIcons) {
          const initialSplitIndex = 0;
          const numOfSplits = Math.ceil(desktopIcons.length / numberOfIcons);
          for (let i = 1; i <= numOfSplits; i++) {
            const arr = desktopIcons.splice(
              initialSplitIndex,
              initialSplitIndex + numberOfIcons
            );
            outerIconsArray.push(arr);
          }
        } else outerIconsArray.push(desktopIcons);
        outerIconsArray.forEach((desktopIcon, ind) => {
          desktopIconHTML.push(
            <div key={`outer-icons-${ind}`}>
              {desktopIcon.map(
                (system, index) =>
                  system && (
                    <DesktopIcon
                      key={`desktop-icon-${index}`}
                      icon={resolveEntryIcon(system)}
                      name={system.name}
                      width={"60px"}
                      clickTask={() => startTask(system)}
                    />
                  )
              )}
            </div>
          );
        });
      }
      return <>{desktopIconHTML}</>;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workingAreaHeight]
  );
  return (
    <div className="desktop-area-container" ref={desktopWorkingRef}>
      <DialogBox
        onSuccess={resetSuccess}
        onCancel={() => setResetSettingsOpen(false)}
        isOpen={resetSettingsOpen}
        successText={"Reset"}
        heading={"Reset Settings"}
        body={"Sure! You want to reset to your default settings?"}
      />
      <DialogBox
        onSuccess={makeNewDir}
        onCancel={() =>
          setNewDir({ open: false, isFolder: false, name: "" })
        }
        isOpen={newDir.open}
        successText={"Save"}
        heading={`New ${newDir.isFolder ? "Folder" : "File"}`}
        body={
          <input
            type="text"
            className="new-file-folder-input"
            placeholder={`${newDir.isFolder ? "Folder" : "File"} Name`}
            onChange={(e) => setNewDir({ ...newDir, name: e.target.value })}
          />
        }
      />
      <ContextMenu
        isOpen={contextShown}
        close={() => setContextShown(false)}
        top={contextPosition.top}
        left={contextPosition.left}
        contextArray={contextArray}
        height={contextMenuHeight}
      />
      {activityList.map(
        (activity, index) =>
          activity && (
            <Explorer
              explorerIndex={index}
              activity={activity}
              key={`explorer-${index}`}
            />
          )
      )}
      {fileSystems &&
        fileSystems.fileSystem &&
        fileSystems.fileSystem.length &&
        renderDesktopIcons({
          allIcons: fileSystems.fileSystem,
        })}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activityList: state.activityReducers.activity,
  isFullScreen: state.desktopReducers.isFullScreen,
  isStartMenuOpen: state.desktopReducers.isStartMenuOpen,
  fileSystems: state.fileSystemReducers,
});

const connector = connect(mapStateToProps, {
  createActivity,
  makeDirectoryAction,
  resetToDefault,
  toggleFullScreen,
  makeFileAction,
  changeStartMenu,
});
export default connector(DesktopWorkingArea);

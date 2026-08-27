import { useEffect, useMemo } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { changeBackImage, changeFontStyle } from "@/features/desktop/desktopActions";
import { previousStateSet } from "@/features/fileSystem/fileSystemActions";
import { WALLPAPERS } from "@/data/wallpapers";
import { assetUrl } from "@/utils/assetUrl";
import type { RootState } from "@/store/store";
import Taskbar from "./taskbar/taskbar";
import PowerOff from "./powerOff/powerOff";
import LowerDesktop from "./lowerDesktop/lowerDesktop";
import "../../assets/desktop/desktop.css";

interface FontStyleItem {
  name: string;
  className: string;
}

interface HTMLElementWithFullscreen extends HTMLElement {
  msRequestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
}

interface DocumentWithFullscreen extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

const requestFullscreen = async (el: HTMLElementWithFullscreen) => {
  if (typeof el.requestFullscreen === "function") {
    await document.body.requestFullscreen();
    return;
  }
  const vendorRequest =
    el.msRequestFullscreen ??
    el.webkitRequestFullscreen ??
    el.mozRequestFullScreen;
  if (vendorRequest) await vendorRequest.call(el);
};

const exitFullscreen = async (doc: DocumentWithFullscreen) => {
  if (typeof doc.exitFullscreen === "function") {
    await doc.exitFullscreen();
    return;
  }
  const vendorExit = doc.webkitExitFullscreen ?? doc.msExitFullscreen;
  if (vendorExit) await vendorExit.call(doc);
};

const Desktop = ({
  brightness,
  background,
  fontStyle,
  previousStateSet,
  isFullScreen,
}: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    previousStateSet();
  }, [previousStateSet]);

  const activeWallpaper = WALLPAPERS[background - 1];

  const fontStyleArray = useMemo<FontStyleItem[]>(
    () => [
      { name: "Roboto", className: "font-roboto" },
      { name: "Potta One", className: "font-potta" },
      { name: "Raleway", className: "font-raleway" },
      { name: "Lobster", className: "font-lobster" },
      { name: "Times", className: "font-times" },
      { name: "Courier", className: "font-courier" },
    ],
    []
  );

  useEffect(() => {
    const fullScrrenToggle = async () => {
      try {
        const bodyE = document.documentElement as HTMLElementWithFullscreen;
        const doc = document as DocumentWithFullscreen;
        if (isFullScreen) {
          await requestFullscreen(bodyE);
        } else {
          await exitFullscreen(doc);
        }
      } catch {
        return null;
      }
    };
    fullScrrenToggle();
  }, [isFullScreen]);

  return (
    <>
      <div
        className={`desktop-container ${
          activeWallpaper.cover ? "image-cover" : ""
        } ${fontStyleArray[fontStyle - 1].className}`}
        style={{
          backgroundImage: `url(${assetUrl(activeWallpaper.img)})`,
          filter: `brightness(${brightness})`,
        }}
      >
        <div className="desktop-taskbar-grid">
          <Taskbar />
          <LowerDesktop />
        </div>
      </div>
      <PowerOff backImage={activeWallpaper} />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  background: state.desktopReducers.background,
  brightness: state.desktopReducers.brightness,
  fontStyle: state.desktopReducers.fontStyle,
  isFullScreen: state.desktopReducers.isFullScreen,
});

const connector = connect(mapStateToProps, {
  changeBackImage,
  changeFontStyle,
  previousStateSet,
});
export default connector(Desktop);

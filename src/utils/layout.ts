export const TASKBAR_HEIGHT = 36;
export const DOCK_WIDTH = 60;
export const DOCK_HEIGHT = 56;
export const MOBILE_BREAKPOINT = 768;

export function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT;
}

export function getChromeInsets() {
  const mobile = isMobileViewport();
  return {
    mobile,
    taskbar: TASKBAR_HEIGHT,
    dockWidth: mobile ? 0 : DOCK_WIDTH,
    dockHeight: mobile ? DOCK_HEIGHT : 0,
  };
}

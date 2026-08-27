import type { AppDispatch } from "@/store/store";
import {
  changeBackImage as changeBackImageAction,
  changeBrightness as changeBrightnessAction,
  changeFontStyle as changeFontStyleAction,
  changeSingleClickIcon as changeSingleClickIconAction,
  resetToDefault as resetToDefaultAction,
  setBatteryStatus,
  setDateStatus,
  setNetworkType,
  setOnlineStatus,
  setPowerOffStatus,
  toggleActivityDropDown,
  toggleDropDown,
  toggleFullScreen,
  toggleStartMenu,
} from "@/features/desktop/desktopSlice";

export const changeBackImage = (payload: number) => (dispatch: AppDispatch) => {
  dispatch(changeBackImageAction(payload));
};

export const changeStartMenu = (payload: boolean) => (dispatch: AppDispatch) => {
  dispatch(toggleStartMenu(payload));
};

export const changeSingleClickIcon =
  (payload: boolean) => (dispatch: AppDispatch) => {
    dispatch(changeSingleClickIconAction(payload));
  };

export const changeFontStyle = (payload: number) => (dispatch: AppDispatch) => {
  dispatch(changeFontStyleAction(payload));
};

export const toggleFullScreenAction = () => (dispatch: AppDispatch) => {
  dispatch(toggleFullScreen());
};

export { toggleFullScreenAction as toggleFullScreen };

export const resetToDefault = () => (dispatch: AppDispatch) => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
  dispatch(resetToDefaultAction());
};

export const changeBrightness = (payload: number) => (dispatch: AppDispatch) => {
  dispatch(changeBrightnessAction(payload));
};

export const dropDownToggle = (payload: boolean) => (dispatch: AppDispatch) => {
  dispatch(toggleDropDown(payload));
};

export const activityDropDownToggle =
  (payload: boolean) => (dispatch: AppDispatch) => {
    dispatch(toggleActivityDropDown(payload));
  };

export const batteryStatus =
  (payload: { level: number; charging: boolean }) =>
  (dispatch: AppDispatch) => {
    dispatch(setBatteryStatus(payload));
  };

export const onlineStatus = (payload: boolean) => (dispatch: AppDispatch) => {
  dispatch(setOnlineStatus(payload));
};

export const networkType = (payload: string) => (dispatch: AppDispatch) => {
  dispatch(setNetworkType(payload));
};

export const dateStatus =
  (payload: string | Date) => (dispatch: AppDispatch) => {
    dispatch(
      setDateStatus(
        typeof payload === "string" ? payload : payload.toISOString()
      )
    );
  };

export const powerOffStatus =
  (payload: { active: boolean; timer: number }) => (dispatch: AppDispatch) => {
    dispatch(setPowerOffStatus(payload));
  };

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { persistState, loadState } from "@/utils/localStorage";
import type { DesktopState } from "@/types/models";

const STORAGE_KEY = "desktop";

const initialState: DesktopState = {
  background: 3,
  fontStyle: 1,
  brightness: 1,
  dropDownOpen: false,
  singleClickIcon: true,
  isFullScreen: false,
  isStartMenuOpen: false,
  battery: {
    level: 0,
    charging: false,
  },
  isOnline: true,
  networkType: "4g",
  date: new Date().toISOString(),
  activityDropDown: false,
  powerOff: {
    active: false,
    timer: 0,
  },
};

const desktopSlice = createSlice({
  name: "desktopReducers",
  initialState,
  reducers: {
    toggleDropDown: (state, { payload }: PayloadAction<boolean>) => {
      state.dropDownOpen = payload;
    },
    toggleStartMenu: (state, { payload }: PayloadAction<boolean>) => {
      state.isStartMenuOpen = payload;
    },
    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },
    hydrateFromStorage: (_state) => {
      const previousState = loadState<DesktopState>(STORAGE_KEY);
      if (previousState) {
        return { ...previousState, date: new Date().toISOString() };
      }
    },
    changeSingleClickIcon: (state, { payload }: PayloadAction<boolean>) => {
      state.singleClickIcon = payload;
      persistState(STORAGE_KEY, state);
    },
    resetToDefault: (state) => {
      state.background = 3;
      state.brightness = 1;
      state.fontStyle = 1;
      state.dropDownOpen = false;
      state.activityDropDown = false;
      state.singleClickIcon = true;
      state.isFullScreen = false;
    },
    changeBackImage: (state, { payload }: PayloadAction<number>) => {
      state.background = payload;
      persistState(STORAGE_KEY, state);
    },
    changeFontStyle: (state, { payload }: PayloadAction<number>) => {
      state.fontStyle = payload;
      persistState(STORAGE_KEY, state);
    },
    changeBrightness: (state, { payload }: PayloadAction<number>) => {
      state.brightness = payload;
      persistState(STORAGE_KEY, state);
    },
    setBatteryStatus: (
      state,
      { payload }: PayloadAction<DesktopState["battery"]>
    ) => {
      state.battery = payload;
    },
    setOnlineStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isOnline = payload;
    },
    setNetworkType: (state, { payload }: PayloadAction<string>) => {
      state.networkType = payload;
    },
    setDateStatus: (state, { payload }: PayloadAction<string>) => {
      state.date = payload;
    },
    toggleActivityDropDown: (state, { payload }: PayloadAction<boolean>) => {
      state.activityDropDown = payload;
    },
    setPowerOffStatus: (
      state,
      { payload }: PayloadAction<DesktopState["powerOff"]>
    ) => {
      state.powerOff = payload;
    },
  },
});

export const {
  toggleDropDown,
  toggleStartMenu,
  toggleFullScreen,
  hydrateFromStorage,
  changeSingleClickIcon,
  resetToDefault,
  changeBackImage,
  changeFontStyle,
  changeBrightness,
  setBatteryStatus,
  setOnlineStatus,
  setNetworkType,
  setDateStatus,
  toggleActivityDropDown,
  setPowerOffStatus,
} = desktopSlice.actions;

export default desktopSlice.reducer;

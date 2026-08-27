import { configureStore } from "@reduxjs/toolkit";
import desktopReducer from "@/features/desktop/desktopSlice";
import activityReducer from "@/features/activity/activitySlice";
import fileSystemReducer from "@/features/fileSystem/fileSystemSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      desktopReducers: desktopReducer,
      activityReducers: activityReducer,
      fileSystemReducers: fileSystemReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

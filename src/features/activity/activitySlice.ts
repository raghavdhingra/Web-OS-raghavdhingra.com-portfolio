import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ActivityState, ActivityWindowState } from "@/types/models";

const initialState: ActivityState = {
  triggerIndex: -1,
  isTriggered: false,
  activity: [],
};

interface ActivityIndexPayload {
  activityIndex: number;
}

interface ActivityTriggerPayload extends ActivityIndexPayload {
  isTriggered: boolean;
}

interface ActivityLoadingPayload extends ActivityIndexPayload {
  isLoading: boolean;
}

interface ActivityMaximisePayload extends ActivityIndexPayload {
  isMaximise: boolean;
}

interface ActivityPositionPayload extends ActivityIndexPayload {
  top: string;
  left: string;
}

interface ActivityDimensionPayload extends ActivityIndexPayload {
  height: string;
  width: string;
}

const activitySlice = createSlice({
  name: "activityReducers",
  initialState,
  reducers: {
    createActivity: (
      state,
      { payload }: PayloadAction<ActivityWindowState>
    ) => {
      state.activity.push(payload);
    },
    updateActivityTrigger: (
      state,
      { payload }: PayloadAction<ActivityTriggerPayload>
    ) => {
      state.triggerIndex = payload.activityIndex;
      state.isTriggered = payload.isTriggered;
    },
    removeActivityTrigger: (state) => {
      state.triggerIndex = -1;
      state.isTriggered = false;
    },
    removeActivity: (state, { payload }: PayloadAction<ActivityIndexPayload>) => {
      state.activity.splice(payload.activityIndex, 1);
    },
    updateZIndexActivity: (
      state,
      { payload }: PayloadAction<ActivityIndexPayload>
    ) => {
      state.activity.forEach((act) => {
        act.zIndex = 2;
      });
      state.activity[payload.activityIndex].zIndex = 3;
    },
    toggleLoadingActivity: (
      state,
      { payload }: PayloadAction<ActivityLoadingPayload>
    ) => {
      state.activity[payload.activityIndex].isLoading = payload.isLoading;
    },
    toggleActivityMaximise: (
      state,
      { payload }: PayloadAction<ActivityMaximisePayload>
    ) => {
      state.activity[payload.activityIndex].isMaximise = payload.isMaximise;
    },
    updateActivityPosition: (
      state,
      { payload }: PayloadAction<ActivityPositionPayload>
    ) => {
      state.activity[payload.activityIndex].top = payload.top;
      state.activity[payload.activityIndex].left = payload.left;
    },
    updateActivityDimension: (
      state,
      { payload }: PayloadAction<ActivityDimensionPayload>
    ) => {
      state.activity[payload.activityIndex].height = payload.height;
      state.activity[payload.activityIndex].width = payload.width;
    },
  },
});

export const {
  createActivity,
  updateActivityTrigger,
  removeActivityTrigger,
  removeActivity,
  updateZIndexActivity,
  toggleLoadingActivity,
  toggleActivityMaximise,
  updateActivityPosition,
  updateActivityDimension,
} = activitySlice.actions;

export default activitySlice.reducer;

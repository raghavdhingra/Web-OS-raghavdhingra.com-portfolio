import type { AppDispatch } from "@/store/store";
import type { SpawnActivityInput } from "@/types/models";
import {
  createActivity,
  removeActivity as removeActivityAction,
  removeActivityTrigger,
  toggleLoadingActivity,
  updateActivityTrigger,
} from "./activitySlice";
import { buildActivityPayload } from "./buildActivity";

export const spawnActivity =
  (input: SpawnActivityInput) => (dispatch: AppDispatch) => {
    dispatch(createActivity(buildActivityPayload(input)));
  };

export const removeActivity =
  (activityIndex: number) => (dispatch: AppDispatch) => {
    dispatch(updateActivityTrigger({ activityIndex, isTriggered: true }));
    dispatch(toggleLoadingActivity({ activityIndex, isLoading: true }));

    setTimeout(() => {
      dispatch(toggleLoadingActivity({ activityIndex, isLoading: true }));
      dispatch(removeActivityAction({ activityIndex }));
      dispatch(removeActivityTrigger());
    }, 100);
  };

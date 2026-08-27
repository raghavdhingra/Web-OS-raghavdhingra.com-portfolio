import type { AppDispatch } from "@/store/store";
import {
  changeTextInFile as changeTextInFileAction,
  hydrateFromStorage as hydrateFileSystemFromStorage,
  makeDirectoryInSystem,
  makeFileInSystem,
  removeDirectoryInSystem,
} from "@/features/fileSystem/fileSystemSlice";
import { hydrateFromStorage as hydrateDesktopState } from "@/features/desktop/desktopSlice";

interface PathPayload {
  pathArray: string[];
}

export const makeDirectoryAction =
  (payload: PathPayload & { folderName: string }) => (dispatch: AppDispatch) => {
    dispatch(makeDirectoryInSystem(payload));
  };

export const makeFileAction =
  (payload: PathPayload & { fileName: string }) => (dispatch: AppDispatch) => {
    dispatch(makeFileInSystem(payload));
  };

export const removeDirectoryAction =
  (payload: PathPayload & { folderName: string }) => (dispatch: AppDispatch) => {
    dispatch(removeDirectoryInSystem(payload));
  };

export const changeTextInFile =
  (payload: PathPayload & { name: string; child: string }) =>
  (dispatch: AppDispatch) => {
    dispatch(changeTextInFileAction(payload));
  };

export const previousStateSet = () => (dispatch: AppDispatch) => {
  dispatch(hydrateDesktopState());
  dispatch(hydrateFileSystemFromStorage());
};

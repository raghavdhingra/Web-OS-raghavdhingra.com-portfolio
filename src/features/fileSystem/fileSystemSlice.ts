import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_FILE_SYSTEM } from "@/data/defaultDesktopIcons";
import { findDirectory } from "@/features/fileSystem/fileSystemUtils";
import { persistState, loadState } from "@/utils/localStorage";
import type { FileSystemEntry, FileSystemState } from "@/types/models";

const STORAGE_KEY = "fileSystem";

const isValidAssetUrl = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("/") || value.startsWith("http"));

const restoreDesktopIcons = (
  savedDesktop?: FileSystemEntry,
  freshDesktop?: FileSystemEntry
) => {
  if (!savedDesktop?.child || !freshDesktop?.child) return;
  if (!Array.isArray(savedDesktop.child) || !Array.isArray(freshDesktop.child)) {
    return;
  }

  const freshChildren = freshDesktop.child;

  savedDesktop.child = savedDesktop.child.map((item) => {
    const freshItem = freshChildren.find((entry) => entry.name === item.name);
    if (
      freshItem &&
      "icon" in freshItem &&
      freshItem.icon &&
      "icon" in item &&
      !isValidAssetUrl(item.icon)
    ) {
      return { ...item, icon: freshItem.icon };
    }
    return item;
  });
};

const initialState: FileSystemState = {
  fileSystem: DEFAULT_FILE_SYSTEM,
};

interface PathPayload {
  pathArray: string[];
}

interface ChangeTextPayload extends PathPayload {
  name: string;
  child: string;
}

interface MakeDirectoryPayload extends PathPayload {
  folderName: string;
}

interface MakeFilePayload extends PathPayload {
  fileName: string;
}

interface RemoveDirectoryPayload extends PathPayload {
  folderName: string;
}

const fileSystemSlice = createSlice({
  name: "fileSystemReducers",
  initialState,
  reducers: {
    changeTextInFile: (state, { payload }: PayloadAction<ChangeTextPayload>) => {
      const { pathArray, name, child } = payload;
      const file = findDirectory(state.fileSystem, pathArray).find(
        (entry) => entry.name === name
      );
      if (file) file.child = child;
      persistState(STORAGE_KEY, state);
    },
    makeDirectoryInSystem: (
      state,
      { payload }: PayloadAction<MakeDirectoryPayload>
    ) => {
      const { pathArray, folderName } = payload;
      findDirectory(state.fileSystem, pathArray).push({
        name: folderName,
        type: "folder",
        child: [],
        location: pathArray,
      });
      persistState(STORAGE_KEY, state);
    },
    makeFileInSystem: (state, { payload }: PayloadAction<MakeFilePayload>) => {
      const { pathArray, fileName } = payload;
      findDirectory(state.fileSystem, pathArray).push({
        name: fileName,
        type: "file",
        location: pathArray,
        child: "",
      });
      persistState(STORAGE_KEY, state);
    },
    removeDirectoryInSystem: (
      state,
      { payload }: PayloadAction<RemoveDirectoryPayload>
    ) => {
      const { pathArray, folderName } = payload;
      const curDir = findDirectory(state.fileSystem, pathArray);
      const index = curDir.findIndex((dir) => dir.name === folderName);
      if (index === -1) return;
      curDir.splice(index, 1);
      persistState(STORAGE_KEY, state);
    },
    hydrateFromStorage: (_state) => {
      const previousState = loadState<FileSystemState>(STORAGE_KEY);
      if (!previousState) return;

      const freshDesktop = initialState.fileSystem.find(
        (folder) => folder.name === "desktop"
      );
      const savedDesktop = previousState.fileSystem?.find(
        (folder) => folder.name === "desktop"
      );

      restoreDesktopIcons(savedDesktop, freshDesktop);
      return previousState;
    },
  },
});

export const {
  changeTextInFile,
  makeDirectoryInSystem,
  makeFileInSystem,
  removeDirectoryInSystem,
  hydrateFromStorage,
} = fileSystemSlice.actions;

export default fileSystemSlice.reducer;

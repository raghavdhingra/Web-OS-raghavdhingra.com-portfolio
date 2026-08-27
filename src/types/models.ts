import type { AssetImport } from "@/utils/assetUrl";

export interface BatteryStatus {
  level: number;
  charging: boolean;
}

export interface PowerOffState {
  active: boolean;
  timer: number;
}

export interface DesktopState {
  background: number;
  fontStyle: number;
  brightness: number;
  dropDownOpen: boolean;
  singleClickIcon: boolean;
  isFullScreen: boolean;
  isStartMenuOpen: boolean;
  battery: BatteryStatus;
  isOnline: boolean;
  networkType: string;
  date: string;
  activityDropDown: boolean;
  powerOff: PowerOffState;
}

export type ContentType = "builtin" | "iframe" | "textEditor";
export type FooterType = "link" | "autoSave" | null;
export type AppKey = "terminal" | "browser" | "camera" | "settings";

export interface FileSystemEntry {
  name: string;
  type: "file" | "folder";
  location: string[];
  icon?: AssetImport;
  link?: string;
  inPage?: boolean;
  child?: FileSystemEntry[] | string;
}

export interface ActivityWindowState {
  name: string;
  isLoading: boolean;
  date: string;
  isMaximise: boolean;
  image: string;
  zIndex: number;
  top: string;
  left: string;
  height: string;
  width: string;
  contentType: ContentType;
  appKey?: AppKey;
  link?: string;
  system?: FileSystemEntry;
  footerType: FooterType;
  terminalLocation?: string[];
}

export interface ActivityState {
  triggerIndex: number;
  isTriggered: boolean;
  activity: ActivityWindowState[];
}

export interface FileSystemState {
  fileSystem: FileSystemEntry[];
}

export interface AppDefinition {
  name: string;
  image: AssetImport;
  width: string;
  bigWidth?: string;
  key: string;
  link?: string;
}

export interface SpawnActivityInput {
  name?: string;
  appKey?: string;
  contentType?: ContentType;
  image?: string;
  link?: string;
  system?: FileSystemEntry;
  terminalLocation?: string[];
}

export interface ActivitySupplement {
  activity: ActivityWindowState;
  terminalLocation?: string[];
}

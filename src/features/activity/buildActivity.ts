import { findBuiltInApp } from "@/data/apps";
import { assetUrl } from "@/utils/assetUrl";
import type {
  ActivityWindowState,
  AppKey,
  ContentType,
  FooterType,
  SpawnActivityInput,
} from "@/types/models";

export const CONTENT_TYPES = {
  BUILTIN: "builtin",
  IFRAME: "iframe",
  TEXT_EDITOR: "textEditor",
} as const satisfies Record<string, ContentType>;

export const FOOTER_TYPES = {
  LINK: "link",
  AUTO_SAVE: "autoSave",
} as const satisfies Record<string, Exclude<FooterType, null>>;

const TASKBAR_HEIGHT = 34;
const DOCK_WIDTH = 60;
const DEFAULT_HEIGHT = 500;
const DEFAULT_WIDTH = 750;

function getCenteredWindowPosition(
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT
) {
  if (typeof window === "undefined") {
    return { top: `${TASKBAR_HEIGHT}px`, left: `${DOCK_WIDTH}px` };
  }

  const workWidth = window.innerWidth - DOCK_WIDTH;
  const workHeight = window.innerHeight - TASKBAR_HEIGHT;
  const left = DOCK_WIDTH + Math.max(0, Math.round((workWidth - width) / 2));
  const top = TASKBAR_HEIGHT + Math.max(0, Math.round((workHeight - height) / 2));

  return { top: `${top}px`, left: `${left}px` };
}

function createDefaultWindow() {
  return {
    isLoading: false,
    date: new Date().toISOString(),
    isMaximise: false,
    zIndex: 4,
    height: `${DEFAULT_HEIGHT}px`,
    width: `${DEFAULT_WIDTH}px`,
    ...getCenteredWindowPosition(),
  };
}

export function buildActivityPayload(
  input: SpawnActivityInput
): ActivityWindowState {
  if (input.contentType === CONTENT_TYPES.IFRAME) {
    return {
      ...createDefaultWindow(),
      name: input.name ?? "Window",
      contentType: CONTENT_TYPES.IFRAME,
      image: assetUrl(input.image),
      link: input.link ?? "",
      footerType: FOOTER_TYPES.LINK,
    };
  }

  if (input.contentType === CONTENT_TYPES.TEXT_EDITOR && input.system) {
    return {
      ...createDefaultWindow(),
      name: input.name ?? input.system.name,
      contentType: CONTENT_TYPES.TEXT_EDITOR,
      image: assetUrl(input.image),
      system: {
        name: input.system.name,
        location: input.system.location,
        type: input.system.type,
        child: input.system.child,
        link: input.system.link,
      },
      footerType: FOOTER_TYPES.AUTO_SAVE,
    };
  }

  const appKey = input.appKey || input.name;
  if (!appKey) {
    throw new Error("Unknown application: missing app key");
  }

  const app = findBuiltInApp(appKey);
  if (!app) {
    throw new Error(`Unknown application: ${appKey}`);
  }

  return {
    ...createDefaultWindow(),
    name: app.name,
    appKey: app.key as AppKey,
    contentType: CONTENT_TYPES.BUILTIN,
    image: assetUrl(app.image),
    footerType: null,
    terminalLocation: input.terminalLocation || ["desktop"],
  };
}

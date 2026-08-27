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

const DEFAULT_WINDOW = {
  isLoading: false,
  date: new Date().toISOString(),
  isMaximise: false,
  zIndex: 4,
  top: "34px",
  left: "60px",
  height: "500px",
  width: "750px",
} as const;

export function buildActivityPayload(
  input: SpawnActivityInput
): ActivityWindowState {
  if (input.contentType === CONTENT_TYPES.IFRAME) {
    return {
      ...DEFAULT_WINDOW,
      name: input.name ?? "Window",
      contentType: CONTENT_TYPES.IFRAME,
      image: assetUrl(input.image),
      link: input.link ?? "",
      footerType: FOOTER_TYPES.LINK,
    };
  }

  if (input.contentType === CONTENT_TYPES.TEXT_EDITOR && input.system) {
    return {
      ...DEFAULT_WINDOW,
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
    ...DEFAULT_WINDOW,
    name: app.name,
    appKey: app.key as AppKey,
    contentType: CONTENT_TYPES.BUILTIN,
    image: assetUrl(app.image),
    footerType: null,
    terminalLocation: input.terminalLocation || ["desktop"],
  };
}

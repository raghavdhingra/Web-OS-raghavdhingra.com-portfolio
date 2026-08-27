"use client";

import Browser from "@/components/applications/browser/browser";
import Camera from "@/components/applications/camera/camera";
import Settings from "@/components/applications/settings/settings";
import TerminalWindow from "@/components/applications/terminal/terminal";
import TextEditor from "@/components/applications/textEditor/textEditor";
import type { ActivitySupplement, ActivityWindowState } from "@/types/models";
import { CONTENT_TYPES, FOOTER_TYPES } from "./buildActivity";

interface ActivityContentProps {
  activity: ActivityWindowState;
}

export function ActivityBody({ activity }: ActivityContentProps) {
  const supplement: ActivitySupplement = {
    activity,
    terminalLocation: activity.terminalLocation,
  };

  switch (activity.contentType) {
    case CONTENT_TYPES.BUILTIN: {
      switch (activity.appKey) {
        case "browser":
          return <Browser />;
        case "settings":
          return <Settings />;
        case "camera":
          return <Camera supplement={supplement} />;
        case "terminal":
          return <TerminalWindow supplement={supplement} />;
        default:
          return null;
      }
    }
    case CONTENT_TYPES.IFRAME:
      return (
        <iframe
          src={activity.link}
          title={activity.name}
          className="portfolio-container-iframe"
        />
      );
    case CONTENT_TYPES.TEXT_EDITOR:
      return activity.system ? <TextEditor system={activity.system} /> : null;
    default:
      return null;
  }
}

export function ActivityFooter({ activity }: ActivityContentProps) {
  if (activity.footerType === FOOTER_TYPES.LINK && activity.link) {
    const displayUrl = activity.link.replace(/^https?:\/\//, "");
    return (
      <>
        <span className="explorer-footer-label">External page</span>
        <a
          className="explorer-footer-link"
          href={activity.link}
          target="_blank"
          rel="noreferrer"
          title={activity.link}
        >
          {displayUrl}
        </a>
        <a
          className="explorer-footer-action"
          href={activity.link}
          target="_blank"
          rel="noreferrer"
        >
          Open
        </a>
      </>
    );
  }

  if (activity.footerType === FOOTER_TYPES.AUTO_SAVE) {
    return (
      <>
        <span className="explorer-footer-label">
          {activity.system?.name ?? "Untitled"}
        </span>
        <span className="explorer-footer-status">
          <span className="explorer-footer-status-dot" aria-hidden />
          Saved
        </span>
      </>
    );
  }

  return null;
}

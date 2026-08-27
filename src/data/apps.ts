import TerminalImage from "@/assets/icons/terminal.svg";
import CameraImage from "@/assets/icons/camera.svg";
import BrowserImage from "@/assets/icons/browser.svg";
import SettingsImage from "@/assets/icons/setting.svg";
import PROFILE_IMAGE from "@/assets/icons/profile.svg";
import PROJECT_IMAGE from "@/assets/icons/project.svg";
import ARCHIVE_IMAGE from "@/assets/icons/archive.svg";
import GITHUB_IMAGE from "@/assets/icons/octocat.svg";
import FACEBOOK_IMAGE from "@/assets/icons/facebook.svg";
import TWITTER_IMAGE from "@/assets/icons/twitter.svg";
import INSTAGRAM_IMAGE from "@/assets/icons/instagram.svg";
import LINKEDIN_IMAGE from "@/assets/icons/linkedin.svg";
import CODEPEN_IMAGE from "@/assets/icons/codepen.svg";
import GMAIL_IMAGE from "@/assets/icons/gmail.svg";
import MEDIUM_IMAGE from "@/assets/icons/medium.svg";
import SPONSOR_IMAGE from "@/assets/icons/sponsorship.png";
import { SOCIAL_LINKS } from "@/data/portfolioContent";
import type { AppDefinition, AppKey } from "@/types/models";
import type { AssetImport } from "@/utils/assetUrl";

const ICON_SIZES = {
  sm: "40px",
  md: "50px",
  lg: "60px",
  xl: "70px",
} as const;

const SOCIAL_ICONS: Record<string, AssetImport> = {
  archive: ARCHIVE_IMAGE,
  portfolio: PROFILE_IMAGE,
  projects: PROJECT_IMAGE,
  github: GITHUB_IMAGE,
  facebook: FACEBOOK_IMAGE,
  twitter: TWITTER_IMAGE,
  instagram: INSTAGRAM_IMAGE,
  linkedin: LINKEDIN_IMAGE,
  codepen: CODEPEN_IMAGE,
  gmail: GMAIL_IMAGE,
  medium: MEDIUM_IMAGE,
  sponsor: SPONSOR_IMAGE,
};

const BUILTIN_APPS: AppDefinition[] = [
  {
    name: "Browser",
    image: BrowserImage,
    width: ICON_SIZES.md,
    bigWidth: ICON_SIZES.xl,
    key: "browser",
  },
  {
    name: "Camera",
    image: CameraImage,
    width: ICON_SIZES.sm,
    bigWidth: ICON_SIZES.lg,
    key: "camera",
  },
  {
    name: "Settings",
    image: SettingsImage,
    width: ICON_SIZES.md,
    bigWidth: ICON_SIZES.xl,
    key: "settings",
  },
  {
    name: "Terminal",
    image: TerminalImage,
    width: ICON_SIZES.sm,
    bigWidth: ICON_SIZES.lg,
    key: "terminal",
  },
];

const DEFAULT_APP_KEYS: AppKey[] = ["terminal", "browser", "camera", "settings"];

const appByKey = (key: string) =>
  BUILTIN_APPS.find((app) => app.key === key);

export const applications = {
  allApplications: BUILTIN_APPS,
  socialApps: SOCIAL_LINKS.map(({ name, key, link }) => ({
    name,
    key,
    link,
    image: SOCIAL_ICONS[key],
    width: ICON_SIZES.sm,
    bigWidth: ICON_SIZES.lg,
  })),
  defaultApps: DEFAULT_APP_KEYS.map((key) => {
    const app = appByKey(key);
    if (!app) throw new Error(`Missing built-in app: ${key}`);
    return {
      name: app.name,
      image: app.image,
      width: app.width,
      key: app.key,
    };
  }),
};

export const findBuiltInApp = (appKey: string) => appByKey(appKey);

import { LINKS } from "@/data/portfolioContent";
import PROFILE_IMAGE from "@/assets/icons/profile.svg";
import PROJECT_IMAGE from "@/assets/icons/project.svg";
import ARCHIVE_IMAGE from "@/assets/icons/archive.svg";
import SPONSOR_IMAGE from "@/assets/icons/sponsorship.png";
import USER_IMAGE from "@/assets/icons/user.png";
import FORK_IMAGE from "@/assets/icons/transfer.png";
import GITHUB_IMAGE from "@/assets/icons/octocat.svg";
import type { FileSystemEntry } from "@/types/models";

const desktopLocation = ["desktop"] as const;

/** Default desktop shortcuts - links sourced from portfolioContent. */
export const DEFAULT_DESKTOP_ICONS: FileSystemEntry[] = [
  {
    name: "Portfolio",
    type: "file",
    icon: USER_IMAGE,
    link: LINKS.portfolio,
    inPage: true,
    location: [...desktopLocation],
  },
  {
    name: "Resume",
    type: "file",
    icon: PROFILE_IMAGE,
    link: LINKS.resume,
    inPage: true,
    location: [...desktopLocation],
  },
  {
    name: "Projects",
    type: "file",
    icon: PROJECT_IMAGE,
    link: LINKS.projects,
    inPage: true,
    location: [...desktopLocation],
  },
  {
    name: "Archive",
    type: "file",
    icon: ARCHIVE_IMAGE,
    link: LINKS.archive,
    inPage: false,
    location: [...desktopLocation],
  },
  { name: "Docs", type: "file", child: "", location: [...desktopLocation] },
  {
    name: "Follow me",
    type: "file",
    icon: GITHUB_IMAGE,
    link: LINKS.github,
    inPage: false,
    location: [...desktopLocation],
  },
  {
    name: "Clone Repo",
    type: "file",
    icon: FORK_IMAGE,
    link: LINKS.fork,
    inPage: false,
    location: [...desktopLocation],
  },
  {
    name: "Sponsor",
    type: "file",
    icon: SPONSOR_IMAGE,
    link: LINKS.sponsor,
    inPage: false,
    location: [...desktopLocation],
  },
];

export const DEFAULT_FILE_SYSTEM: FileSystemEntry[] = [
  {
    name: "desktop",
    type: "folder",
    location: [],
    child: DEFAULT_DESKTOP_ICONS,
  },
  {
    name: "raghavdhingra",
    type: "folder",
    child: [],
    location: [],
  },
  {
    name: "public",
    type: "folder",
    child: [],
    location: [],
  },
];

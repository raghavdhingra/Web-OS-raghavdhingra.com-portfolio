/** Single source of truth for portfolio and social URLs. */
export const LINKS = {
  portfolio: "https://portfolio.raghavdhingra.com",
  resume: "https://portfolio.raghavdhingra.com/resume.pdf",
  projects: "https://portfolio.raghavdhingra.com/projects",
  archive: "https://github.com/raghavdhingra?tab=repositories&q=portfolio",
  github: "https://github.com/raghavdhingra",
  fork: "https://github.com/raghavdhingra/Web-OS/fork",
  sponsor: "https://github.com/sponsors/raghavdhingra",
  facebook: "https://www.facebook.com/raghav.dhingra15",
  twitter: "https://twitter.com/raghavdhingra15",
  instagram: "https://www.instagram.com/raghav.dhingra15/",
  linkedin: "https://www.linkedin.com/in/raghav-dhingra/",
  codepen: "https://codepen.io/raghav-dhingra",
  gmail: "mailto:admin@raghavdhingra.com",
  medium: "https://medium.com/@raghav.dhingra15",
} as const;

export type SocialLinkKey = keyof typeof LINKS;

export interface SocialLinkDefinition {
  name: string;
  key: SocialLinkKey;
  link: string;
}

/** Start-menu social tab entries (order preserved). */
export const SOCIAL_LINKS: SocialLinkDefinition[] = [
  { name: "Archive", key: "archive", link: LINKS.archive },
  { name: "Portfolio", key: "portfolio", link: LINKS.portfolio },
  { name: "Projects", key: "projects", link: LINKS.projects },
  { name: "GitHub", key: "github", link: LINKS.github },
  { name: "Facebook", key: "facebook", link: LINKS.facebook },
  { name: "Twitter", key: "twitter", link: LINKS.twitter },
  { name: "Instagram", key: "instagram", link: LINKS.instagram },
  { name: "Linkedin", key: "linkedin", link: LINKS.linkedin },
  { name: "Codepen", key: "codepen", link: LINKS.codepen },
  { name: "G-Mail", key: "gmail", link: LINKS.gmail },
  { name: "Medium", key: "medium", link: LINKS.medium },
  { name: "Sponsor", key: "sponsor", link: LINKS.sponsor },
];

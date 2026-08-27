import { LINKS } from "@/data/portfolioContent";

export const SITE_URL = "https://raghavdhingra.com";

export const site = {
  url: SITE_URL,
  name: "Portfolio OS",
  author: "Raghav Dhingra",
  jobTitle: "Full Stack Developer",
  title: "Portfolio OS | Raghav Dhingra | Full Stack Developer",
  description:
    "Hey there - I am Raghav Dhingra, a full stack web developer and open source contributor. Portfolio OS is my Linux-inspired desktop in the browser.",
  tagline:
    "Hey there - I am Raghav Dhingra, a full stack web developer and open source contributor. Explore Portfolio OS, my Linux-inspired personal portfolio in the browser.",
  twitterHandle: "@raghavdhingra15",
  email: "admin@raghavdhingra.com",
  locale: "en_US",
  language: "en",
  themeColor: "#F4BD42",
  backgroundColor: "#2B2929",
  keywords: [
    "Raghav Dhingra",
    "Full Stack Developer",
    "Portfolio OS",
    "web desktop",
    "Linux portfolio",
    "open source",
  ],
  socialLinks: [
    LINKS.github,
    LINKS.linkedin,
    LINKS.twitter,
    LINKS.instagram,
    LINKS.facebook,
    LINKS.codepen,
    LINKS.medium,
    LINKS.portfolio,
  ],
} as const;

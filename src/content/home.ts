export type Locale = "en" | "zh";

interface IndexItem {
  label: string;
  href: string | null;
  status?: string;
  imageSrc: `/assets/${string}`;
  videoSrc: `/assets/${string}`;
  loop: boolean;
}

export const heroPractices = [
  {
    label: "DEVELOPMENT",
    description: "Developing original stories\nand characters into IP.",
    scopes: ["ORIGINAL CONTENT", "CHARACTERS", "FORMATS"],
  },
  {
    label: "DIGITALIZATION",
    description: "Transforming heritage and IP\ninto digital experiences.",
    scopes: ["HERITAGE", "COLLECTIONS", "DIGITAL EXPERIENCES"],
  },
  {
    label: "ACTIVATION",
    description: "Connecting IP with audiences\nthrough curation and events.",
    scopes: ["CURATION", "PUBLIC PROGRAMS", "CAMPAIGNS"],
  },
] as const;

export const indexItems = [
  {
    label: "INTRO",
    href: "/intro/",
    imageSrc: "/assets/index/round-04/intro-v2.webp",
    videoSrc: "/assets/index/round-04/intro-v2.mp4",
    loop: false,
  },
  {
    label: "Curation",
    href: "/curation/",
    imageSrc: "/assets/index/round-03/curation.webp",
    videoSrc: "/assets/index/round-03/curation.mp4",
    loop: true,
  },
  {
    label: "Partnerships",
    href: "/partnerships/",
    imageSrc: "/assets/index/round-05/partnerships.webp",
    videoSrc: "/assets/index/round-05/partnerships.mp4",
    loop: false,
  },
  {
    label: "Originals",
    href: null,
    status: "In Development",
    imageSrc: "/assets/index/round-05/originals.webp",
    videoSrc: "/assets/index/round-05/originals.mp4",
    loop: false,
  },
  {
    label: "Contact",
    href: "/contact/",
    imageSrc: "/assets/index/contact.webp",
    videoSrc: "/assets/index/contact.mp4",
    loop: true,
  },
] as const satisfies readonly IndexItem[];

export function localizedPath(path: string, locale: Locale): string {
  return locale === "zh" ? `/zh${path}` : path;
}

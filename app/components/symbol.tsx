import React from "react";
import { cn } from "../lib/utils";

interface SymbolProps {
  name: string;
  className?: string;
}

// Original geometric interface glyphs. Names preserve the existing UI contract;
// no Apple SF Symbol image or font is loaded.
const paths: Record<string, string> = {
  "chevron-left": "m14 5-7 7 7 7",
  "chevron-right": "m10 5 7 7-7 7",
  "chevron-up": "m5 15 7-7 7 7",
  "chevron-down": "m5 9 7 7 7-7",
  plus: "M12 4v16M4 12h16",
  minus: "M4 12h16",
  xmark: "m5 5 14 14M19 5 5 19",
  checkmark: "m4 12 5 5L20 6",
  ellipsis: "M5 12h.1M12 12h.1M19 12h.1",
  magnifyingglass: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM15 15l6 6",
  "magnifyingglass-circle":
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM15 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1 3 4 4",
  folder: "M3 5h6l3 3h9v12H3ZM3 10h18",
  doc: "M5 2h9l5 5v15H5ZM14 2v6h5M9 13h6M9 17h6",
  "note-text": "M5 3h14v18H5ZM8 8h8M8 12h8M8 16h5",
  "square-and-pencil": "M12 4H3v17h17v-9M8 13 18 3l3 3-10 10-4 1Z",
  "square-grid-2x2": "M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z",
  "list-bullet": "M8 5h13M8 12h13M8 19h13M3 5h.1M3 12h.1M3 19h.1",
  "rectangle-split-3x1": "M2 5h20v14H2ZM8 5v14M16 5v14",
  "sidebar-left": "M2 4h20v16H2ZM8 4v16M5 8h.1M5 12h.1",
  "rectangle-inset-filled": "M2 4h20v16H2ZM6 8h12v8H6Z",
  "square-on-square": "M7 3h14v14H7ZM3 7v14h14",
  "arrow-up-forward-square": "M13 3h8v8M21 3 10 14M8 4H3v17h17v-5",
  "arrow-up-left-and-arrow-down-right": "M3 10V3h7M3 3l7 7M21 14v7h-7m7 0-7-7",
  "arrow-down-right-and-arrow-up-left": "M10 3v7H3m7 0L3 3M14 21v-7h7m-7 0 7 7",
  "arrow-down-circle":
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v12m-5-5 5 5 5-5",
  "square-and-arrow-up": "M6 10H3v12h18V10h-3M12 16V2M7 7l5-5 5 5",
  "square-and-arrow-down": "M6 10H3v12h18V10h-3M12 2v14m-5-5 5 5 5-5",
  "arrow-clockwise": "M20 9a9 9 0 1 0 0 7M20 3v7h-7",
  "play-circle": "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM10 7l7 5-7 5Z",
  "info-circle": "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 11v7M12 6v.1",
  "exclamationmark-triangle": "M12 2 1 22h22ZM12 9v6M12 18v.1",
  house: "M2 11 12 2l10 9M5 9v13h14V9M9 22v-8h6v8",
  clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 5v8l5 3",
  tag: "M2 3h9l11 11-8 8L2 10ZM7 7h.1",
  trash: "M3 6h18M9 3h6M5 6l1 16h12l1-16M10 10v8M14 10v8",
  envelope: "M2 5h20v14H2ZM2 5l10 9L22 5",
  paperplane: "M2 11 22 2l-8 20-3-9ZM11 13 22 2",
  link: "m9 7 3-3a6 6 0 0 1 8 8l-3 3M7 9l-3 3a6 6 0 0 0 8 8l3-3M8 16l8-8",
  "person-2":
    "M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM2 22c0-11 16-11 16 0M17 3a4 4 0 0 1 0 8m3 5c2 1 3 3 3 6",
  lock: "M5 10h14v12H5ZM8 10V6a4 4 0 0 1 8 0v4M12 15v3",
  "lock-fill": "M5 10h14v12H5ZM8 10V6a4 4 0 0 1 8 0v4M12 15v3",
  power: "M12 2v11M5 5a10 10 0 1 0 14 0",
  wifi: "M2 7a16 16 0 0 1 20 0M5 11a11 11 0 0 1 14 0M8 15a6 6 0 0 1 8 0M12 19h.1",
  "wifi-slash":
    "M2 7a16 16 0 0 1 20 0M5 11a11 11 0 0 1 14 0M8 15a6 6 0 0 1 8 0M12 19h.1M2 2l20 20",
  "sun-max":
    "M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2",
  "sun-max-fill":
    "M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2",
  moon: "M20 17A10 10 0 0 1 7 3a10 10 0 1 0 13 14Z",
  "moon-fill": "M20 17A10 10 0 0 1 7 3a10 10 0 1 0 13 14Z",
  "bolt-fill": "M13 1 4 14h7l-1 9 10-14h-8Z",
  "battery-100percent-bolt": "M1 6h19v12H1ZM23 10v4M11 7l-4 6h5l-1 4",
  gearshape: "M3 7h18M3 17h18M8 3v8M16 13v8M6 7h4M14 17h4",
  "switch-2":
    "M8 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 5h11a3 3 0 0 1 0 6H8M22 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM16 14H5a3 3 0 0 0 0 6h11",
  desktopcomputer: "M2 3h20v14H2ZM12 17v5M6 22h12",
  "menubar-dock-rectangle": "M2 3h20v18H2ZM2 7h20M8 17h8",
  internaldrive: "M4 3h16l3 18H1ZM3 15h18M17 18h.1",
  photo: "M2 3h20v18H2ZM2 17l7-7 7 7 3-3 3 3M16 7h.1",
  "photo-on-rectangle": "M5 2h17v16H5ZM1 7v16h17M5 16l6-7 6 7 3-3 2 2M18 6h.1",
  icloud: "M6 20h13a5 5 0 0 0 0-10 7 7 0 0 0-13-3 6 6 0 0 0 0 13Z",
  globe:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM2 12h20M12 2c-6 5-6 15 0 20 6-5 6-15 0-20Z",
  "a-square": "M2 2h20v20H2ZM7 17l5-10 5 10M9 14h6",
  "app-dashed": "M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M9 9h6v6H9Z",
  paintpalette:
    "M21 9c0-10-19-10-19 3 0 7 6 11 12 9 3-1-2-4 0-6s7-1 7-6ZM7 8h.1M12 5h.1M17 8h.1M6 14h.1",
  phone: "M5 2h4l2 6-3 2c2 3 4 5 7 6l2-3 5 2v4c0 7-22-5-20-14Z",
  textformat: "M3 5h13M9 5v15M4 20h10M16 12h6M19 12v8",
  applelogo: "m2 19 5-14 5 14M4 14h6M15 5v14m0-7 7-7m-7 7 7 7",
};

const Symbol: React.FC<SymbolProps> = ({ name, className }) => (
  <svg
    aria-hidden="true"
    className={cn("inline-block shrink-0 w-4 h-4", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={paths[name] ?? paths["app-dashed"]} />
  </svg>
);

export default Symbol;

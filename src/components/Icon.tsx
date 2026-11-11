const PATHS = {
  target: "M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 11a1 1 0 1 0 1 1M13 11l7-7M17 4h3v3",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  briefcase: "M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M3 8h18v11H3zM3 13h18",
  chat: "M4 5h16v11H9l-5 4z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
} as const;

export type IconName = keyof typeof PATHS;

const Icon = ({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={PATHS[name]} />
  </svg>
);

export default Icon;

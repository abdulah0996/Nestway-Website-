const paths = {
  compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" /></>,
  route: <><circle cx="5" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 6h9a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h5M19 3v6m-3-3h6" /></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h5m-5 4h8" /></>,
  plane: <path d="m21 3-6.5 18-3.8-7.7L3 9.5 21 3ZM21 3 10.7 13.3" />,
  chat: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z" /><path d="M7 9h9m-9 5h6" /></>,
  graduation: <path d="m2 8 10-5 10 5-10 5L2 8Zm4 2v7c4 3 8 3 12 0v-7m4-2v9" />,
  university: <path d="m3 8 9-5 9 5H3Zm2 3v8m5-8v8m4-8v8m5-8v8M3 21h18" />,
  language: <path d="M3 5h12M9 3v2m-4 0c0 6 3 9 8 11M13 5c0 6-3 9-8 11m9 5 4-11 4 11m-6-4h4" />,
  pin: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
};

export function JourneyIcon({ name, className = '' }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name] || paths.compass}</svg>;
}

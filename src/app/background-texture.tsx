export default function BackgroundTexture() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'>
    <circle cx='2' cy='2' r='1.3' fill='rgba(128,128,128,0.6)' />
  </svg>`;
  const backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-overlay"
      style={{ backgroundImage, backgroundRepeat: "repeat" }}
    />
  );
}

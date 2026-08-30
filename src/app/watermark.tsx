export default function Watermark({ text }: { text: string }) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='160'>
    <text x='0' y='90' transform='rotate(-24 140 80)' font-family='sans-serif' font-size='13' fill='rgba(128,128,128,0.16)'>${text}</text>
  </svg>`;
  const backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      style={{ backgroundImage, backgroundRepeat: "repeat" }}
    />
  );
}

// Cloudflare Workers deploy testi -- bilerek hiçbir dosya sistemi (fs)
// veya veritabanı (Supabase) erişimi YOK, sadece deployment pipeline'ının
// kendisinin çalışıp çalışmadığını izole etmek için.
export default function CloudflareTestPage() {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#0a0a0a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        margin: 0,
      }}
    >
      <h1>Cloudflare Workers testi çalışıyor</h1>
    </div>
  );
}

import ContentPage from "../content-page";

const topics = [
  {
    title: "Mod / Paket İndirme Sorunları",
    body: "Bir dosya indirilmiyorsa veya bozuksa, Mod Paketleri sayfasındaki ilgili paketin detay linkini kontrol edin.",
  },
  {
    title: "Hesap ve Giriş",
    body: "Google ile giriş yaparken sorun yaşıyorsanız, tarayıcı önbelleğini temizleyip tekrar deneyin.",
  },
  {
    title: "İçerik Bildirimi",
    body: "Hatalı, eksik ya da telif hakkı ihlali içeren bir içerik gördüyseniz bize bildirin.",
  },
];

export default function DestekPage() {
  return (
    <ContentPage
      eyebrow="DESTEK"
      title="Destek ve Yardım"
      intro="Aradığınızı bulamadıysanız Sıkça Sorulan Sorular sayfasına da göz atabilirsiniz."
      variant="kurumsal"
      activePath="/destek"
    >
      <div className="flex flex-col gap-5">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className="rounded-2xl border border-black/10 p-5 dark:border-white/10"
          >
            <h2 className="font-sans text-base font-bold text-black dark:text-white">
              {topic.title}
            </h2>
            <p className="mt-1 text-black/70 dark:text-white/70">
              {topic.body}
            </p>
          </div>
        ))}
      </div>
      <p>
        Bu sayfa yakında canlı destek talebi oluşturma özelliğiyle
        güncellenecek.
      </p>
    </ContentPage>
  );
}

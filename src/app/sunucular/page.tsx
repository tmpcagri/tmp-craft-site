import ContentPage from "../content-page";
import { InlineLogo } from "../logo";

export default function SunucularPage() {
  return (
    <ContentPage
      eyebrow="SUNUCULAR"
      title="Şeffaf Sunucu Listesi"
      intro="En iyisi değil, en dürüstü öne çıkar."
      accent="amber"
      variant="stub"
      backgroundImageUrl="https://pub-5946b15c1992464485b90a8b76df9ab1.r2.dev/homepage/bg-sunucular.jpg"
    >
      <p>
        Her sunucu tek bir genel puanla değil, <strong>ayrı eksenlerde</strong>{" "}
        değerlendirilecek: performans/lag, harita kalitesi, giriş/bağlanma
        sorunları, personel ilgisi. Kötü yorumlar asla silinmez veya
        gizlenmez — bir sunucu sahibi öne çıkma için ödeme yapsa bile.
      </p>
      <p>
        <strong>Ödeme sadece görünürlük satın alır, itibar satın almaz.</strong>{" "}
        Öne çıkan (sponsorlu) sunucular ayrı, açıkça etiketli bir bölümde
        görünecek — organik puan sıralamasına asla karışmayacak. Ödeme uygulama
        içi değil, doğrudan iletişim + IBAN üzerinden yürüyecek.
      </p>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <p className="font-sans text-base font-bold text-amber-700 dark:text-amber-400">
          Çok yakında
        </p>
        <p className="mt-1 text-sm text-black/70 dark:text-white/70">
          Sunucu listesi şu an aktif olarak hazırlanıyor. Sunucunu eklemek
          istiyorsan aşağıdaki gereklilikleri karşıladığından emin olup
          İletişim sayfasından bize ulaşabilirsin.
        </p>
      </div>

      <div>
        <h2 className="font-sans text-base font-bold text-black dark:text-white">
          Sunucu Ortağı Olmak İçin Gereklilikler
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-black/70 dark:text-white/70">
          <li>• Son 30 günde en az %95 çalışma süresi (uptime).</li>
          <li>• Aktif ve moderasyonu olan bir Discord/topluluk kanalı.</li>
          <li>
            • Pay-to-win olmayan, en azından temel oynanışı ücretsiz tutan bir
            ekonomi modeli.
          </li>
          <li>• Şikayet/ban itirazlarına 48 saat içinde yanıt veren personel.</li>
          <li>
            • Ban/uyarı kayıtlarının şeffaf tutulduğu bir moderasyon geçmişi.
          </li>
          <li>• Türkçe konuşan en az bir yetkili bulunması.</li>
          <li>
            • <InlineLogo /> kurallarına (nefret söylemi, taciz, reşit
            olmayanlara yönelik uygunsuz içerik yasağı) uyum.
          </li>
        </ul>
      </div>
    </ContentPage>
  );
}

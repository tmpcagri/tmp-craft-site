import type { ReactNode } from "react";
import ContentPage from "../content-page";
import { InlineLogo } from "../logo";

const faqGroups: {
  category: string;
  items: { id: string; q: ReactNode; a: ReactNode }[];
}[] = [
  {
    category: "Genel",
    items: [
      {
        id: "nedir",
        q: (
          <>
            <InlineLogo /> nedir?
          </>
        ),
        a: "Minecraft için mod, resource pack, data pack, shader, modpack ve sunucu içerikleri sunan, aynı zamanda bir topluluk barındıran ücretsiz bir platformdur.",
      },
      {
        id: "tmp-acilimi",
        q: "TMP ne anlama geliyor?",
        a: "TMP, \"Turkish Minecraft Players\" (Türk Minecraft Oyuncuları) ifadesinin kısaltmasıdır.",
      },
      {
        id: "ucretsiz-mi",
        q: "Platform tamamen ücretsiz mi?",
        a: "Evet. Mod Paketleri kütüphanesi, Topluluk ve temel özellikler herkese ücretsizdir. İleride sunucu sponsorluğu ve premium eğitim gibi opsiyonel, uygulama içi ödeme gerektirmeyen (IBAN üzerinden) hizmetler eklenecek.",
      },
      {
        id: "surumler",
        q: "Hangi Minecraft sürümlerini destekliyorsunuz?",
        a: "Şu anki kütüphanemiz güncel Java Edition sürümlerine (1.20, 1.20.4, 1.21) odaklanıyor. Eski sürümler zamanla eklenecek.",
      },
      {
        id: "bedrock",
        q: "Bedrock (mobil/konsol) sürümü destekleniyor mu?",
        a: "Henüz değil — kütüphanemiz şu an yalnızca Java Edition loader'larını (Forge, Fabric, Quilt, NeoForge) kapsıyor. Bedrock desteği yol haritamızda, ama tarih veremiyoruz.",
      },
    ],
  },
  {
    category: "Hesap ve Giriş",
    items: [
      {
        id: "giris",
        q: "Nasıl giriş yaparım?",
        a: "Sağ üstteki \"Giriş Yapın\" düğmesine tıklayıp Google hesabınla devam edebilirsin. Ayrı bir kullanıcı adı/şifre oluşturmana gerek yok.",
      },
      {
        id: "neden-google",
        q: "Neden sadece Google ile giriş var, e-posta/şifre ile olmuyor mu?",
        a: "Şifre yönetimini kendimiz üstlenmek yerine Google'ın güvenlik altyapısına güvenmeyi tercih ettik — bu hem senin için daha güvenli hem bizim için daha az risk demek.",
      },
      {
        id: "sifre-unuttum",
        q: "Şifremi unuttum, ne yapmalıyım?",
        a: (
          <>
            <InlineLogo />
            &apos;ta bir şifre tutmuyoruz; giriş tamamen Google hesabın
            üzerinden yapılıyor. Şifre sorunun varsa Google hesabının
            kurtarma adımlarını kullanman gerekiyor.
          </>
        ),
      },
      {
        id: "hesap-sil",
        q: "Hesabımı nasıl silerim?",
        a: "İletişim sayfasından bize ulaşarak hesap silme talebinde bulunabilirsin. Talebin KVKK aydınlatma metnimizde belirtilen süre içinde işleme alınır.",
      },
    ],
  },
  {
    category: "Mod Paketleri",
    items: [
      {
        id: "icerik-ucretsiz",
        q: "İçerikleri kullanmak ücretsiz mi?",
        a: "Evet, indirmek ücretsizdir. Ancak her paketin kendi lisansı vardır (MIT, CC-BY, GPL-3.0 veya All Rights Reserved) — indirmeden önce paket sayfasındaki lisans bilgisini kontrol et.",
      },
      {
        id: "bagimlilik",
        q: "Bir modun bağımlılığı olup olmadığını nereden anlarım?",
        a: "Paket detay sayfasındaki \"Bağımlılıklar\" bölümünde, o mod için gerekli diğer modlar listelenir ve doğrudan onların sayfasına link verilir.",
      },
      {
        id: "bozuk-dosya",
        q: "Yanlış, bozuk veya güvenli olmayan bir dosya bulursam ne yapmalıyım?",
        a: "Paket sayfasındaki \"Bildir\" düğmesini kullanarak veya İletişim sayfasından bize ulaşarak bildirebilirsin. Kötü amaçlı yazılım içeren dosyalar tespit edildiğinde anında kaldırılır.",
      },
      {
        id: "kendi-modumu-eklerim",
        q: (
          <>
            Kendi modumu/paketimi nasıl <InlineLogo />
            &apos;a eklerim?
          </>
        ),
        a: "Şu an için herkese açık bir yükleme aracımız yok. İçeriğini paylaşmak istiyorsan İletişim sayfasından bize ulaş, birlikte değerlendirelim.",
      },
    ],
  },
  {
    category: "Topluluk",
    items: [
      {
        id: "gonderi-paylas",
        q: "Topluluk'ta nasıl gönderi paylaşırım?",
        a: "Topluluk sayfasındaki \"+ Yeni Konu\" düğmesiyle gönderi oluşturabilirsin (giriş yapmış olman gerekir).",
      },
      {
        id: "kaydettiklerim",
        q: "Beğendiğim veya kaydettiğim mod paketlerini nerede görürüm?",
        a: "Hesap menünden \"Kaydettiklerim\" (/hesabim) sayfasına giderek kaydettiğin tüm paketleri tek listede görebilirsin.",
      },
      {
        id: "premium-yayinci",
        q: "Premium yayıncı nasıl olunur?",
        a: "Premium, Topluluk sayfasındaki \"Sevebileceğin Yayıncılar\" bölümünde öne çıkmak isteyen içerik üreticileri için ödemeli bir görünürlük seçeneğidir. İlgileniyorsan İletişim sayfasından bize ulaş.",
      },
      {
        id: "gonderi-gorunmuyor",
        q: "Gönderim veya mesajım neden görünmüyor?",
        a: "Topluluk Kuralları'na aykırı bulunan içerikler moderatörler tarafından kaldırılabilir. Nedenini öğrenmek istersen İletişim sayfasından bize yazabilirsin.",
      },
    ],
  },
  {
    category: "Gizlilik, Güvenlik ve Moderasyon",
    items: [
      {
        id: "veriler-guvende",
        q: "Verilerim güvende mi?",
        a: "Verilerin, satır bazlı erişim kontrolü (Row Level Security) ve şifreli bağlantı kullanan Supabase altyapısında saklanır. Detaylar için Gizlilik Politikası ve KVKK sayfalarına bakabilirsin.",
      },
      {
        id: "ihlal-bildir",
        q: "Bir kural ihlalini nasıl bildiririm?",
        a: "İlgili gönderi/paket sayfasındaki \"Bildir\" düğmesini kullanabilir veya İletişim sayfasından doğrudan bize ulaşabilirsin.",
      },
      {
        id: "yasaklandim",
        q: "Hesabım yasaklandı, itiraz edebilir miyim?",
        a: "Evet. İletişim sayfasından kullanıcı adını ve itirazının gerekçesini belirterek bize ulaş, talebini inceleyip sonucu bildiririz. Detaylar için Topluluk Kuralları'ndaki \"İtiraz Süreci\" bölümüne bakabilirsin.",
      },
    ],
  },
  {
    category: "Diğer",
    items: [
      {
        id: "sunucu-listele",
        q: (
          <>
            Sunucumu <InlineLogo />
            &apos;ta listeletmek istiyorum, nasıl başvururum?
          </>
        ),
        a: "Sunucular sayfasındaki \"Sunucu Ortağı Olmak İçin Gereklilikler\" listesini karşıladığından emin olup İletişim sayfasından bize ulaşabilirsin.",
      },
      {
        id: "reklam",
        q: "Reklam vermek istiyorum, kiminle görüşmeliyim?",
        a: "İletişim sayfasından bize ulaşman yeterli, reklam ortaklığı fırsatlarını birlikte konuşalım.",
      },
      {
        id: "kimin-urunu",
        q: (
          <>
            <InlineLogo /> kimin ürünü?
          </>
        ),
        a: (
          <>
            <InlineLogo />, ÇağrıMedya grup ürünüdür.
          </>
        ),
      },
    ],
  },
];

export default function SssPage() {
  return (
    <ContentPage
      eyebrow="SSS"
      title="Sıkça Sorulan Sorular"
      intro="Aradığını bulamazsan İletişim sayfasından bize ulaşabilirsin."
      variant="kurumsal"
      activePath="/sss"
    >
      <div className="flex flex-col gap-8">
        {faqGroups.map((group) => (
          <div key={group.category} className="flex flex-col gap-3">
            <h2 className="font-sans text-base font-bold text-black dark:text-white">
              {group.category}
            </h2>
            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <details
                  key={item.id}
                  className="group rounded-2xl border border-black/10 p-5 dark:border-white/10"
                >
                  <summary className="cursor-pointer list-none font-sans text-base font-bold text-black marker:content-none dark:text-white">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-black/70 dark:text-white/70">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}

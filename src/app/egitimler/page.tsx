import ContentPage from "../content-page";

export default function EgitimlerPage() {
  return (
    <ContentPage
      eyebrow="EĞİTİMLER"
      title="Ücretsiz Kurslar ve Premium Eğitim"
      intro="Herkes öğrenebilmeli, isteyen daha derine inebilmeli."
      accent="fuchsia"
      variant="stub"
    >
      <p>
        <strong>Ücretsiz kurslar</strong> herkese açık: adım adım build
        rehberleri, her adımın süresi ve içeriğiyle birlikte. Kilit yok,
        kayıt gerekmez.
      </p>
      <p>
        <strong>Premium eğitim</strong> ise takımlara/sunuculara özel canlı
        eğitim — uygulama içi ödeme yok, sadece bir talep formu dolduruyorsun,
        sonrasında doğrudan iletişime geçip IBAN üzerinden anlaşıyoruz.
      </p>
    </ContentPage>
  );
}

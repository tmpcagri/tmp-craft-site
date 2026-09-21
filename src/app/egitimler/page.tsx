import ContentPage from "../content-page";

export default function EgitimlerPage() {
  return (
    <ContentPage
      eyebrow="EĞİTİMLER"
      title="Ücretsiz Kurslar ve Premium Eğitim"
      intro="Eğitimler bölümüne hoş geldin! Herkes öğrenebilmeli, isteyen daha derine inebilmeli."
      accent="fuchsia"
      variant="stub"
      backgroundImageUrl="https://pub-5946b15c1992464485b90a8b76df9ab1.r2.dev/homepage/bg-egitimler.jpg"
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

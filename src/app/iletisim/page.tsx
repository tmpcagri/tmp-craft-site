import ContentPage from "../content-page";
import { getSiteContent } from "../lib/content";

const PREFILLED_MESSAGE = "Merhaba, TMP Craft ile ilgili bir konuda yardım istiyorum: ";
const PREFILLED_SUBJECT = "TMP Craft — Destek Talebi";

export default async function IletisimPage() {
  const content = getSiteContent();
  const { whatsapp, email } = content.contact;

  return (
    <ContentPage
      eyebrow="İLETİŞİM"
      title="Bize Ulaşın"
      intro="Bir sorunuz, öneriniz ya da iş birliği fikriniz mi var? Konuşalım."
      variant="kurumsal"
      activePath="/iletisim"
    >
      {(whatsapp || email) && (
        <div className="flex flex-wrap gap-3">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              WhatsApp&apos;tan Yaz
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(PREFILLED_SUBJECT)}&body=${encodeURIComponent(PREFILLED_MESSAGE)}`}
              className="flex items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
            >
              E-posta Gönder
            </a>
          )}
        </div>
      )}

      <p>
        {whatsapp || email
          ? "Yukarıdaki düğmelere tıklarsan mesajın önceden doldurulmuş olarak açılır, sadece göndermen yeterli."
          : "Şu an için en hızlı yol topluluk sosyal medya hesaplarımız (footer alanındaki ikonlar). Yakında bu sayfaya canlı bir iletişim formu ve destek e-posta adresi eklenecek."}
      </p>
      <p>
        Teknik bir sorun veya hesap talebi için lütfen{" "}
        <a
          href="/destek"
          className="font-semibold text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
        >
          Destek ve Yardım
        </a>{" "}
        sayfasına göz atın.
      </p>
    </ContentPage>
  );
}

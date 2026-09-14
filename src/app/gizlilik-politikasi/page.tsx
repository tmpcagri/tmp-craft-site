import type { ReactNode } from "react";
import ContentPage from "../content-page";
import { InlineLogo } from "../logo";

function H({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-sans text-base font-bold text-black dark:text-white">
      {children}
    </h2>
  );
}

export default function GizlilikPolitikasiPage() {
  return (
    <ContentPage
      eyebrow="GİZLİLİK"
      title="Gizlilik Politikası"
      intro={
        <>
          Bu politika, <InlineLogo />
          &apos;ı kullanırken hangi verilerin toplandığını, nasıl
          kullanıldığını ve haklarını nasıl kullanabileceğini açıklar. KVKK
          aydınlatma metniyle birlikte okunmalıdır.
        </>
      }
      variant="kurumsal"
      activePath="/gizlilik-politikasi"
    >
      <section>
        <H>1. Topladığımız Bilgiler</H>
        <p className="mt-2">
          Google ile giriş yaptığınızda; ad, e-posta adresi ve profil
          fotoğrafı URL&apos;sini işleriz. Ayrıca platformu kullanırken
          oluşturduğunuz içerikleri (gönderi, yorum, mesaj), etkileşimleri
          (beğeni, kaydetme, indirme tıklamaları) ve temel teknik verileri
          (IP adresi, tarayıcı bilgisi, ziyaret zamanı) toplarız.
        </p>
      </section>

      <section>
        <H>2. Bilgileri Nasıl Kullanıyoruz</H>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>• Hesabınızı oluşturmak ve kimliğinizi doğrulamak için.</li>
          <li>
            • Yetkilendirme seviyenizi (moderatör/yönetici) belirlemek için.
          </li>
          <li>
            • Beğendiğiniz/kaydettiğiniz içerikleri hesabınızda göstermek
            için.
          </li>
          <li>
            • Kural ihlallerini tespit etmek ve gerektiğinde hesap
            işlemi (uyarı/yasaklama) uygulamak için.
          </li>
          <li>
            • Siteyi teknik olarak iyileştirmek (hata ayıklama, performans
            ölçümü) için.
          </li>
        </ul>
        <p className="mt-2">
          Verilerinizi reklam hedeflemesi için satmayız veya kullanmayız.
        </p>
      </section>

      <section>
        <H>3. Çerezler ve Benzer Teknolojiler</H>
        <p className="mt-2">
          Sitede iki tür çerez/yerel depolama kullanılır:
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>
            • <strong>Zorunlu:</strong> oturumunuzu (giriş durumunuzu) ve
            tema tercihinizi (açık/koyu mod) hatırlamak için — bunlar
            olmadan site temel işlevlerini yerine getiremez.
          </li>
          <li>
            • <strong>Tercihe bağlı:</strong> şu an reklam veya analiz amaçlı
            üçüncü taraf çerezi kullanmıyoruz; bu ileride değişirse bu sayfa
            güncellenecek ve giriş ekranındaki çerez bildirimi yeniden
            gösterilecektir.
          </li>
        </ul>
      </section>

      <section>
        <H>4. Üçüncü Taraf Hizmet Sağlayıcılar</H>
        <p className="mt-2">
          Platformu çalıştırabilmek için şu hizmetleri kullanıyoruz:
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>
            • <strong>Supabase:</strong> veritabanı, kimlik doğrulama ve
            dosya depolama altyapımız.
          </li>
          <li>
            • <strong>Google OAuth:</strong> giriş/kimlik doğrulama
            sağlayıcımız.
          </li>
          <li>
            • <strong>Cloudflare:</strong> görsel/statik dosya barındırma.
          </li>
        </ul>
        <p className="mt-2">
          Bu sağlayıcılar yalnızca hizmeti sunmamız için gerekli veriye
          erişebilir, kendi amaçları için kullanamaz.
        </p>
      </section>

      <section>
        <H>5. Veri Saklama Süresi</H>
        <p className="mt-2">
          Hesabınız aktif olduğu sürece verileriniz saklanır. Hesap silme
          talebinde bulunduğunuzda kişisel verileriniz makul bir süre
          içinde silinir; yasal saklama zorunluluğu olan kayıtlar (ör.
          moderasyon geçmişi) istisnadır.
        </p>
      </section>

      <section>
        <H>6. Haklarınız</H>
        <p className="mt-2">
          Verilerinize erişme, düzeltme, silme veya işlemeye itiraz etme
          hakkınız vardır. Detaylı bilgi için{" "}
          <a
            href="/kvkk"
            className="font-semibold text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
          >
            KVKK Aydınlatma Metni
          </a>{" "}
          sayfasına bakabilirsin.
        </p>
      </section>

      <section>
        <H>7. Çocukların Gizliliği</H>
        <p className="mt-2">
          Platform, bilerek 13 yaş altı kullanıcılardan veri toplamaz.
          Böyle bir durum tespit edildiğinde ilgili hesap ve veriler
          silinir.
        </p>
      </section>

      <section>
        <H>8. Politika Değişiklikleri</H>
        <p className="mt-2">
          Bu politika zaman zaman güncellenebilir. Önemli değişikliklerde
          sitede bir bildirim göstereceğiz.
        </p>
      </section>

      <section>
        <H>9. İletişim</H>
        <p className="mt-2">
          Gizlilikle ilgili sorularınız için{" "}
          <a
            href="/iletisim"
            className="font-semibold text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
          >
            İletişim
          </a>{" "}
          sayfasından bize ulaşabilirsiniz.
        </p>
      </section>
    </ContentPage>
  );
}

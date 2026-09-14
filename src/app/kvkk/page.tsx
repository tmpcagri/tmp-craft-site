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

export default function KvkkPage() {
  return (
    <ContentPage
      eyebrow="KVKK"
      title="Kişisel Verilerin Korunması Aydınlatma Metni"
      intro={
        <>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
          uyarınca hazırlanmış aydınlatma metnidir. Son güncelleme: bu sayfa{" "}
          <InlineLogo />
          &apos;ın mevcut teknik altyapısını (Supabase, Google OAuth)
          yansıtır.
        </>
      }
      variant="kurumsal"
      activePath="/kvkk"
    >
      <section>
        <H>1. Veri Sorumlusu</H>
        <p className="mt-2">
          KVKK&apos;nın 3. ve 10. maddeleri uyarınca, kişisel verileriniz veri
          sorumlusu sıfatıyla <strong>ÇağrıMedya</strong> bünyesinde
          yürütülen <strong><InlineLogo /></strong> platformu (&quot;
          <InlineLogo />
          &quot;, &quot;biz&quot;) tarafından, aşağıda açıklanan
          kapsam ve amaçlar dahilinde işlenmektedir.
        </p>
      </section>

      <section>
        <H>2. İşlenen Kişisel Veri Kategorileri</H>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>
            • <strong>Kimlik bilgileri:</strong> ad-soyad veya kullanıcı adı
            (Google hesabınızdan alınan görünen ad).
          </li>
          <li>
            • <strong>İletişim bilgileri:</strong> e-posta adresi.
          </li>
          <li>
            • <strong>Görsel veri:</strong> Google hesabınızdaki profil
            fotoğrafının URL&apos;si (fotoğrafın kendisi sunucularımızda
            saklanmaz, doğrudan Google&apos;ın sunucusundan gösterilir).
          </li>
          <li>
            • <strong>İşlem güvenliği bilgileri:</strong> oturum çerezleri,
            giriş sağlayıcı bilgisi (Google), hesabın oluşturulma tarihi.
          </li>
          <li>
            • <strong>Kullanıcı içeriği:</strong> topluluk gönderileri,
            yorumlar, özel mesajlar, beğeni/kaydetme etkileşimleri.
          </li>
          <li>
            • <strong>Moderasyon verisi:</strong> (yalnızca ilgili kullanıcı
            için) ban/uyarı geçmişi ve gerekçesi.
          </li>
        </ul>
      </section>

      <section>
        <H>3. Kişisel Verilerin İşlenme Amaçları</H>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>• Üyelik oluşturma, oturum yönetimi ve kimlik doğrulama.</li>
          <li>
            • Yetkilendirme seviyenizin (moderatör/yönetici) belirlenmesi.
          </li>
          <li>
            • Topluluk özelliklerinin sunulması (gönderi, mesajlaşma, beğeni,
            kaydetme).
          </li>
          <li>
            • Kural ihlallerinin tespiti, moderasyon işlemleri ve hesap
            güvenliğinin sağlanması.
          </li>
          <li>• Yasal yükümlülüklerin yerine getirilmesi.</li>
        </ul>
      </section>

      <section>
        <H>4. Kişisel Veri İşlemenin Hukuki Sebebi</H>
        <p className="mt-2">
          Verileriniz, KVKK m.5/2 kapsamında; (a) bir sözleşmenin kurulması
          veya ifasıyla doğrudan ilgili olması (hizmet şartlarını kabul
          ederek üye olmanız), (b) hukuki yükümlülüğün yerine getirilmesi ve
          (c) açık rızanızın bulunması (Google ile giriş sırasında verdiğiniz
          izin) hukuki sebeplerine dayanılarak işlenmektedir.
        </p>
      </section>

      <section>
        <H>5. Kişisel Verilerin Aktarımı</H>
        <p className="mt-2">
          Verileriniz, hizmetin sunulabilmesi için gerekli teknik altyapı
          sağlayıcılarımızla (barındırma ve veritabanı hizmeti için{" "}
          <strong>Supabase</strong>, kimlik doğrulama için{" "}
          <strong>Google</strong>) paylaşılır. Bu sağlayıcıların
          sunucuları yurt dışında (AB bölgesi) bulunabilir; bu durum KVKK
          m.9 kapsamında yurt dışına veri aktarımı sayılır ve yalnızca
          açık rızanız veya kanunda öngörülen diğer şartların varlığı
          halinde gerçekleştirilir. Verileriniz, yukarıda sayılanlar
          dışında, yasal zorunluluklar haricinde hiçbir üçüncü tarafla
          paylaşılmaz, satılmaz veya kiralanmaz.
        </p>
      </section>

      <section>
        <H>6. Kişisel Verilerin Saklama Süresi</H>
        <p className="mt-2">
          Verileriniz, hesabınız aktif olduğu sürece ve yukarıdaki amaçlar
          gerektirdiği ölçüde saklanır. Hesabınızı sildiğinizde, kişisel
          verileriniz makul bir süre içinde silinir veya anonim hale
          getirilir; ancak yasal saklama yükümlülüğü bulunan veriler
          (ör. moderasyon kayıtları) ilgili mevzuatta öngörülen süre kadar
          saklanabilir.
        </p>
        <p className="mt-2">
          Topluluk bölümünde bir konunun ham tartışma mesajları, konunun
          açılışından <strong>3 ay sonra</strong> kalıcı olarak silinir —
          yapay zeka tarafından paketlenmiş olsun olmasın. Bir konu
          paketlendiyse, ortaya çıkan kalıcı özet madde ve katkı sağlayan
          kullanıcı adları listesi bu 3 aylık silmeden etkilenmez ve süresiz
          saklanır; detaylar için Telif Hakkı sayfasına bakabilirsiniz.
        </p>
      </section>

      <section>
        <H>7. İlgili Kişi Olarak Haklarınız (KVKK m.11)</H>
        <p className="mt-2">
          <InlineLogo />
          &apos;a başvurarak;
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>• Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
          <li>• İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>
            • İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
            öğrenme,
          </li>
          <li>
            • Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,
          </li>
          <li>• Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>
            • KVKK m.7&apos;deki şartlar oluştuğunda silinmesini/yok
            edilmesini isteme,
          </li>
          <li>
            • Düzeltme/silme işlemlerinin verilerin aktarıldığı üçüncü
            kişilere bildirilmesini isteme,
          </li>
          <li>
            • İşlenen verilerin münhasıran otomatik sistemlerle analiz
            edilmesi sonucu aleyhinize bir sonuç ortaya çıkmasına itiraz
            etme,
          </li>
          <li>
            • Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde
            zararın giderilmesini talep etme
          </li>
        </ul>
        <p className="mt-2">haklarına sahipsiniz.</p>
      </section>

      <section>
        <H>8. Başvuru Yöntemi</H>
        <p className="mt-2">
          Yukarıdaki haklarınızı kullanmak için taleplerinizi{" "}
          <a
            href="/iletisim"
            className="font-semibold text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
          >
            İletişim
          </a>{" "}
          sayfasında belirtilen kanallardan bize iletebilirsiniz. Talepleriniz
          en geç 30 gün içinde sonuçlandırılır.
        </p>
      </section>

      <section>
        <H>9. Çocukların Gizliliği</H>
        <p className="mt-2">
          <InlineLogo />, hesap açabilmek için Google hesabı sahibi olmayı
          şart koşar; Google&apos;ın kendi yaş politikaları geçerlidir.
          Bilerek 13 yaşından küçük kullanıcılardan ek veri toplamayız;
          böyle bir durumdan haberdar olmamız hâlinde ilgili hesabı ve
          verileri makul sürede sileriz.
        </p>
      </section>

      <section>
        <H>10. Veri Güvenliği</H>
        <p className="mt-2">
          Verileriniz, yetkisiz erişime karşı Supabase&apos;in sağladığı
          satır bazlı erişim kontrolü (Row Level Security), şifreli bağlantı
          (HTTPS/TLS) ve en az yetki prensibiyle korunmaktadır.
        </p>
      </section>

      <section>
        <H>11. Değişiklikler</H>
        <p className="mt-2">
          Bu aydınlatma metni, mevzuat değişikliklerine veya platformdaki
          yeni özelliklere göre güncellenebilir. Önemli değişikliklerde
          kullanıcılarımızı bilgilendireceğiz.
        </p>
      </section>
    </ContentPage>
  );
}

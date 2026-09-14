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

export default function KurallarPage() {
  return (
    <ContentPage
      eyebrow="KURALLAR"
      title="Topluluk Kuralları"
      intro={
        <>
          <InlineLogo />, herkesin güvenle vakit geçirebileceği bir topluluk
          olmayı hedefler. Aşağıdaki kurallar tüm gönderiler, yorumlar, özel
          mesajlar, profil bilgileri ve canlı sohbetler için geçerlidir.
        </>
      }
      variant="kurumsal"
      activePath="/kurallar"
    >
      <section>
        <H>1. Kesinlikle Yasak Olan İçerik ve Davranışlar</H>
        <ul className="mt-2 flex flex-col gap-2">
          <li>
            • <strong>Hakaret ve taciz:</strong> herhangi bir kullanıcıya
            yönelik hakaret, aşağılama, tehdit, sürekli rahatsız etme veya
            zorbalık.
          </li>
          <li>
            • <strong>Nefret söylemi:</strong> ırk, etnik köken, milliyet,
            din, mezhep, cinsiyet, cinsel yönelim, engellilik veya benzeri
            bir özelliğe dayalı ayrımcı, aşağılayıcı veya nefret içeren
            ifadeler.
          </li>
          <li>
            • <strong>Öfke ve kışkırtma içeren içerik:</strong> şiddeti
            özendiren, kışkırtan veya kutlayan paylaşımlar; kasıtlı olarak
            kavga/drama çıkarmaya yönelik provokatif davranış (trolling).
          </li>
          <li>
            • <strong>Cinsel içerik ve pornografi:</strong> müstehcen
            görsel/metin paylaşımı, cinsel içerikli materyal talebi veya
            yönlendirmesi; bu, reşit olmayan biriyle ilgiliyse ayrıca
            yasal işlem başlatılır ve yetkililere bildirilir.
          </li>
          <li>
            • <strong>Devlete ve millete karşı içerik:</strong> Türkiye
            Cumhuriyeti Devleti&apos;nin bölünmez bütünlüğünü, bayrağını,
            marşını veya Atatürk&apos;ü hedef alan aşağılayıcı/bölücü
            içerik; terör örgütü propagandası.
          </li>
          <li>
            • <strong>Şiddet ve yasa dışı faaliyet:</strong> gerçek şiddeti
            özendirme, silah/uyuşturucu ticareti, hackleme/DDoS
            hizmetlerinin paylaşımı veya reklamı.
          </li>
          <li>
            • <strong>Spam ve dolandırıcılık:</strong> istenmeyen toplu
            mesaj, sahte indirme linki, phishing, kimlik avı veya sahte
            hesap/başkasını taklit etme (impersonation).
          </li>
          <li>
            • <strong>Telif hakkı ihlali:</strong> başkasına ait mod,
            görsel veya metnin izinsiz ve kaynak belirtilmeden paylaşılması
            (bkz.{" "}
            <a
              href="/telif-hakki"
              className="font-semibold text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
            >
              Telif Hakkı
            </a>{" "}
            sayfası).
          </li>
          <li>
            • <strong>Kişisel veri paylaşımı:</strong> başka bir kullanıcının
            izni olmadan gerçek adı, adresi, telefon numarası gibi kişisel
            bilgilerini ifşa etmek (doxxing).
          </li>
        </ul>
      </section>

      <section>
        <H>2. Mod Paketleri ve İçerik Paylaşımı Kuralları</H>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>
            • Paylaştığın her mod/pack için lisans bilgisini doğru ve eksiksiz
            gir; lisansı olmayan veya izinsiz yeniden paketlenmiş içerik
            kaldırılır.
          </li>
          <li>
            • Sürüm (Game Version) ve loader bilgisini yanlış girmek
            (kullanıcıyı yanıltacak şekilde) ihlal sayılır.
          </li>
          <li>
            • Kötü amaçlı yazılım (virüs, keylogger, gizli madencilik
            kodu vb.) içeren dosya paylaşımı anında ve kalıcı olarak
            yasaklanır.
          </li>
        </ul>
      </section>

      <section>
        <H>3. Yaş Sınırı ve +18 İçerik</H>
        <p className="mt-2">
          Platform genel izleyici kitlesine (her yaşa) açıktır. Bu nedenle
          küfür/argo yoğun içerik, kaba şiddet görselleri veya +18 temalı
          tartışmalar topluluk alanlarında paylaşılamaz. Reşit olmayan
          kullanıcıları hedef alan uygunsuz mesajlaşma girişimleri sıfır
          tolerans ile ele alınır ve gerekli hâllerde yetkili mercilere
          bildirilir.
        </p>
      </section>

      <section>
        <H>4. Yaptırımlar</H>
        <p className="mt-2">
          İhlalin ciddiyetine göre aşağıdaki yaptırımlardan biri veya
          birden fazlası uygulanabilir; ağır ihlallerde (nefret söylemi,
          reşit olmayanları hedef alma, kötü amaçlı yazılım) aşamalar
          atlanarak doğrudan kalıcı yasaklama uygulanır:
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          <li>• Sözlü/yazılı uyarı ve içeriğin kaldırılması,</li>
          <li>• Geçici yasaklama (1, 7 veya 30 gün),</li>
          <li>• Kalıcı yasaklama,</li>
          <li>• Gerekli hâllerde yetkili makamlara bildirim.</li>
        </ul>
      </section>

      <section>
        <H>5. İtiraz Süreci</H>
        <p className="mt-2">
          Hakkınızda uygulanan bir moderasyon kararına haksız olduğunu
          düşünüyorsan{" "}
          <a
            href="/iletisim"
            className="font-semibold text-emerald-600 underline underline-offset-4 dark:text-emerald-400"
          >
            İletişim
          </a>{" "}
          sayfasından, kullanıcı adını ve itirazının gerekçesini belirterek
          bize ulaşabilirsin. İtirazlar ekibimiz tarafından incelenir ve
          sonuç sana bildirilir.
        </p>
      </section>

      <section>
        <H>6. Kuralların Güncellenmesi</H>
        <p className="mt-2">
          Bu kurallar, topluluğun büyümesiyle birlikte güncellenebilir.
          Önemli değişikliklerde topluluk sayfasındaki Duyurular
          bölümünden bilgilendirme yapılır.
        </p>
      </section>
    </ContentPage>
  );
}

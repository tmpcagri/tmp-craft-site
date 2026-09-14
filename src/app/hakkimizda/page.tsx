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

export default function HakkimizdaPage() {
  return (
    <ContentPage
      eyebrow="HAKKIMIZDA"
      title={<InlineLogo />}
      intro="Eğlenceli bir topluluk, güven veren bir yapı."
      variant="kurumsal"
      activePath="/hakkimizda"
    >
      <p>
        <InlineLogo /> en başında bir araya gelme sebebimiz eğlenceydi —
        bugün hâlâ öyle. Ama bir topluluğu gerçekten topluluk yapan şey
        eğlencenin kendisi değil, o eğlencenin içinde güvenle ve huzurla var
        olabilmektir. Biz bu yüzden eğlenceyi de güveni de aynı ciddiyetle
        koruruz.
      </p>

      <section>
        <H>İsmimizin Hikayesi</H>
        <p className="mt-2">
          <InlineLogo /> adını taşıdığı TMP baş harflerinden alır. 2023-2024
          yıllarında, ilk hedefimiz yalnızca TikTok&apos;ta oluşan bir
          kitleyi bir araya getirip temsil etmekti.
        </p>
        <p className="mt-2">
          Zamanla, aramıza katılan her yeni insan bu topluluğa kendinden bir
          şeyler kattı. TMP hiçbir zaman olduğu yerde durmadı; her zaman
          sürekli gelişmeyi hedefledi.
        </p>
      </section>

      <section>
        <H>Vizyonumuz</H>
        <p className="mt-2">
          Bugün TMP artık sadece bir kitleyi temsil eden bir isim değil. O
          kitlenin içindeki bireylerin birbirine tutunabildiği, birbirine
          gerçekten fayda sağlayabildiği bir zemin haline geldi. Bu site de
          tam olarak bu vizyonla var: üyelerimize destek olmak ve onlara
          değer katmak için.
        </p>
        <p className="mt-2">
          Çoğu topluluk yalnızca geride bıraktığı başarıları sayar. Biz
          farklı bakıyoruz: başarılarımızı gösterirken aynı zamanda
          geleceğimizin çizgisini de gösteririz — çünkü bugün geldiğimiz
          nokta, yarın nereye varacağımızın en somut kanıtıdır.
        </p>
      </section>

      <section>
        <H>TMP Olmak Ne Demek?</H>
        <p className="mt-2">
          TMP olmak, saygıyı ve sevgiyi yalnızca bilmek değil, onu bilinçli
          biçimde yaşamak demektir. Her TMP&apos;li bunun farkındadır ve
          davranışlarında saygıyı her zaman öncelikli tutar.
        </p>
        <p className="mt-2">
          Bu topluluğun bir parçası olmak bir ayrıcalıksa, beraberinde bir
          sorumluluk da getirir: saygıya, sevgiye ve barışa diğer
          insanlardan daha fazla özen göstermek.
        </p>
      </section>

      <section>
        <H>Her Birey Bir Değer</H>
        <p className="mt-2">
          &quot;Bir insan bin insanı etkiler&quot; sözüyle hareket ederiz.
          Bu yüzden topluluğumuzdaki her bireyin bilgisine ve deneyimine
          değer veririz — çünkü bu bilgi doğru kullanıldığında tek bir
          kişiye değil, binlerce topluluğa ve kuruluşa fayda sağlayabilir.
        </p>
      </section>

      <section>
        <H>Değerlerimiz</H>
        <p className="mt-2">
          Bizim için en önemli mesele hep aynı kaldı: <strong>saygı ve
          sevgi</strong>. &quot;Saygının olduğu yerde sevgi her zaman
          vardır&quot; ilkesiyle; yaş, cinsiyet, din, dil ve ırk fark
          etmeksizin herkese aynı özenle hizmet etmeyi hedefledik.
        </p>
        <p className="mt-2">
          Farklı etnik kökenlere duyduğumuz saygıyı her zaman önemli gördük.
          İnsan doğasına ve psikolojisine değer vererek her bireyin yanında
          olmaya çalıştık.
        </p>
      </section>

      <section>
        <H>Topluma Katkımız</H>
        <p className="mt-2">
          Bizim için topluluk olmak, kendi içimizle sınırlı kalmak
          değildir. SMA ve DMD gibi hastalıklarla mücadele eden bireylere ve
          şehit vakıflarına yaptığımız yardımlarla, bu sorumluluğu
          toplumun geneline de taşımaya çalıştık.
        </p>
      </section>
    </ContentPage>
  );
}

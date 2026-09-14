import ContentPage from "../content-page";
import { InlineLogo } from "../logo";

export default function TelifHakkiPage() {
  return (
    <ContentPage
      eyebrow="TELİF HAKKI"
      title="Telif Hakkı"
      intro={
        <>
          <InlineLogo /> üzerindeki içeriklerin telif durumuna dair
          bilgilendirme.
        </>
      }
      variant="kurumsal"
      activePath="/telif-hakki"
    >
      <p>
        Bu sitede yer alan <InlineLogo /> markası, logosu ve özgün
        metin/görsel içerikler © {new Date().getFullYear()} <InlineLogo />
        &apos;a aittir, tüm hakları saklıdır.
      </p>
      <p>
        Mod Paketleri kütüphanesinde listelenen mod, resource pack, data
        pack, shader ve eklentiler kendi orijinal geliştiricilerine aittir
        ve kendi lisansları kapsamında sunulmaktadır; <InlineLogo /> yalnızca
        bu içerikleri bir araya getiren bir dizin görevi görür.
      </p>
      <p>
        Telif hakkınızın ihlal edildiğini düşünüyorsanız, ilgili içeriğin
        bağlantısı ve hak sahipliğinize dair bilgilerle birlikte İletişim
        sayfasından bize ulaşın; bildirimi inceleyip gerekli işlemi
        yapacağız.
      </p>
      <p>
        Topluluk bölümünde bir konudaki tartışma olgunlaştığında, yapay zeka
        bu tartışmayı kalıcı ve tarafsız bir özet maddeye dönüştürür ve
        tartışmaya gerçek katkı sağlayan üyeleri kullanıcı adlarıyla, sıralı
        bir katkı listesinde bu maddenin altında gösterir. Madde
        yayınlanmadan önce 7 günlük bir itiraz penceresi açılır; bu süre
        içinde konudaki herkes düzeltme talep edebilir. Yayınlanan madde ve
        katkı listesi kalıcı olarak saklanır — bir konunun ham mesajları
        (paketlenmiş olsun olmasın) konunun açılışından 3 ay sonra
        sunucularımızdan tamamen silinir, geriye yalnızca paketlenmiş kalıcı
        özet ve katkı listesi kalır. Bir konuya mesaj yazarak bu sürece ve
        bilgilerinin bu şekilde işlenip kalıcı hale getirilmesine onay
        vermiş olursun; bunu istemiyorsan mesaj yazma. Kişisel verilerinin
        işlenmesine dair hakların için KVKK sayfamıza bakabilirsin —
        yayınlanmış, başka katkılarla ayrılamaz şekilde bütünleşmiş kalıcı
        bir maddenin yalnızca senin katkın nedeniyle geri alınması her zaman
        mümkün olmayabilir; bu durumda seninle dürüstçe ve KVKK&apos;da
        belirtilen süre içinde iletişime geçeriz.
      </p>
    </ContentPage>
  );
}

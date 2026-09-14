# TMP Craft — Hukuki Metinler (Taslak)

**Bu dosya bir metin taslağıdır, kod değildir.** Frontend tarafı bunu ilgili
sayfalara (`src/app/kvkk/page.tsx`, `src/app/gizlilik-politikasi/page.tsx`, ve
henüz var olmayan çerez politikası + kullanım şartları sayfaları) işleyecek.

**ÖNEMLİ UYARI:** Bu metinler bir yapay zeka tarafından, güncel mevzuat
araştırılarak (Ağustos 2026 itibarıyla) hazırlanmıştır ve gerçek kanun/madde
referansları içerir. Ancak bu bir **avukat onayının yerine geçmez**. Özellikle
KVKK madde 9 (yurt dışına veri aktarımı) ve sponsorlu içerik/reklam mevzuatı
sık değişen alanlardır — yayına almadan önce bir hukuk danışmanına
göstermeniz şiddetle önerilir. Belge sonunda kaynak listesi ve "senin karar
vermen gereken" açık maddeler var, onlar doldurulmadan yayına alınmamalı.

---

## 0. Yayından önce doldurulması/karar verilmesi gereken açık maddeler

1. **Veri sorumlusu iletişim kanalı** — Şu an placeholder metinler "İletişim
   sayfası"na yönlendiriyor. KVKK m.10 aydınlatma metninde somut bir iletişim
   yolu (e-posta önerilir, örn. `kvkk@cagrimedya.com` veya mevcut İletişim
   sayfası) net yazılmalı. Aşağıdaki taslakta "İletişim sayfası
   (cagrimedya.com/iletisim)" olarak bıraktım — istersen ayrı bir KVKK
   e-postası açtırırsın.
2. **Şahıs sitesi mi, şirket mi?** Taslak "TMP Craft" ibaresini şahıs
   işletmesi/bireysel proje olarak ele aldı, tüzel kişilik unvanı/vergi no
   içermiyor. Eğer ileride bir şirket kurulursa veri sorumlusu kimliği
   güncellenmeli.
3. **VERBİS kaydı: gerekmiyor.** Ana faaliyeti özel nitelikli veri işleme
   olmayan ve 50 çalışanın altındaki/100M TL bilanço altındaki veri
   sorumluları VERBİS'e kayıttan muaf (KVKK Kurumu kamuoyu duyurusu, bkz.
   kaynaklar). TMP Craft tek kişilik bir proje olduğu için bu istisna
   kapsamında — metinlerde VERBİS sicil no *yazılmadı*, bu doğru.
4. **Supabase'in Frankfurt'ta (AB/Almanya) barındırılması → KVKK m.9 yurt
   dışı aktarım sayılır.** Türkiye dışına aktarımdır (AB içinde olması
   otomatik muafiyet sağlamıyor, KVKK Kurulu henüz resmi bir "yeterli
   korumaya sahip ülkeler" listesi yayınlamadı). 01.06.2024'te yürürlüğe
   giren yeni m.9 rejimi şu sırayı öngörüyor: **yeterlilik kararı → uygun
   güvenceler (KVKK'nın yayınladığı standart sözleşme, bağlayıcı şirket
   kuralları) → arızi haller (ilgili kişinin açık rızası dahil)**. En
   pratik yol küçük bir site için: aşağıdaki taslakta olduğu gibi kullanıcıdan
   **açık rıza** almak (üyelik/Google girişi sırasında). Alternatif: Supabase
   ile KVKK standart sözleşmesi imzalamak (Supabase bir "veri işleyen"
   sıfatıyla buna genelde hazır DPA/SCC sunar) — bunu istersen ayrıca
   araştırırım.
5. **Sponsorlu içerik şu an sitede yok** (henüz sunucu tanıtım/reklam
   özelliği kodlanmamış). Kullanım Şartları'na ileriye dönük, "eğer
   sponsorlu içerik yayınlanırsa" şeklinde madde eklendi — özellik
   gerçekten eklenince aktif hale gelir.
6. **Site yaş sınırı.** Türk hukukunda internet siteleri için genel bir yaş
   sınırı yok (reşitlik 18, ama KVKK çocuk verisi konusunda özel bir
   düzenleme içermiyor — bkz. kaynaklar). Taslakta pratik bir yaklaşım
   önerdim: **13 yaş altına üyelik yok**, 13-18 arası kullanıcıya veli
   bilgilendirmesi notu. Bunu sen onaylamalısın, şu an teknik olarak yaş
   doğrulaması da yapılmıyor (kod tarafında ek iş gerekebilir).

---

## 1. KVKK Aydınlatma Metni

*Hedef dosya: `src/app/kvkk/page.tsx`*

### 1.1 Veri Sorumlusunun Kimliği

> 6698 sayılı Kişisel Verilerin Korunması Kanunu ("**KVKK**") m.3/1-ı ve m.10
> uyarınca, işbu Aydınlatma Metni'nde açıklanan kişisel verileriniz veri
> sorumlusu sıfatıyla **TMP Craft** ("**Site**", "**biz**") tarafından
> aşağıda açıklanan kapsamda işlenmektedir. Veri sorumlusuna
> [İletişim sayfası üzerinden] (cagrimedya.com/iletisim) ulaşabilirsiniz.
> TMP Craft, ana faaliyet konusu özel nitelikli kişisel veri işleme olmayan
> ve KVKK Kurumu tarafından belirlenen çalışan sayısı/mali bilanço
> eşiklerinin altında kalan bir veri sorumlusu olduğundan Veri Sorumluları
> Sicili'ne (VERBİS) kayıt yükümlülüğü bulunmamaktadır.

### 1.2 İşlenen Kişisel Veri Kategorileri

> Google ile giriş (Google OAuth) üzerinden hesap oluşturduğunuzda ve Site'yi
> kullandığınızda aşağıdaki kişisel verileriniz işlenir:
>
> - **Kimlik ve iletişim bilgileri:** Google hesabınızdan alınan ad-soyad
>   (kullanıcı adı olarak), e-posta adresi, profil fotoğrafı bağlantısı
>   (URL).
> - **Hesap ve işlem güvenliği bilgileri:** giriş yaptığınız sağlayıcı
>   ("google"), cihaz bilgisi, hesap oluşturma tarihi, son aktivite tarihi ve
>   türü.
> - **Topluluk ve içerik verileri:** diğer üyelere gönderdiğiniz özel
>   mesajların içeriği ve zaman damgası, ileride yayına alınacak topluluk
>   gönderileri (konu/yorum) içerikleri.
> - **Moderasyon verileri:** hakkınızda uygulanmışsa yasaklama süresi ve
>   yasaklama sebebi (yalnızca site yöneticisi tarafından girilir).
> - **İşlem güvenliği/log verileri:** 5651 sayılı Kanun uyarınca tutulması
>   zorunlu olan IP adresi ve erişim zaman kayıtları (bkz. Çerez Politikası).
>
> Site, Microsoft/Xbox/Minecraft hesap verisi **toplamaz** — bu entegrasyon
> kaldırılmıştır. Minecraft yüz görseli özelliği, herkese açık Mojang
> session-server API'sinden yalnızca girdiğiniz kullanıcı adına karşılık
> gelen genel/herkese açık skin verisini çeker; bu, sizin Google hesabınıza
> ait kişisel veri değildir ve hesabınızla ilişkilendirilmez.

### 1.3 Kişisel Verilerin İşlenme Amaçları

> Kişisel verileriniz; üyelik/oturum açma ve kimlik doğrulama işlemlerinin
> yürütülmesi, yetkilendirme seviyenizin (üye/moderatör/site sahibi)
> belirlenmesi, topluluk özelliklerinin (mesajlaşma, konu paylaşımı, oylama)
> sunulması, kural ihlallerine karşı moderasyon ve hesap güvenliğinin
> sağlanması, hukuki yükümlülüklerimizin (5651 sayılı Kanun kapsamındaki log
> tutma yükümlülüğü dahil) yerine getirilmesi ve talep/şikayetlerinizin
> yanıtlanması amaçlarıyla, bu amaçlarla sınırlı ve ölçülü şekilde işlenir.

### 1.4 Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi

> Kişisel verileriniz, Site'ye Google OAuth ile üye olmanız ve Site'yi
> kullanmanız sırasında elektronik ortamda otomatik yollarla toplanır.
> Hukuki sebepler KVKK m.5/2 kapsamında:
>
> - **(c) bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili
>   olması:** üyelik sözleşmesi/kullanım şartları çerçevesinde hesabınızın
>   oluşturulması ve hizmetlerin sunulması,
> - **(ç) hukuki yükümlülüğün yerine getirilmesi:** 5651 sayılı Kanun
>   kapsamındaki log/trafik bilgisi saklama yükümlülüğü,
> - **(f) meşru menfaat:** kural ihlallerinin tespiti, kötüye kullanımın
>   önlenmesi, hizmet güvenliğinin sağlanması,
>
> için işlenmektedir. Yurt dışına aktarım söz konusu olan veriler için (bkz.
> 1.5) ayrıca **açık rızanız** alınır.

### 1.5 Kişisel Verilerin Aktarılması

> Kişisel verileriniz; barındırma/veritabanı altyapı sağlayıcımız
> **Supabase Inc.** (sunucular Frankfurt, Almanya'da barındırılmaktadır) ile,
> yalnızca teknik altyapının işletilmesi amacıyla ve KVKK m.9 kapsamında
> **açık rızanıza** dayanılarak paylaşılmaktadır. Statik marka görselleri
> (logo vb.) **Cloudflare** altyapısı üzerinden servis edilir; bu, kişisel
> verinizin paylaşımı anlamına gelmez. Kişisel verileriniz, yasal
> zorunluluk hâlleri (mahkeme kararı, yetkili kamu kurumu talebi) dışında
> hiçbir üçüncü tarafa satılmaz, kiralanmaz veya pazarlama amacıyla
> paylaşılmaz.

### 1.6 Kişisel Verilerin Saklanma Süresi

> Kişisel verileriniz, hesabınız aktif olduğu sürece ve yukarıdaki amaçlar
> geçerli olduğu müddetçe saklanır. Hesabınızı sildiğinizde/site
> yöneticisi tarafından silindiğinde profil verileriniz derhal silinir.
> 5651 sayılı Kanun m.5 uyarınca tutulması zorunlu trafik/log bilgileri,
> ilgili yönetmelikte öngörülen 1 ila 2 yıllık süre boyunca ayrıca saklanır.
> Yasaklanmış kullanıcılara ait yasaklama kaydı, tekrar ihlali önlemek
> amacıyla (meşru menfaat) hesap silinene kadar tutulabilir.

### 1.7 İlgili Kişinin Hakları (KVKK m.11)

> KVKK m.11 uyarınca bize başvurarak:
>
> 1. Kişisel verinizin işlenip işlenmediğini öğrenme,
> 2. İşlenmişse buna ilişkin bilgi talep etme,
> 3. İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,
> 4. Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,
> 5. Eksik/yanlış işlenmişse düzeltilmesini isteme,
> 6. KVKK m.7 şartları çerçevesinde silinmesini/yok edilmesini isteme,
> 7. Yapılan düzeltme/silme işlemlerinin, verinin aktarıldığı üçüncü
>    kişilere bildirilmesini isteme,
> 8. Otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonuç
>    çıkmasına itiraz etme,
> 9. Kanuna aykırı işlenme sebebiyle zarara uğramanız hâlinde zararın
>    giderilmesini talep etme
>
> haklarına sahipsiniz. Taleplerinizi [İletişim sayfası] üzerinden veya
> KVKK Kurumu'nun belirlediği usullerle iletebilirsiniz; talebiniz
> KVKK m.13 uyarınca en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.

---

## 2. Gizlilik Politikası

*Hedef dosya: `src/app/gizlilik-politikasi/page.tsx`*

Bu politika, KVKK Aydınlatma Metni'ni tekrar etmeden, daha okunabilir/pratik
bir dille aynı bilgiyi tazeler ve teknik detayları (altyapı sağlayıcılar,
saklama, veri güvenliği) somutlaştırır.

### 2.1 Topladığımız Bilgiler
> - **Google ile giriş yaptığınızda:** ad-soyad, e-posta adresi, profil
>   fotoğrafı.
> - **Site'yi kullanırken:** cihaz bilgisi, son aktivite zamanı/türü, IP
>   adresi (güvenlik ve yasal log yükümlülüğü için).
> - **Topluluk özelliklerini kullandığınızda:** gönderdiğiniz özel
>   mesajların içeriği, (ileride) paylaşacağınız konu/yorum içerikleri.
> - Kredi kartı, adres, kimlik numarası gibi hassas ödeme/kimlik verisi
>   **toplamıyoruz** — Site şu an ücretli bir işlem içermiyor.

### 2.2 Bilgileri Nasıl Kullanıyoruz
> Hesabınızı tanımlamak, yetki seviyenizi belirlemek, topluluk
> özelliklerini (mesajlaşma vb.) çalıştırmak, kural ihlallerini
> moderasyon ekibimizin incelemesini sağlamak ve yasal yükümlülüklerimizi
> yerine getirmek için kullanırız. Reklam/pazarlama amaçlı profil
> çıkarımı (üçüncü taraf reklam ağlarına veri satışı, davranışsal
> hedefleme) **yapılmaz.**

### 2.3 Altyapı Sağlayıcılarımız (Alt İşleyenler)
> | Sağlayıcı | Rolü | Veri konumu |
> |---|---|---|
> | **Supabase Inc.** | Veritabanı, kimlik doğrulama (auth), dosya/oturum
> yönetimi | Frankfurt, Almanya (AB) |
> | **Cloudflare, Inc.** | Statik site görsellerinin (logo, marka
> görselleri) CDN üzerinden sunulması | Cloudflare'in genel CDN ağı;
> kişisel veri barındırmaz |
> | **Google LLC** | Google ile Giriş (OAuth) kimlik doğrulama sağlayıcısı | Google'ın kendi gizlilik politikası kapsamında |
>
> Bu sağlayıcılarla paylaşım yalnızca hizmetin çalışması için gerekli
> ölçüdedir; sağlayıcılar bizim adımıza "veri işleyen" sıfatıyla hareket
> eder, veriyi kendi amaçları için kullanamaz.

### 2.4 Veri Güvenliği
> Verileriniz Supabase'in sağladığı Row Level Security (RLS, satır bazlı
> erişim kontrolü) ile korunur — bir kullanıcı, yetkisi olmayan başka bir
> kullanıcının özel verisine veritabanı seviyesinde erişemez. Yönetici
> (service_role) anahtarı yalnızca sunucu tarafında, tarayıcıya hiç
> gönderilmeden kullanılır.

### 2.5 Saklama Süresi ve Hesap Silme
> Hesabınızı silmemizi talep ettiğinizde profiliniz ve ilişkili verileriniz
> (kullanıcı adı, avatar, mesajlarınız) veritabanından kalıcı olarak
> silinir. Yasal saklama yükümlülüğü olan log kayıtları (bkz. Çerez
> Politikası, 5651 sayılı Kanun) ayrı bir sürede saklanır.

### 2.6 Haklarınız
> KVKK m.11 kapsamındaki haklarınız için bkz. [KVKK Aydınlatma Metni].
> Sorularınız için [İletişim] sayfasından bize ulaşabilirsiniz.

---

## 3. Çerez (Cookie) Politikası

*Hedef: yeni sayfa, örn. `src/app/cerez-politikasi/page.tsx` — şu an
`cookie-consent.tsx` bileşeni var ama ayrı bir politika sayfası yok.*

KVKK Kurumu'nun "Çerez Uygulamaları Hakkında Rehber"i çerezleri dört
kategoriye ayırır: kesinlikle gerekli (zorunlu), işlevsel, performans/analitik,
reklam/pazarlama. Rehbere göre bir çerez ancak (a) iletişimin teknik olarak
sağlanması için **tek amaçlı** ise veya (b) kullanıcının açıkça talep ettiği
bir hizmet için **kesinlikle gerekli** ise, açık rıza almadan kullanılabilir.
Bunların dışındaki her çerez için önceden açık rıza şart.

> ### 3.1 Hangi Çerezleri/Depolamayı Kullanıyoruz
>
> TMP Craft şu an **yalnızca kesinlikle gerekli ve işlevsel** amaçlı
> depolama kullanır; reklam, izleme veya üçüncü taraf analitik çerezi
> **kullanmamaktadır**:
>
> | Ad/Tür | Amaç | Kategori | Süre |
> |---|---|---|---|
> | Supabase oturum çerezi (`sb-*`) | Giriş oturumunuzu sürdürmek | Kesinlikle gerekli | Oturum / yenilenebilir |
> | Tema tercihi (localStorage) | Açık/koyu tema tercihinizi hatırlamak | İşlevsel | Siz silene kadar |
> | Çerez bildirimi onayı (localStorage, "Anladım") | Çerez şeridini tekrar göstermemek | İşlevsel | Siz silene kadar |
>
> Bu kategoriler için, KVKK Çerez Rehberi'ndeki istisna kapsamına
> girdiklerinden (hizmetin sunulması için kesinlikle gerekli/talep
> ettiğiniz işlevi sağlıyor) ayrıca açık rızanız aranmaz; ancak sizi
> şeffaflık gereği bilgilendiriyoruz.
>
> **İleride** reklam veya analitik (örn. Google Analytics) eklenirse, bu
> politika güncellenecek ve o çerezler için **açık rızanız alınmadan**
> devreye alınmayacaktır.

### 3.2 Yasal Log Kayıtları (5651 Sayılı Kanun)
> 5651 sayılı "İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu
> Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun" m.5
> uyarınca, **yer sağlayıcı** sıfatıyla, Site üzerindeki trafik bilgilerini
> (IP adresi, erişim zamanı gibi) 1 yıldan az, 2 yıldan fazla olmamak üzere
> ilgili yönetmelikte belirlenen süre boyunca saklamakla ve bu bilgilerin
> doğruluğunu, bütünlüğünü ve gizliliğini korumakla yükümlüyüz. Bu kayıtlar
> yalnızca yetkili adli/idari makamların talebi üzerine paylaşılır.

### 3.3 Tarayıcı Ayarları
> Çerezleri/localStorage'ı tarayıcı ayarlarınızdan istediğiniz zaman
> silebilirsiniz; ancak oturum çerezini silerseniz tekrar giriş yapmanız
> gerekir.

---

## 4. Kullanım Şartları / Topluluk Kuralları

*Hedef: yeni sayfa, örn. `src/app/kullanim-sartlari/page.tsx`*

### 4.1 Kabul
> TMP Craft'a üye olarak veya Site'yi kullanarak bu Kullanım Şartları'nı
> kabul etmiş sayılırsınız. Kuralları ihlal etmeniz hâlinde hesabınız
> aşağıdaki 4.4'te açıklanan moderasyon sürecine tabi tutulabilir.

### 4.2 Yasaklı İçerik ve Davranışlar
> Aşağıdaki içerik ve davranışlar Site'de **kesinlikle yasaktır** ve hem bu
> sözleşmenin hem de Türkiye Cumhuriyeti mevzuatının ihlalidir:
>
> 1. **Müstehcen/+18 içerik** — Türk Ceza Kanunu ("**TCK**") m.226
>    kapsamında müstehcenlik suçu oluşturabilecek görsel, metin veya
>    bağlantı paylaşımı. Çocuklara yönelik/çocuk içerikli müstehcen
>    materyal paylaşımı ayrıca TCK m.226/3 kapsamında ağırlaştırılmış
>    cezai sorumluluk doğurur ve tespit edilmesi hâlinde derhal yetkili
>    makamlara bildirilir.
> 2. **Hakaret, aşağılama, nefret söylemi** — TCK m.125 (hakaret) ve ilgili
>    hükümler kapsamına girebilecek, bir kişinin onur/şeref/saygınlığını
>    hedef alan söylem; ayrımcılık veya nefret söylemi.
> 3. **Taciz, tehdit, zorbalık (siber zorbalık).**
> 4. **Telif hakkı ihlali** — başkasına ait mod, modpack, görsel, metin
>    veya kod paylaşımının izinsiz/kaynak gösterilmeden yapılması (bkz.
>    4.5).
> 5. **Kötü amaçlı yazılım, oyun içi hile/exploit dağıtımı, dolandırıcılık,
>    kimlik avı (phishing) bağlantıları.**
> 6. **Spam, otomatik/bot hesap kullanımı, yanıltıcı hesap taklidi
>    (impersonation).**
> 7. **Reşit olmayan kullanıcıları hedef alan uygunsuz iletişim.**
>
> Bu liste sınırlayıcı değildir; site yönetimi, açıkça kötü niyetli veya
> topluluğa zarar veren davranışları da bu kapsamda değerlendirme
> yetkisini saklı tutar.

### 4.3 Şikayet ve Moderasyon Süreci
> 1. **Şikayet:** Kural ihlali gördüğünüzü düşündüğünüz içerik/kullanıcıyı
>    [İletişim sayfası] veya (varsa) içerik üzerindeki "Şikayet Et"
>    özelliği ile bildirebilirsiniz.
> 2. **İnceleme:** Şikayet, yetkili moderatör veya site sahibi tarafından
>    incelenir.
> 3. **Yaptırım:** İhlalin ağırlığına göre sırasıyla veya doğrudan:
>    - **Uyarı,**
>    - **Geçici yasaklama** (1, 7 veya 30 gün — süre ihlalin ağırlığına
>      göre belirlenir),
>    - **Süresiz (kalıcı) yasaklama,**
>    - **Hesabın kalıcı olarak silinmesi**
>
>    uygulanabilir. Yasaklı bir kullanıcı Site'ye erişmeye çalıştığında
>    otomatik olarak bilgilendirme sayfasına yönlendirilir.
> 4. **İtiraz:** Yaptırıma itiraz etmek isterseniz [İletişim sayfası]
>    üzerinden site sahibine başvurabilirsiniz; nihai karar site sahibine
>    aittir.
> 5. Ağır ihlallerde (ör. TCK kapsamına giren suç şüphesi) hesap askıya
>    alınabilir ve mevzuatın gerektirdiği hâllerde yetkili makamlara
>    bildirim yapılabilir.

### 4.4 Hesap Yasaklama/Silme Koşulları
> - Geçici yasaklama süresince hesabınıza giriş yapamazsınız; hesabınız ve
>   verileriniz saklı kalır, süre dolunca erişim otomatik açılır.
> - Kalıcı silme, sizin talebiniz üzerine (KVKK m.11 kapsamındaki silme
>   hakkınız) veya ağır/tekrarlayan ihlal hâlinde site yönetimi kararıyla
>   uygulanır ve **geri alınamaz** — profiliniz, mesajlarınız ve
>   paylaşımlarınız kalıcı olarak silinir.
> - Yasal saklama yükümlülüğü bulunan kayıtlar (5651 sayılı Kanun
>   kapsamındaki log verisi gibi) hesap silinse dahi ilgili süre boyunca
>   ayrıca saklanabilir.

### 4.5 Telif Hakkı ve Paylaşılan İçerik Sorumluluğu
> - Site'ye mod, modpack, görsel veya başka bir eser paylaşan kullanıcı,
>   bu içeriği paylaşma hakkına sahip olduğunu (kendi eseri olduğunu veya
>   lisans/izinle paylaştığını) beyan ve taahhüt eder.
> - Paylaşılan içeriğin **5846 sayılı Fikir ve Sanat Eserleri Kanunu
>   ("FSEK")** kapsamında üçüncü bir kişinin telif hakkını ihlal ettiğinin
>   tespiti hâlinde, TMP Craft **5651 sayılı Kanun'un yer sağlayıcılara
>   ilişkin hükümleri** çerçevesinde hareket eder: hak sahibinin,
>   ihlal edildiğini iddia ettiği içeriğin URL'sini ve hak iddiasının
>   dayanağını belirterek yaptığı bildirim üzerine, içerik makul süre
>   içinde incelenir ve gerekiyorsa yayından kaldırılır ("bildir ve
>   kaldır" usulü).
> - Tekrarlayan telif ihlali yapan hesaplar 4.3'teki yaptırımlara tabidir.
> - Paylaşılan içerikten doğan üçüncü taraf hak iddialarında hukuki
>   sorumluluk içeriği paylaşan kullanıcıya aittir; TMP Craft yalnızca bir
>   yer sağlayıcı olarak hareket eder.

### 4.6 Sponsorlu İçerik Şeffaflığı
> Site'de sunucu/hizmet tanıtımı veya başka bir ticari işbirliği karşılığı
> yayınlanan içerikler, **Ticari Reklam ve Haksız Ticari Uygulamalar
> Yönetmeliği** uyarınca **"Sponsorlu İçerik"**, **"Reklam"** veya
> **"Tanıtım"** ibaresiyle, içeriğin geri kalanından kolayca ayırt
> edilebilecek şekilde (arka plana gizlenmeden, karmaşık etiket
> yığınlarına gömülmeden) açıkça etiketlenir. Bu özellik şu an Site'de
> aktif değildir; aktif hale geldiğinde bu madde uygulanmaya başlar.

### 4.7 Sorumluluğun Sınırlandırılması
> Site "olduğu gibi" sunulur. TMP Craft, kullanıcılar arasındaki
> anlaşmazlıklardan, kullanıcı tarafından paylaşılan içeriğin doğruluğundan
> veya üçüncü taraf hizmetlerin (Google, Supabase, Cloudflare) kesintiye
> uğramasından doğabilecek dolaylı zararlardan sorumlu tutulamaz.

### 4.8 Değişiklikler
> Bu şartlar, mevzuat değişikliği veya Site özelliklerinin gelişmesiyle
> güncellenebilir; önemli değişikliklerde Site üzerinden bilgilendirme
> yapılır.

---

## Kaynaklar

- [KVKK Kurumu — Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ](https://kvkk.gov.tr/Icerik/5443/AYDINLATMA-YUKUMLULUGUNUN-YERINE-GETIRILMESINDE-UYULACAK-USUL-VE-ESASLAR-HAKKINDA-TEBLIG)
- [KVKK Kurumu — İlgili Kişinin Hakları (m.11)](https://www.kvkk.gov.tr/Icerik/2036/Ilgili-Kisinin-Haklari)
- [6698 Sayılı Kişisel Verilerin Korunması Kanunu — mevzuat.gov.tr](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6698&MevzuatTur=1&MevzuatTertip=5)
- [KVKK Çerez Rehberi Uyarınca Web Siteleri İçin Uyum Yol Haritası — Mondaq](https://www.mondaq.com/turkey/data-protection/1667572/kvkk-%C3%87erez-rehberi-uyar%C4%B1nca-web-siteleri-%C4%B0%C3%A7in-uyum-yol-haritas%C4%B1)
- [5651 Sayılı Kanun Hakkında Bilinmesi Gerekenler — Batur & Bölükbaşı](https://www.batur.av.tr/blog-post/5651-sayili-kanun-hakkinda-bilinmesi-gerekenler-ve-sorular)
- [5651 Sayılı İnternet Kanunu m.8 ve 8/A Değerlendirmesi — Ersan Şen Hukuk](https://sen.av.tr/tr/makale/5651-sayili-internet-kanununun-8-ve-8A-maddelerinin-degerlendirilmesi)
- [İnternetten İçeriğin Çıkarılması ve Erişimin Engellenmesi — Tahancı Hukuk](https://www.tahanci.av.tr/internetten-icerigin-cikarilmasi-ve-erisimin-engellenmesi-icerik-sildirme/)
- [Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği — Lexpera](https://www.lexpera.com.tr/mevzuat/yonetmelikler/ticari-reklam-ve-haksiz-ticari-uygulamalar-yonetmeligi)
- ["Influencer" Paylaşımları ve Reklam Kurulu Kararları — Lexology](https://www.lexology.com/library/detail.aspx?g=04bccf36-2dee-43c0-ba0f-06697707b893)
- [Yer Sağlayıcıların Telif Hakkı İhlalinden Sorumluluğu — Gün + Partners](https://gun.av.tr/tr/goruslerimiz/guncel-yazilar/yer-saglayicilarin-telif-hakki-ihlalinden-kaynaklanan-hukuki-ve-cezai-sorumlulugu)
- [KVKK Kamuoyu Duyurusu — VERBİS Kayıt İstisnası](https://www.kvkk.gov.tr/Icerik/8388/KAMUOYU-DUYURUSU)
- [TCK m.125 Hakaret Suçu — Kadim Hukuk](https://kadimhukuk.com.tr/makale/hakaret-sucu-cezasi-tck-125-madde/)
- [TCK m.226 Müstehcenlik Suçu — Kadim Hukuk](https://kadimhukuk.com.tr/makale/mustehcenlik-sucu-ve-cezasi/)
- [KVKK'da Çocukların Kişisel Verileri — Eralp Avukatlık](https://www.eralp.av.tr/kvkk-ve-gdpra-gore-cocuk-verilerinin-islenmesi/)
- [2024 KVKK Değişiklikleri (m.9 Yurt Dışı Aktarım) — Erdem & Erdem](https://www.erdem-erdem.av.tr/bilgi-bankasi/kisisel-verilerin-korunmasi-kanununda-neler-degisti)
- [KVKK Kurumu — Kişisel Verilerin Yurt Dışına Aktarılması Rehberi](https://www.kvkk.gov.tr/Icerik/8142/Kisisel-Verilerin-Yurt-Disina-Aktarilmasi-Rehberi)

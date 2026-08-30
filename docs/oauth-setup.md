# Google & Microsoft OAuth kurulumu (Supabase)

Supabase projesi: **tmp-craft** (Frankfurt)
Supabase callback URL (her iki sağlayıcıda da bu adres kullanılacak):

```
https://gyijgygktnqawniwybcm.supabase.co/auth/v1/callback
```

Bu adımların hepsi Çağrı'nın kendi Google / Microsoft hesabıyla ilgili
konsollarda tıklanması gereken adımlar — burada sadece rehber var, kimse
onun adına hesap/uygulama oluşturamaz.

---

## 1. Google OAuth

1. https://console.cloud.google.com adresine git, üstteki proje seçiciden
   yeni bir proje oluştur (ör. "TMP Craft") ya da mevcut bir proje seç.
2. Sol menü → **APIs & Services → OAuth consent screen**.
   - User type: **External**.
   - App name: `TMP Craft`, destek e-postası ve developer contact e-postasını
     kendi e-postan olarak gir.
   - Scopes adımında ekleme yapmana gerek yok, varsayılan (`email`,
     `profile`, `openid`) yeterli.
   - "Test users" adımı: uygulama henüz "Testing" modundaysa sadece
     eklediğin test kullanıcıları giriş yapabilir — kendi Google hesabını
     ekle. (İleride herkese açmak için consent screen'i "Production"a alıp
     Google'ın doğrulamasından geçirmek gerekir; şimdilik gerekli değil.)
3. Sol menü → **APIs & Services → Credentials → + Create Credentials →
   OAuth client ID**.
   - Application type: **Web application**.
   - Name: `TMP Craft — Supabase`.
   - **Authorized redirect URIs** → yukarıdaki Supabase callback URL'ini
     ekle: `https://gyijgygktnqawniwybcm.supabase.co/auth/v1/callback`
   - Create'e bas. Açılan pencerede **Client ID** ve **Client secret**'ı
     kopyala (bir yere geçici olarak kaydet, tekrar gösterilmeyecek).
4. Supabase Dashboard → proje **tmp-craft** → **Authentication → Sign In /
   Providers → Google**.
   - Enable Sign in with Google: **açık**.
   - Client ID / Client Secret alanlarına 3. adımdaki değerleri yapıştır.
   - Save.

---

## 2. Microsoft (Azure / Entra ID) OAuth

1. https://portal.azure.com → arama çubuğundan **Microsoft Entra ID**
   (eski adıyla Azure Active Directory) sayfasına git.
2. Sol menü → **App registrations → + New registration**.
   - Name: `TMP Craft`.
   - Supported account types: genelde **"Accounts in any organizational
     directory and personal Microsoft accounts"** seçilmeli — hem iş/okul
     hem de kişisel Microsoft hesaplarıyla giriş için (site herkese açık
     olacaksa bu). Sadece kendi hesabınla test edeceksen daha kısıtlı bir
     seçenek de olur, ama genel kullanıcılar için en geniş seçenek gerekir.
   - Redirect URI: platform **Web** seç, adres olarak yukarıdaki Supabase
     callback URL'ini gir.
   - Register'a bas.
3. Açılan uygulama sayfasında **Overview**'dan **Application (client) ID**'yi
   kopyala.
4. Sol menü → **Certificates & secrets → + New client secret**.
   - Bir açıklama ve süre seç (ör. 24 ay), Add'e bas.
   - Oluşan secret'ın **Value** sütunundaki değeri hemen kopyala (sayfadan
     ayrılınca bir daha görünmez).
5. Supabase Dashboard → **Authentication → Sign In / Providers → Azure**.
   - Enable Sign in with Azure: **açık**.
   - Client ID → Application (client) ID.
   - Client Secret → 4. adımdaki secret value.
   - **Azure Tenant URL / Tenant ID** alanı varsa: genel kullanıcılara açık
     olması için `common` yaz (hem iş/okul hem kişisel hesapları kabul
     eder). Sadece kendi organizasyonun için istersen Directory (tenant)
     ID'yi Azure Overview sayfasından kopyalayabilirsin.
   - Save.

---

## 2b. Minecraft/Xbox hesap bağlama (Microsoft girişine ek)

Site, Microsoft ile giriş yapan kullanıcıların Minecraft kullanıcı adı/UUID
bilgisini de otomatik çekiyor (standart launcher auth zinciri: Xbox Live →
XSTS → Minecraft services, `src/app/lib/minecraft.ts`). Bunun için ekstra
bir Azure ayarı **gerekmiyor** — `XboxLive.signin offline_access` scope'u
kod tarafında (`signInWithAzure`) isteniyor ve kullanıcı Microsoft'un
standart onay ekranında bunu onaylıyor; Azure Portal'da manuel bir "API
permission" eklemek gerekmiyor (aynı Minecraft launcher'ların kullandığı
public OAuth akışı). Tek şart: 2. adımdaki "Supported account types"
seçiminin kişisel Microsoft hesaplarını da kapsaması (zaten öyle önerildi).

Kullanıcının Microsoft hesabında Xbox profili veya Minecraft lisansı yoksa
zincir sessizce `null` döner, giriş yine de başarılı olur — sadece
Minecraft alanları boş kalır.

## 3. Site tarafında (kod, benim yapacağım / yapılmış olan)

Hepsi kod tarafında tamamlandı:

- `src/app/lib/supabase/client.ts` / `server.ts` — Supabase client factory'leri.
- `src/app/lib/auth-client.ts` — `signInWithGoogle()`, `signInWithAzure()`
  (Microsoft için `XboxLive.signin offline_access` scope'u da isteniyor,
  bkz. 2b), `signOut()`. `AccountButton`'a bağlı.
- `src/app/auth/callback/route.ts` — `code`'u `exchangeCodeForSession` ile
  session'a çevirir; Microsoft girişiyse aynı istekte Minecraft profilini
  çözüp `profiles` tablosuna yazar (bkz. 2b).
- Provider tarafında geri dönen `provider` değeri Google için `"google"`,
  Azure için `"azure"` olur — `supabase/migrations/0001_profiles_and_permissions.sql`
  içindeki `handle_new_user` bunu `profiles.provider` alanına otomatik yazıyor.

## Kontrol listesi (test etmeden önce)

- [ ] Google Cloud: OAuth consent screen dolduruldu, test kullanıcı eklendi
- [ ] Google Cloud: OAuth client ID oluşturuldu, redirect URI doğru
- [ ] Supabase: Google provider açık, Client ID/Secret girildi
- [ ] Azure: App registration yapıldı, redirect URI doğru
- [ ] Azure: Client secret oluşturuldu ve kopyalandı
- [ ] Supabase: Azure provider açık, Client ID/Secret girildi
- [ ] `supabase/migrations/0001_profiles_and_permissions.sql` Supabase SQL
      Editor'de çalıştırıldı (bkz. dosyanın başındaki not)
- [ ] `supabase/migrations/0002_minecraft_profile.sql` da çalıştırıldı
      (0001'den sonra)
- [ ] Microsoft ile giriş test edildi, `profiles` tablosunda
      `minecraft_username`/`minecraft_uuid` doldu (Minecraft hesabı olan
      bir Microsoft hesabıyla test edilmeli)

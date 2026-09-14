# TMP Craft — Ajan Ofisi Orkestrasyon Kuralları

Bu proje bir ajan ofisi olarak yönetilir. `.claude/agents/` altında 13 uzman ajan tanımlıdır (üretim: frontend-builder, supabase-agent, minecraft-data, terminal-ops — denetim: security-auditor, code-reviewer, qa-tester, a11y-auditor, perf-auditor — ürün: ux-designer, ux-psychologist, seo-researcher, content-editor).

## Orkestratör (sen) kuralları
- **Sen kod yazmazsın.** Edit/Write gereken her işi ilgili ajana devredersin. Tek istisna: 3 satırdan kısa acil düzeltme.
- **Bağımsız işleri paralel çalıştırırsın**, sıraya dizmezsin — birbirine bağımlı olmayan görevleri aynı anda birden fazla ajana ver.
- **Her adımdan sonra kullanıcıya Türkçe 1-2 cümle rapor verir, durursun.** Uzun döküm yazmazsın.
- **5 dakikadan uzun sessiz kalmazsın.** Kullanıcı telefondan takip ediyor.
- **Onay gereken işleri biriktirip tek listede sunarsın**, tek tek sormazsın.
- **İhtiyaçlarını (API anahtarı, karar, erişim, görsel) `IHTIYACLAR.md` dosyasına yazar ve kullanıcıya bildirirsin.** Eksik bir şey yüzünden sessizce beklemezsin.

## Denetim Kurulu
Anlamlı her değişiklikten sonra tek denetçiye güvenmezsin:
- **Kod değiştiyse** → security-auditor + code-reviewer + qa-tester (paralel).
- **Arayüz değiştiyse** → yukarıdakilere ek olarak a11y-auditor + ux-psychologist (paralel).
- **Sayfa eklendiyse** → yukarıdakilere ek olarak perf-auditor + seo-researcher (paralel).

Bulguları birleştirir, tekrarları elersin, çelişenleri işaretlersin, kullanıcıya **tek liste** verirsin: Kritik / Yüksek / Orta. İki denetçi aynı yeri farklı yorumladıysa ikisini de gösterirsin, kararı kullanıcı verir. Denetim kurulunu her küçük değişiklikte değil, **anlamlı kilometre taşlarında** toplarsın.

## Proje bağlamı (her ajan bilmeli)
Kişisel içerik + topluluk sitesi. Yazılar ve yayınlar, Minecraft mod ve modpack verileri, build farm gibi yapıların inşa rehberleri, oynanabilir sunucu listeleri.

Değişmez kurallar:
- Bedrock ve Java ayrı ekosistemlerdir. Java'da Forge/Fabric/NeoForge/Quilt, Bedrock'ta add-on ve behavior/resource pack. Veri modelinde, filtrelerde ve arayüzde bu ayrım her zaman net olmalı. Java modunu Bedrock kullanıcısına göstermek bu projede bug sayılır.
- Sürüm uyumluluğu çok-çoka bir ilişkidir; tek bir sürüm alanı yetmez.
- Modpack mod değildir; ayrı varlık olarak modellenir.
- Build rehberlerinde "hangi sürümde çalışır" zorunlu alandır; bu yapılar sürüm değişince bozulur.
- Auth: Supabase üzerinden yalnızca Google OAuth (Microsoft/Azure kaldırıldı, bkz. TODO.md — tekrar eklemeye çalışılmamalı).
- Her tabloda RLS açık ve politikaları yazılmış olacak. service_role anahtarı asla client tarafına gitmez.
- Topluluk bölümü (konu, mesaj, oylama, moderasyon) en yüksek riskli alandır.

---

@AGENTS.md

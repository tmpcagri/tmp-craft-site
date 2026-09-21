"use client";

import { useState } from "react";

// R2'nin pub-*.r2.dev domaini geliştirme amaçlı, CDN önbelleklemesi yok
// ve hız sınırlaması var -- bu yüzden bazen ilk istek başarısız oluyor ve
// tarayıcı kendiliğinden tekrar denemiyor (kullanıcı F5 atana kadar
// görsel hiç gelmiyor). Bu bileşen:
// 1) Görsel yüklenemezse (onError) artan gecikmeyle (cache-busting query
//    param ile) en fazla 3 kez tekrar dener -- görsel gelirse hiç devreye
//    girmiyor, sadece hata anında aktifleşiyor.
// 2) Varsayılan olarak native `loading="lazy"` kullanıyor -- sayfa scroll
//    edilip görsel viewport'a yaklaşana kadar tarayıcı isteği hiç
//    başlatmıyor, böylece RAM/bant genişliği tüm sayfadaki görselleri
//    aynı anda çekmeye çalışmıyor. Hero/sayfa arka planı gibi İLK
//    GÖRÜNÜMDE zaten görünen görseller için `priority` ile eager'a
//    geçiriliyor.
// ÖNEMLİ: src değişince attempt sayacının sıfırlanması için, döngüyle
// değişen görsellerde (hero slider/background gallery gibi) çağıran
// tarafın `key={src}` geçmesi gerekiyor -- remount ile sıfırlanıyor. Yeni
// bir sayfaya geçiş de component'i remount ettiği için oradaki görseller
// otomatik olarak sıfırdan (attempt=0) yüklenmeye/denenmeye başlıyor.
export default function RetryImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  // İlk görünümde (viewport'ta hemen görünen hero/arka plan gibi) true
  // geç -- lazy'i devre dışı bırakıp hemen yükletir.
  priority?: boolean;
}) {
  const [attempt, setAttempt] = useState(0);
  const maxAttempts = 3;

  if (!src) return null;

  const resolvedSrc =
    attempt === 0 ? src : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- moderatör tarafından yönetilen, R2'den gelen görsel
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        if (attempt < maxAttempts) {
          setTimeout(() => setAttempt((a) => a + 1), 500 * (attempt + 1));
        }
      }}
    />
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AccountButton from "./account-button";
import type { NavLink } from "./lib/content";
import type { CurrentUser } from "./lib/auth";
import Logo from "./logo";
import MenuToggle from "./menu-toggle";
import NotificationBell from "./notification-bell";
import SearchBar from "./search-bar";

export default function Navbar({
  className = "",
  logoText,
  navLinks,
  user,
  notifications,
}: {
  className?: string;
  logoText: string;
  navLinks: NavLink[];
  user: CurrentUser;
  // Bazı sayfaların (ör. Topluluk) kendi bildirim listesi var -- verilmezse
  // varsayılan genel NotificationBell kullanılıyor.
  notifications?: React.ReactNode;
}) {
  // Navbar'ın küçülmesi scroll pozisyonuna SÜREKLİ bağlı (0-40px arası
  // ham bir oran) -- önceden bir eşik değerinde (scrollY>40) tek seferde
  // "compact" class'ına atlıyordu, bu da padding/blur/gölge gibi
  // transition'ı desteklemeyen özelliklerde ani bir "sıçrama" yaratıyordu.
  // Aşağı kaydırırken bu sıçrama fark edilmiyordu (dikkat aşağıdaydı) ama
  // yukarı kaydırırken üstte tam o an gerçekleştiği için göze çarpıyordu.
  // Artık her scroll event'inde 0-1 arası bir oran hesaplanıp padding/
  // arka plan opaklığı/blur/gölge hepsi bu orana göre px cinsinden inline
  // style ile sürekli/kesintisiz güncelleniyor -- iki yönde de birebir
  // aynı, sıçramasız davranış.
  const [scrollT, setScrollT] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);

  // Mobil genişlikte (sm altı) logo + arama kutusu + sağ üstteki hesap/
  // bildirim kümesi normal ("full") boyutlarıyla asla yan yana sığmıyor --
  // sığmayınca grid hücreleri birbirinin üzerine biniyordu (kullanıcının
  // bildirdiği "menü yarım/kısmi görünüyor" bug'ı buydu, animasyon
  // sorunundan tamamen ayrı bir şeydi). Dar ekranda scroll'dan bağımsız
  // olarak sürekli compact göster.
  useEffect(() => {
    const COMPACT_RANGE = 40;
    const update = () => {
      const t = Math.min(Math.max(window.scrollY, 0), COMPACT_RANGE) / COMPACT_RANGE;
      setScrollT(t);
      setIsNarrow(window.innerWidth < 640);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const t = isNarrow ? 1 : scrollT;
  const compact = t >= 1;
  const paddingY = 24 - t * 12;
  // Bildirim/hesap kümesi artık navbar'ın kendi grid'i İÇİNDE, aynı scroll
  // oranına göre hafifçe küçülüyor -- önceden ayrı, sabit boyutlu bir fixed
  // eleman olarak bağımsız duruyordu.
  const controlsScale = 1 - t * 0.15;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-20 grid grid-cols-[auto_1fr_auto] items-center gap-3 px-6 sm:px-10 ${className}`}
      style={{
        paddingTop: paddingY,
        paddingBottom: paddingY,
        backgroundColor: `color-mix(in srgb, var(--background) ${Math.round(t * 72)}%, transparent)`,
        backdropFilter: t > 0 ? `blur(${t * 20}px)` : undefined,
        boxShadow: t > 0 ? `0 1px 2px rgba(0,0,0,${t * 0.05})` : undefined,
      }}
    >
      <div className="flex items-center gap-4 justify-self-start">
        <MenuToggle logoText={logoText} navLinks={navLinks} />
        <Link href="/">
          <Logo compact={compact} hideWordmarkOnMobile />
        </Link>
      </div>
      <SearchBar compact={compact} />
      <div
        className="flex items-center gap-3 justify-self-end"
        style={{ transform: `scale(${controlsScale})`, transformOrigin: "right center" }}
      >
        {notifications ?? <NotificationBell />}
        <AccountButton avatarUrl={user?.avatarUrl} name={user?.name} />
      </div>
    </nav>
  );
}

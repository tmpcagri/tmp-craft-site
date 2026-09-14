"use client";

import { useAutoScroll } from "./lib/use-auto-scroll";

type FeedPost = { user: string; text: string };

// Topluluk kartına "canlı sohbet" hissi veren dekoratif akış -- gerçek
// mesajlar değil, kullanıcı adları kasıtlı olarak blurlu/maskelenmiş.
// Kartın farklı köşelerinde ayrı ayrı sütunlar halinde, dağınık bir
// düzende kullanılmak üzere tasarlandı. Aşağıdan yukarı sürekli kayar,
// tıklanamaz (pointer-events-none).
export const feedColumnA: FeedPost[] = [
  { user: "K***a92", text: "#RedstoneUstasi yeni devresini paylaştı" },
  { user: "M0dcu_**", text: "#YeniModpack beta sürümü çıktı" },
  { user: "El*f.mc", text: "#TasarımYarışması için oy verin" },
  { user: "Zey**p_", text: "#RedstoneUstasi otomatik çiftlik paylaştı" },
];

export const feedColumnB: FeedPost[] = [
  { user: "Y**uf_TE", text: "#SpeedrunTaktik sunucu rekoru kırıldı" },
  { user: "B*rakBuild", text: "#KıyıKasabası tamamlandı, harika oldu" },
  { user: "Ozan**", text: "#SunucuTuru canlı yayında başlıyor" },
  { user: "C*n_craft", text: "#EtkinlikZamanı bu hafta sonu buluşma var" },
];

export function CommunityFeedColumn({
  posts,
  speed = 0.3,
  className = "",
}: {
  posts: FeedPost[];
  speed?: number;
  className?: string;
}) {
  const { ref: trackRef } = useAutoScroll<HTMLDivElement>("vertical", { speed });
  const track = [...posts, ...posts];

  return (
    <div
      className={`pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] ${className}`}
    >
      <div
        ref={trackRef}
        className="flex h-full flex-col gap-2.5 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {track.map((post, i) => (
          <div
            key={i}
            aria-hidden={i >= posts.length}
            className="flex shrink-0 items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2.5 backdrop-blur-sm"
          >
            <span className="shrink-0 select-none whitespace-nowrap font-sans text-xs font-bold text-white/50 blur-[2px]">
              {post.user}
            </span>
            <span className="truncate font-sans text-sm text-white/90">
              {post.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Üye avatarı baloncukları -- gerçek bir platform logosu değil, feed'deki
// blurlu kullanıcı adlarıyla aynı mantıkta, baş harfi gösteren renkli
// avatar baloncukları. Telif riski yok, sayıca da azaltıldı (3 tane).
const avatarBubbles: {
  initial: string;
  bg: string;
  left: string;
  delay: string;
  duration: string;
}[] = [
  { initial: "K", bg: "bg-fuchsia-500", left: "12%", delay: "0s", duration: "8.5s" },
  { initial: "Y", bg: "bg-sky-500", left: "50%", delay: "3.5s", duration: "9s" },
  { initial: "E", bg: "bg-emerald-500", left: "82%", delay: "6s", duration: "7.8s" },
];

export function AvatarBubbles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute overflow-hidden ${className}`}>
      {avatarBubbles.map((bubble, i) => (
        <span
          key={i}
          className={`animate-float-up absolute flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg ${bubble.bg}`}
          style={{
            left: bubble.left,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        >
          {bubble.initial}
        </span>
      ))}
    </div>
  );
}

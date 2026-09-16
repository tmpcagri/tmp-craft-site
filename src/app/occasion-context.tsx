"use client";

import { createContext, useContext } from "react";
import type { OccasionMessageAnimation, OccasionMessageStyle, OccasionTheme } from "./lib/content";

export type ActiveOccasion = {
  theme: OccasionTheme;
  message: string;
  messageAnimation: OccasionMessageAnimation;
  messageStyle: OccasionMessageStyle;
};

const defaultOccasion: ActiveOccasion = {
  theme: "none",
  message: "",
  messageAnimation: "static",
  messageStyle: "normal",
};

const OccasionContext = createContext<ActiveOccasion>(defaultOccasion);

export function OccasionProvider({
  value,
  children,
}: {
  value: ActiveOccasion;
  children: React.ReactNode;
}) {
  return (
    <OccasionContext.Provider value={value}>
      {children}
    </OccasionContext.Provider>
  );
}

// Aktif özel gün temasını (VE rozetin yanında gösterilecek mesaj/animasyon/
// stilini) okumak için -- Logo gibi ağacın her yerinden import edilen
// bileşenler, hiçbir prop almadan bunları buradan öğreniyor.
export function useOccasion(): ActiveOccasion {
  return useContext(OccasionContext);
}

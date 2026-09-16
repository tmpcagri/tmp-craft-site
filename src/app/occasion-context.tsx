"use client";

import { createContext, useContext } from "react";
import type { OccasionTheme } from "./lib/content";

const OccasionContext = createContext<OccasionTheme>("none");

export function OccasionProvider({
  theme,
  children,
}: {
  theme: OccasionTheme;
  children: React.ReactNode;
}) {
  return (
    <OccasionContext.Provider value={theme}>
      {children}
    </OccasionContext.Provider>
  );
}

// Aktif özel gün temasını okumak için -- Logo gibi ağacın her yerinden
// import edilen bileşenler, hiçbir prop almadan hangi temanın aktif
// olduğunu (none/resmi/yas/dini) buradan öğreniyor.
export function useOccasion(): OccasionTheme {
  return useContext(OccasionContext);
}

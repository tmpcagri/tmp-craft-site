import type { OccasionTheme, SpecialOccasion } from "./content";

// Elle seçilen tema her zaman önce gelir (manuel açma/kapama, admin'in
// "şimdi hemen aç" demesi için). "none" ise ve otomatik zamanlama açıksa,
// bugünün tarihi programlanmış dönemlerden birinin (schedule) aralığına
// denk geliyorsa o dönemin teması devreye giriyor -- ilk eşleşen kazanır.
// Tarihler "YYYY-MM-DD" (gün hassasiyeti, saat dilimi karışıklığı olmasın
// diye salt string karşılaştırması yapıyoruz).
export function resolveActiveTheme(
  occasion: SpecialOccasion,
  now: Date = new Date(),
): OccasionTheme {
  if (occasion.manualTheme !== "none") return occasion.manualTheme;
  if (!occasion.autoScheduleEnabled) return "none";

  const today = now.toISOString().slice(0, 10);
  const active = occasion.schedule.find(
    (period) => today >= period.startDate && today <= period.endDate,
  );
  return active?.theme ?? "none";
}

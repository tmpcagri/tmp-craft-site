export type Trend = {
  category: string;
  topic: string;
  count: number;
};

export const trends: Trend[] = [
  { category: "Güncellemeler", topic: "1.21.2 hataları", count: 212 },
  { category: "Güncellemeler", topic: "Yeni minderler", count: 154 },
  { category: "Güncellemeler", topic: "Meşe yaprakları", count: 98 },
  { category: "Güncellemeler", topic: "Yeni snapshot", count: 76 },
  { category: "Gündem", topic: "YusufTE'nin speedrun taktiği", count: 301 },
  { category: "Gündem", topic: "poyzun hayatta kalma evi mükemmel", count: 189 },
  { category: "Gündem", topic: "Microsoft yine bildiğini yaptı", count: 445 },
].sort((a, b) => b.count - a.count);

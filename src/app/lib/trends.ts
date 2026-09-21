export type Trend = {
  category: string;
  topic: string;
  count: number;
};

// Gerçek gündem/trend verisi henüz yok (topluluk özelliği kilitli, bkz.
// /topluluk) -- sahte/uydurma "trend" gösterip canlıymış izlenimi
// vermemek için bilerek boş. Gerçek veri geldiğinde buraya eklenecek.
export const trends: Trend[] = [];

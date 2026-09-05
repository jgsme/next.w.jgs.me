import { MEDIA_BASE_URL } from "./config";

// 元画像をそのまま og:image にすると、大きい画像で unfurl 側が諦める
// (X は 5MB 上限)。Image Transformations を噛ませて幅を落とす。
// packages/web/utils/thumbURL.ts と同じ手法。onerror=redirect が無いと
// 無料枠 (月 5,000 unique) を超えたときに変換自体が失敗して og:image が
// 壊れる。付けておけば原寸へフォールバックするので unfurl は生き残る。
export function ogImageURL(id: string, ext: string): string {
  return `${MEDIA_BASE_URL}/cdn-cgi/image/width=1200,format=auto,onerror=redirect/${id}.${ext}`;
}

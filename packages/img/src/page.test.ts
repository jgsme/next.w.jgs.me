import { describe, expect, it } from "vitest";
import { ogImageURL } from "./page";

const ID = "a".repeat(64);

describe("ogImageURL", () => {
  // 元画像が大きいと unfurl 側が諦める (X は 5MB 上限)。変換を噛ませる。
  it("Image Transformations を経由した URL を返す", () => {
    expect(ogImageURL(ID, "png")).toBe(
      `https://r2.jgs.me/cdn-cgi/image/width=1200,format=auto,onerror=redirect/${ID}.png`,
    );
  });
});

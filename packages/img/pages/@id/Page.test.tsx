import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ImageData } from "./+data";

const ID = "a".repeat(64);

function data(over: Partial<ImageData> = {}): ImageData {
  return {
    id: ID,
    ext: "png",
    direct: `https://r2.jgs.me/${ID}.png`,
    width: 1200,
    height: 800,
    created: "2026-09-04 12:00:00",
    ...over,
  };
}

let current: ImageData = data();
vi.mock("vike-react/useData", () => ({ useData: () => current }));

const { default: Page } = await import("./+Page");
const { Head } = await import("./+Head");

function render(d: ImageData, node: () => React.ReactElement) {
  current = d;
  return renderToStaticMarkup(node());
}

describe("+Page", () => {
  it("画像の直リンクと寸法を出す", () => {
    const html = render(data(), () => <Page />);
    expect(html).toContain(`src="https://r2.jgs.me/${ID}.png"`);
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="800"');
  });

  it("寸法が無ければ width/height 属性を出さない", () => {
    const html = render(data({ width: null, height: null }), () => <Page />);
    expect(html).not.toContain("width=");
    expect(html).not.toContain("height=");
  });

  // 出典の表示をやめた結果、他所由来の文字列がページに出なくなった。
  it("外部へのリンクを一つも出さない", () => {
    const html = render(data(), () => <Page />);
    expect(html).not.toContain("<a ");
  });
});

describe("+Head", () => {
  it("og:image は Image Transformations 経由", () => {
    const html = render(data(), () => <Head />);
    expect(html).toContain(
      `content="https://r2.jgs.me/cdn-cgi/image/width=1200,format=auto,onerror=redirect/${ID}.png"`,
    );
    expect(html).toContain('content="summary_large_image"');
    expect(html).toContain(`content="https://i.jgs.me/${ID}"`);
  });

  it("寸法があれば og:image:width / height を出す", () => {
    const html = render(data(), () => <Head />);
    expect(html).toContain('property="og:image:width"');
    expect(html).toContain('property="og:image:height"');
  });

  it("寸法が無ければ og:image:width / height を出さない", () => {
    const html = render(data({ width: null, height: null }), () => <Head />);
    expect(html).not.toContain("og:image:width");
    expect(html).not.toContain("og:image:height");
  });
});

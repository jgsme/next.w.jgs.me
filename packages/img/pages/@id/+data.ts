import type { PageContextServer } from "vike/types";
import { render } from "vike/abort";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { sharedImages } from "@jigsaw/db";
import { MEDIA_BASE_URL } from "../../src/config";

type Context = PageContextServer & {
  env: { DB: D1Database };
  routeParams: { id: string };
};

export type ImageData = {
  id: string;
  ext: string;
  direct: string;
  width: number | null;
  height: number | null;
  created: string;
};

const data = async (c: Context): Promise<ImageData> => {
  const id = c.routeParams.id;

  const [row] = await drizzle(c.env.DB)
    .select()
    .from(sharedImages)
    .where(eq(sharedImages.id, id))
    .limit(1);

  // 行は消えうる (DELETE /api/images/:id)。消えた後も 200 を返すと
  // unfurl 側に空のカードが焼かれる。
  if (!row) throw render(404);

  return {
    id: row.id,
    ext: row.ext,
    direct: `${MEDIA_BASE_URL}/${row.id}.${row.ext}`,
    width: row.width,
    height: row.height,
    created: row.created,
  };
};

export default data;

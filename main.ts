import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { errors } from "https://deno.land/std@0.198.0/http/http_errors.ts";
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

const db = new Map();

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

type IndodaxResponse = {
  [key: string]: {
    last: number;
  };
};

cron("*/15 * * * *", async () => {
  const response = await axiod.get("https://indodax.com/api/ticker_all");
  const tickers: Entries<IndodaxResponse> = Object.entries(
    response.data.tickers
  );
  for (const [symbol, { last: value }] of tickers) {
    const [key, pair] = symbol.split("_");
    if (pair === "idr") {
      db.set(key, value);
    }
  }
});

const app = new Application();
const router = new Router();

router.get("/:coin", (ctx: Context) => {
  const coin = ctx.request.url.searchParams.get("coin");
  const result = db.get(coin);
  if (!result) return new errors.NotFound("coin name not found");

  return new Response(result);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });

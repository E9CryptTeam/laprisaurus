import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { getLogger } from "https://deno.land/std@0.198.0/log/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import {
  Application,
  Context,
  helpers,
  Router,
} from "https://deno.land/x/oak@v12.6.0/mod.ts";

const app = new Application();
const router = new Router();
const logger = getLogger("lapisaurus");
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

router.get("/", (ctx: Context) => {
  logger.debug(`Request from ${ctx.request.url}`);
  ctx.response.status = Status.OK;
  ctx.response.type = "json";
  ctx.response.body = { message: "Hello World" };
});

router.get("/:coin", (ctx: Context) => {
  const { coin } = helpers.getQuery(ctx, { mergeParams: true });
  const result = db.get(coin);
  if (!result) {
    ctx.response.status = Status.NotFound;
    ctx.response.type = "json";
    ctx.response.body = {
      message: "Coin not found",
    };
  }

  ctx.response.status = Status.OK;
  ctx.response.type = "json";
  ctx.response.body = {
    price: result,
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

// await app.listen({ port: 8000 });
const listener = Deno.listen({ port: 8000 });
logger.debug("Listening on http://localhost:8000");

for await (const conn of listener) {
  async () => {
    const requests = Deno.serveHttp(conn);
    for await (const { request, respondWith } of requests) {
      const response = await app.handle(request, conn);
      if (response) {
        respondWith(response);
      }
    }
  };
}

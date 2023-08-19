# Laprisaurus
Trying new Deno Serverless Platform known as [Deno Deploy][deno-deploy-url] to map [Indodax Ticker API][indodax-ticker-url] with simple key value store using [JS Map][js-map-url].

## TODO
- Can't wait to use official [DenoKV][deno-kv-url] as the key value store database instead of using JS Map lol.
- Better response handler xixixi
- Add other market ticker after have DenoKV access

## FAQ
- <b>What laprisaurus stand for</b> ? lapri is just a LAst PRice, and the saurus is just because i use Deno-saurus as you know it have dinosaurus logo. It's one of our service that implemented in go and used for our frontend modification.
- <b>Why you use this tho.</B> Hmm good question, we have cryptocurrency arbitrage microservice. Which use to compare every symbol/coin on every crypto exchange to get profit via percentage diff. As for now, we don't publish the repositories of that service yet, and this one is only use to change the price of the orderbook based on the pair of the coin that opened on exchange frontend via [Tampermonkey][tampermonkey-url] 

[deno-kv-url]: https://deno.com/kv
[deno-deploy-url]: https://deno.com/deploy
[indodax-ticker-url]: https://indodax.com/api/ticker_all
[js-map-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[tampermonkey-url]: https://www.tampermonkey.net/
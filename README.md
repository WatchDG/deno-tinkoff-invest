# tinkoff-invest

## install

add to `deps.ts`

```ts
export {TinkoffInvestAPI} from 'https://deno.land/x/tinkoff_invest@2.5.1/mod.ts';
```

## init

```ts
import {TinkoffInvestAPI} from './deps.ts';

(async () => {
    const baseUrl = 'https://api-invest.tinkoff.ru/openapi';
    const token = '...';

    const api = new TinkoffInvestAPI({
        baseUrl,
        token
    });

    // ...
})();
```

## methods

### get stocks

```ts
const stocks = (await api.stocks()).unwrap();
console.log(stocks);
```
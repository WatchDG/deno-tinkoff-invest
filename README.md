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

### get active orders

```ts
const activeOrders = (await api.activeOrders()).unwrap();
console.log(activeOrders);
```

### get operations

```ts
const toDate = new Date();
const fromDate = new Date(toDate);
fromDate.setMonth(fromDate.getMonth() - 1);
const operations = (await api.operations(fromDate, toDate)).unwrap();
console.log(operations);
```
# tinkoff-invest

## example

```ts
(async () => {
    const api = new API({
        baseUrl: "https://api-invest.tinkoff.ru/openapi",
        token: "...",
    });
    const operations = (await api.operations(
        new Date(Date.UTC(2020, 0, 1)),
        new Date(Date.UTC(2021, 1, 1)),
    )).unwrap();
    console.log(operations);
})();
```
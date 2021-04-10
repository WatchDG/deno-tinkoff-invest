import { fail, Instance, ok, tryCatch, tryCatchAsync } from "./deps.ts";
import type { TResult, TResultAsync } from "./deps.ts";

import type {
  Account,
  ActiveOrdersOptions,
  CurrencyPosition,
  MarketInstrument,
  Operation,
  OperationsOptions,
  Options,
  Order,
  PlacedLimitOrder,
  PlacedMarketOrder,
  PlaceLimitOrderOptions,
  PlaceMarketOrderOptions,
  PortfolioPosition,
  Response,
  ResponseError,
  UserAccount,
} from "./types.ts";

export class TinkoffInvestAPI {
  private readonly instance: Instance;

  constructor(options: Options) {
    this.instance = new Instance({
      baseUrl: new URL(options.baseUrl),
      headers: {
        Authorization: `Bearer ${options.token}`,
      },
    });
  }

  @tryCatch
  private static checkData<ResponseType>(
    status: number,
    headers: Headers,
    data?: ResponseType,
  ): TResult<ResponseType, Error> {
    if (status < 200 || status >= 300) {
      if (data) {
        const errorData = data as unknown as ResponseError;
        return fail(
          new Error(
            `[${errorData.payload.code}] ${errorData.payload.message}`,
          ),
        );
      }
      return fail(new Error(`[${status}]`));
    }
    return ok(data!);
  }

  @tryCatchAsync
  async stocks(): TResultAsync<MarketInstrument[], Error> {
    type rT = Response<{
      total: number;
      instruments: MarketInstrument[];
    }>;
    const {
      status,
      headers,
      data,
    } = (await this.instance.get<rT>("/market/stocks"))
      .unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload.instruments);
  }

  @tryCatchAsync
  async operations(
    from: Date,
    to: Date,
    options: OperationsOptions = {},
  ): TResultAsync<Operation[], Error> {
    type rT = Response<{
      operations: Operation[];
    }>;
    const { figi, account } = options;
    const params = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
    });
    if (figi) params.set("figi", figi);
    if (account) params.set("brokerAccountId", account);
    const { status, headers, data } =
      (await this.instance.get<rT>("/operations", {
        params,
      })).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload.operations);
  }

  @tryCatchAsync
  async activeOrders(
    options: ActiveOrdersOptions = {},
  ): TResultAsync<Order[], Error> {
    type rT = Response<Order[]>;
    const { account } = options;
    const params = new URLSearchParams();
    if (account) params.set("brokerAccountId", account);
    const { status, headers, data } = (await this.instance.get<rT>("/orders", {
      params,
    })).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload);
  }

  @tryCatchAsync
  async cancelOrder(orderId: string, options: Account = {}) {
    const { account } = options;
    const params = new URLSearchParams({
      orderId,
    });
    if (account) params.set("brokerAccountId", account);
    const { status, headers, data } =
      (await this.instance.post<undefined, Response<unknown>>(
        "/orders/cancel",
        void 0,
        {
          params,
        },
      )).unwrap();
    (await TinkoffInvestAPI.checkData(status, headers, data)).unwrap();
    return ok(null);
  }

  @tryCatchAsync
  async placeLimitOrder(
    options: PlaceLimitOrderOptions,
  ): TResultAsync<PlacedLimitOrder, Error> {
    type dT = Record<string, unknown>;
    type rT = Response<PlacedLimitOrder>;
    const { figi, operation, lots, price } = options;
    const params = new URLSearchParams({
      figi,
    });
    const payload = {
      operation,
      lots,
      price,
    };
    const { status, headers, data } = (await this.instance.post<dT, rT>(
      "/orders/limit-order",
      payload,
      {
        params,
      },
    )).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload);
  }

  @tryCatchAsync
  async placeMarketOrder(
    options: PlaceMarketOrderOptions,
  ): TResultAsync<PlacedMarketOrder, Error> {
    type dT = Record<string, unknown>;
    type rT = Response<PlacedMarketOrder>;
    const { figi, operation, lots } = options;
    const params = new URLSearchParams({
      figi,
    });
    const payload = {
      operation,
      lots,
    };
    const { status, headers, data } = (await this.instance.post<dT, rT>(
      "/orders/market-order",
      payload,
      {
        params,
      },
    )).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload);
  }

  @tryCatchAsync
  async accounts(): TResultAsync<UserAccount[], Error> {
    type rT = Response<{
      accounts: UserAccount[];
    }>;
    const { status, headers, data } =
      (await this.instance.get<rT>("/user/accounts")).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload.accounts);
  }

  @tryCatchAsync
  async portfolio(
    options: Account = {},
  ): TResultAsync<PortfolioPosition[], Error> {
    type rT = Response<{
      positions: PortfolioPosition[];
    }>;
    const { account } = options;
    const params = new URLSearchParams();
    if (account) params.set("brokerAccountId", account);
    const { status, headers, data } =
      (await this.instance.get<rT>("/portfolio", {
        params,
      })).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload.positions);
  }

  @tryCatchAsync
  async currencyPortfolio(
    options: Account = {},
  ): TResultAsync<CurrencyPosition[], Error> {
    type rT = Response<{
      currencies: CurrencyPosition[];
    }>;
    const { account } = options;
    const params = new URLSearchParams();
    if (account) params.set("brokerAccountId", account);
    const { status, headers, data } =
      (await this.instance.get<rT>("/portfolio/currencies", {
        params,
      })).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload.currencies);
  }
}

import { fail, Instance, ok, tryCatch, tryCatchAsync } from "./deps.ts";
import type { Result, ResultAsync } from "./deps.ts";

type Options = {
  baseUrl: string;
  token: string;
};

type Response<ResponseType> = {
  trackingId: string;
  payload: ResponseType;
  status: "OK";
};

type ResponseError = {
  trackingId: string;
  payload: {
    message: string;
    code: string;
  };
  status: "Error";
};

type InstrumentType = "Stock" | "Currency" | "Bond" | "Etf";
type Currency =
  | "RUB"
  | "USD"
  | "EUR"
  | "GBP"
  | "HKD"
  | "CHF"
  | "JPY"
  | "CNY"
  | "TRY";
type MarketInstrument = {
  figi: string;
  ticker: string;
  isin?: string;
  minPriceIncrement?: number;
  lot: number;
  currency?: Currency;
  name: string;
  type: InstrumentType;
};
type OperationStatus = "Done" | "Decline" | "Progress";
type OperationTrade = {
  tradeId: string;
  date: string;
  price: number;
  quantity: number;
};
type MoneyAmount = {
  currency: Currency;
  value: number;
};
type OperationTypeWithCommission =
  | "Buy"
  | "BuyCard"
  | "Sell"
  | "BrokerCommission"
  | "ExchangeCommission"
  | "ServiceCommission"
  | "MarginCommission"
  | "OtherCommission"
  | "PayIn"
  | "PayOut"
  | "Tax"
  | "TaxLucre"
  | "TaxDividend"
  | "TaxCoupon"
  | "TaxBack"
  | "Repayment"
  | "PartRepayment"
  | "Coupon"
  | "Dividend"
  | "SecurityIn"
  | "SecurityOut";
type Operation = {
  id: string;
  status: OperationStatus;
  trades?: OperationTrade[];
  commission?: MoneyAmount;
  currency: Currency;
  payment: number;
  price?: number;
  quantity?: number;
  figi?: string;
  instrumentType?: InstrumentType;
  isMarginCall: boolean;
  date: string;
  operationType?: OperationTypeWithCommission;
};

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
  ): Result<ResponseType, Error> {
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
  async stocks(): ResultAsync<MarketInstrument[], Error> {
    type PayloadType = {
      total: number;
      instruments: MarketInstrument[];
    };
    const {
      status,
      headers,
      data,
    } = (await this.instance.get<Response<PayloadType>>("/market/stocks"))
      .unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload.instruments);
  }

  @tryCatchAsync
  async operations(
    from: Date,
    to: Date,
  ): ResultAsync<Operation[], Error> {
    type PayloadType = {
      operations: Operation[];
    };
    const params = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
    });
    const { status, headers, data } =
      (await this.instance.get<Response<PayloadType>>("/operations", {
        params,
      })).unwrap();
    const _data = (await TinkoffInvestAPI.checkData(status, headers, data))
      .unwrap();
    return ok(_data.payload.operations);
  }
}

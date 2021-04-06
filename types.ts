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
export type MarketInstrument = {
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
export type Operation = {
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
export type OperationType = "Buy" | "Sell";
type OrderStatus =
  | "New"
  | "PartiallyFill"
  | "Fill"
  | "Cancelled"
  | "Replaced"
  | "PendingCancel"
  | "Rejected"
  | "PendingReplace"
  | "PendingNew";
type OrderType = "Limit" | "Market";
export type Order = {
  orderId: string;
  figi: string;
  operation: OperationType;
  status: OrderStatus;
  requestedLots: number;
  executedLots: number;
  type: OrderType;
  price: number;
};
export type PlacedLimitOrder = {
  orderId: string;
  operation: OperationType;
  status: OrderStatus;
  rejectReason?: string;
  message?: string;
  requestedLots: number;
  executedLots: number;
  commission?: MoneyAmount;
};
export type PlacedMarketOrder = {
  orderId: string;
  operation: OperationType;
  status: OrderStatus;
  rejectReason?: string;
  message?: string;
  requestedLots: number;
  executedLots: number;
  commission?: MoneyAmount;
};
type BrokerAccountType = "Tinkoff" | "TinkoffIis";
export type UserAccount = {
  brokerAccountType: BrokerAccountType;
  brokerAccountId: string;
};
export type PortfolioPosition = {
  figi: string;
  ticker?: string;
  isin?: string;
  instrumentType: InstrumentType;
  balance: number;
  blocked?: number;
  expectedYield?: MoneyAmount;
  lots: number;
  averagePositionPrice?: MoneyAmount;
  averagePositionPriceNoNkd?: MoneyAmount;
  name: string;
};
export type CurrencyPosition = {
  currency: Currency;
  balance: number;
  blocked?: number;
};

export type Options = {
  baseUrl: string;
  token: string;
};

export type Response<ResponseType> = {
  trackingId: string;
  payload: ResponseType;
  status: "OK";
};

export type ResponseError = {
  trackingId: string;
  payload: {
    message: string;
    code: string;
  };
  status: "Error";
};

export type OperationsOptions = {
  figi?: string;
  account?: string;
};
export type ActiveOrdersOptions = {
  account?: string;
};
export type PlaceLimitOrderOptions = {
  figi: string;
  lots: number;
  operation: OperationType;
  price: number;
};
export type PlaceMarketOrderOptions = {
  figi: string;
  lots: number;
  operation: OperationType;
};

export interface Account {
  account?: string;
}

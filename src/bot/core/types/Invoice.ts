export enum InvoiceStatus {
  Active = 'active',
  Paid = 'paid',
  Expired = 'expired',
  Unknown = 'unknown',
}

export type PaidBtnName = 'viewItem' | 'openChannel' | 'openBot' | 'callback';

export enum CurrencyType {
  Crypto = 'crypto',
  Fiat = 'fiat',
  Unknown = 'unknown',
}

export type CryptoCurrencyCode =
  | 'USDT'
  | 'TON'
  | 'BTC'
  | 'ETH'
  | 'LTC'
  | 'BNB'
  | 'TRX'
  | 'USDC'
  | 'JET';
export type FiatCurrencyCode =
  | 'USD'
  | 'EUR'
  | 'RUB'
  | 'BYN'
  | 'UAH'
  | 'GBP'
  | 'CNY'
  | 'KZT'
  | 'UZS'
  | 'GEL'
  | 'TRY'
  | 'AMD'
  | 'THB'
  | 'INR'
  | 'BRL'
  | 'IDR'
  | 'AZN'
  | 'AED'
  | 'PLN'
  | 'ILS';
export type CurrencyCode =
  | CryptoCurrencyCode
  | FiatCurrencyCode
  | 'KGS'
  | 'TJS';

export type Invoice = {
  /** Invoice identifier */
  id: number;
  /** Invoice status */
  status: InvoiceStatus;
  /** Invoice hash */
  hash: string;
  /** Invoice currency type */
  currencyType: CurrencyType;
  /** Invoice currency code */
  currency: CurrencyCode;
  /** Invoice amount */
  amount: string;
  /** Invoice pay url for user by bot */
  botPayUrl: string;
  /** Invoice pay url for user by mini app */
  miniAppPayUrl: string;
  /** Invoice pay url for user by web app */
  webAppPayUrl: string;
  /** Is invoice allow user comment */
  isAllowComments: boolean;
  /** Is user can pay invoice anonymously */
  isAllowAnonymous: boolean;
  /** Invoice created date */
  createdAt: Date;
  /** Text of the hidden message, only if set in invoice creation */
  hiddenMessage?: string;
  /** Is invoice paid anonymously, only for paid invoice */
  isPaidAnonymously?: boolean;
  /** Invoice paid date, only for paid invoice */
  paidAt?: Date;
  /** Expiration date, only if set pay limit time in invoice creation */
  expirationDate?: Date;
  /** Invoice displayed to user description, only if `description` passed in invoice creation */
  description?: string;
  /**
   * Invoice visible only to app payload, only if `payload` passed in invoice creation
   *
   * If for invoice creation passed not string in this field, will be converted by JSON.parse
   */
  payload?: any;
  /**
   * Invoice left user comment, only if set `isAllowComments` to true in invoice creation
   * and user left comment
   */
  comment?: string;
  /**
   * Invoice displayed to user paid button name,
   * only if `paidBtnName` passed in invoice creation
   */
  paidBtnName?: PaidBtnName;
  /**
   * Invoice displayed to user paid button url,
   * only if `paidBtnUrl` passed in invoice creation
   */
  paidBtnUrl?: string;
  /**
   * Asset of service fees charged when the invoice was paid, only if status is InvoiceStatus.Paid
   */
  feeAsset?: CryptoCurrencyCode;
  /**
   * Amount of service fees charged when the invoice was paid, only if status is InvoiceStatus.Paid
   */
  fee?: number;
  /**
   * Price of the asset in USD, only if status is InvoiceStatus.Paid
   */
  usdRate?: number;
  /**
   * List of assets which can be used to pay the invoice, only if set in invoice creation
   */
  acceptedAssets?: CryptoCurrencyCode[];
  /**
   * Cryptocurrency alphabetic code for which the invoice was paid,
   * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
   */
  paidAsset?: CryptoCurrencyCode;
  /**
   * Amount of the invoice for which the invoice was paid,
   * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
   */
  paidAmount?: number;
  /**
   * The rate of the paid_asset valued in the fiat currency,
   * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
   */
  paidFiatRate?: number;
};

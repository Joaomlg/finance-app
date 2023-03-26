export type CountryCode = 'BR' | 'CO' | 'MX';

export type Currency = 'BRL' | 'COP' | 'MXN';

export type PageResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

import { Account } from './account';
import { Currency } from './common';

export type TransactionMerchant = {
  /** The URL to the merchant's logo. */
  logo: string;
  /** The URL to the merchant's website. */
  website: string;
  /** The name of the merchant. */
  merchant_name: string;
};

export type TransactionCategory =
  | 'Bills & Utilities'
  | 'Credits & Loans'
  | 'Deposits'
  | 'Fees & Charges'
  | 'Food & Groceries'
  | 'Home & Life'
  | 'Income & Payments'
  | 'Insurance'
  | 'Investments & Savings'
  | 'Online Platforms & Leisure'
  | 'Personal Shopping'
  | 'Taxes'
  | 'Transfers'
  | 'Transport & Travel'
  | 'Unknown'
  | 'Withdrawal & ATM'
  | 'null';

export type TransactionSubcategory =
  | 'Electricity & Energy'
  | 'Rent'
  | 'Telecommunications'
  | 'Water'
  | 'Auto'
  | 'Credit Card'
  | 'Instalment'
  | 'Interest & Charges'
  | 'Mortgage'
  | 'Pay Advance'
  | 'Personal'
  | 'Adjustments'
  | 'Bank Fees'
  | 'Chargeback'
  | 'Refund'
  | 'Blocked Balances'
  | 'Alimony'
  | 'Alcohol & Tobacco'
  | 'Bakery & Coffee'
  | 'Bars & Nightclubs'
  | 'Convenience Store'
  | 'Delivery'
  | 'Groceries'
  | 'Restaurants'
  | 'Education'
  | 'Gyms & Fitness'
  | 'Hair & Beauty'
  | 'Health'
  | 'Home Decor & Appliances'
  | 'Laundry & Dry Cleaning'
  | 'Pharmacies'
  | 'Professional Services'
  | 'Veterinary Services'
  | 'Freelance'
  | 'Interest'
  | 'Retirement'
  | 'Salary'
  | 'Government'
  | 'Home Insurance'
  | 'Auto Insurance'
  | 'Health & Life Insurance'
  | 'Savings'
  | 'Fixed income'
  | 'Equity'
  | 'Investment Funds'
  | 'Derivatives'
  | 'Cryptocurrencies'
  | 'Apps, Software and Cloud Services'
  | 'Events, Parks and Museums'
  | 'Gambling'
  | 'Gaming'
  | 'Lottery'
  | 'Movie & Audio'
  | 'Books & News'
  | 'Clothing & Accessories'
  | 'Department Store'
  | 'Electronics'
  | 'E-commerce'
  | 'Gifts'
  | 'Office Supplies'
  | 'Pet Supplies'
  | 'Auto Tax & Fees'
  | 'Donation'
  | 'Government Fees'
  | 'Income Tax'
  | 'Real Estate Tax & Fees'
  | 'Tax Return'
  | 'Accommodation'
  | 'Auto Expenses'
  | 'Auto Rental'
  | 'Flights'
  | 'Gas'
  | 'Mileage Programs'
  | 'Parking & Tolls'
  | 'Public Transit'
  | 'Taxis & Rideshares'
  | 'Other'
  | 'null';

export type TransactionType = 'INFLOW' | 'OUTFLOW' | null;

export type TransactionStatus = 'PENDING' | 'PROCESSED' | 'UNCATEGORIZED' | null;

export type TransactionCreditCardBillStatus = 'PAID' | 'CLOSED' | 'OPEN' | 'FUTURE' | null;

export type TransactionCreditCardData = {
  /** The ISO-8601 timestamp when the data point was collected. */
  collected_at: string;
  /** The title of the monthly credit card bill the transaction belongs to. */
  bill_name: string;
  /** The status of the bill that the transaction appears on. */
  bill_status: TransactionCreditCardBillStatus;
  /** The aggregate bill amount, as of `collected_at`. */
  bill_amount: number;
  /** The total amount of the previous month's bill, if available. */
  previous_bill_total: string;
};

export type Transaction = {
  /** Belvo's unique ID for the transaction. */
  id: string;
  /** Details regarding the account. */
  account: Account;
  /** The ISO-8601 timestamp when the data point was collected. */
  collected_at: string;
  /** The ISO-8601 timestamp of when the data point was last updated in Belvo's database. */
  created_at: string;
  /** The date when the transaction occurred, in `YYYY-MM-DD` format. */
  value_date: string;
  /** The ISO timestamp when the transaction was processed and accounted for by the institution. */
  account_date: string;
  /**
   * The transaction amount.
   *
   * Note: The amount displayed is always positive as we indicate the direction of the transaction in the type parameter.
   */
  amount: number;
  /** The balance at the end of the transaction. */
  balance: number;
  /** The currency of the transaction. */
  currency: Currency;
  /** The description of transaction provided by the institution. Usually this is the text that the end user sees in the online platform. */
  description: string;
  /** Additional observations provided by the institution on the transaction. */
  observations: string;
  /** Additional data regarding the merchant involved in the transaction. */
  merchant: TransactionMerchant;
  /** The name of the category to which this transaction belongs. */
  category: TransactionCategory;
  /** The transactions subcategory. */
  subcategory: TransactionSubcategory;
  /** The reference number of the transaction, provided by the bank. */
  reference: string;
  /** The direction of the transaction. */
  type: TransactionType;
  /** The status of the transaction. */
  status: TransactionStatus;
  /** Additional data provided by the institution for credit card transactions. */
  credit_card_data: TransactionCreditCardData;
};
